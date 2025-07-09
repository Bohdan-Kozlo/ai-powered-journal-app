import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AIMessage } from "@langchain/core/messages";
import { RunnableLambda } from "@langchain/core/runnables";

export interface JournalAnalysisResult {
  summary: string;
  mood: "HAPPY" | "SAD" | "ANGRY" | "NEUTRAL" | "EXCITED" | "CALM";
  negative: boolean;
  moodScore: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
}

function initializeLLM() {
  const useOpenAI =
    process.env.NODE_ENV === "production" || process.env.USE_OPENAI === "true";

  if (useOpenAI) {
    return new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    return new ChatOllama({
      model: process.env.OLLAMA_MODEL || "llama3.2:latest",
      temperature: 0.3,
    });
  }
}

const analysisSchema = `{{
  "summary": "string - A concise summary of the journal entry content",
  "mood": "string - One of: HAPPY, SAD, ANGRY, NEUTRAL, EXCITED, CALM",
  "negative": "boolean - Whether the overall sentiment is negative",
  "moodScore": "number - Overall mood score from 0 (very negative) to 100 (very positive)",
  "positivePercentage": "number - Percentage of positive emotions (0-100)",
  "neutralPercentage": "number - Percentage of neutral emotions (0-100)",
  "negativePercentage": "number - Percentage of negative emotions (0-100)"
}}`;

const analysisPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert AI psychologist analyzing a personal journal entry.
Your task is to analyze the emotional content, mood, and sentiment of the provided text.

Output your answer as JSON that matches the given schema: \`\`\`json
${analysisSchema}
\`\`\`

Make sure to wrap the answer in \`\`\`json and \`\`\` tags. Do not add any explanation or extra text.

Example:
\`\`\`json
{{
  "summary": "Today was a productive and positive day. The author completed important tasks and felt accomplished.",
  "mood": "HAPPY",
  "negative": false,
  "moodScore": 85,
  "positivePercentage": 70,
  "neutralPercentage": 20,
  "negativePercentage": 10
}}
\`\`\``,
  ],
  ["human", "{content}"],
]);

const extractAnalysisJson = (output: AIMessage): JournalAnalysisResult => {
  const text = output.content as string;

  const pattern = /```json([\s\S]*?)```/g;

  const matches = text.match(pattern);

  try {
    if (matches && matches.length > 0) {
      let jsonStr = matches[0].replace(/```json|```/g, "").trim();

      if (!jsonStr.startsWith("{")) {
        jsonStr = `{${jsonStr}}`;
      }

      const parsed = JSON.parse(jsonStr);

      const result: JournalAnalysisResult = {
        summary: parsed.summary || "Unable to analyze the entry content.",
        mood: ["HAPPY", "SAD", "ANGRY", "NEUTRAL", "EXCITED", "CALM"].includes(
          parsed.mood
        )
          ? parsed.mood
          : "NEUTRAL",
        negative: Boolean(parsed.negative),
        moodScore: Math.max(0, Math.min(100, Number(parsed.moodScore) || 50)),
        positivePercentage: Math.max(
          0,
          Math.min(100, Number(parsed.positivePercentage) || 33)
        ),
        neutralPercentage: Math.max(
          0,
          Math.min(100, Number(parsed.neutralPercentage) || 34)
        ),
        negativePercentage: Math.max(
          0,
          Math.min(100, Number(parsed.negativePercentage) || 33)
        ),
      };

      const totalPercentage =
        result.positivePercentage +
        result.neutralPercentage +
        result.negativePercentage;
      if (totalPercentage !== 100) {
        const factor = 100 / totalPercentage;
        result.positivePercentage = Math.round(
          result.positivePercentage * factor
        );
        result.neutralPercentage = Math.round(
          result.neutralPercentage * factor
        );
        result.negativePercentage =
          100 - result.positivePercentage - result.neutralPercentage;
      }

      return result;
    } else {
      throw new Error("No JSON block found in output");
    }
  } catch {
    console.error("Failed to parse JSON from LLM output:", text);
    throw new Error(`Failed to parse: ${text}`);
  }
};

export async function analyzeJournalEntry(
  content: string
): Promise<JournalAnalysisResult> {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error("Journal content is empty");
    }

    const llm = initializeLLM();

    const chain = analysisPrompt
      .pipe(llm)
      .pipe(new RunnableLambda({ func: extractAnalysisJson }));

    const result = await chain.invoke({
      content: content.trim(),
    });

    return result;
  } catch (error) {
    console.error("Error analyzing journal entry:", error);

    return {
      summary: "Unable to analyze the journal entry content at this time.",
      mood: "NEUTRAL",
      negative: false,
      moodScore: 50,
      positivePercentage: 33,
      neutralPercentage: 34,
      negativePercentage: 33,
    };
  }
}

const extractInsightsJson = (output: AIMessage): string => {
  const text = output.content as string;

  const jsonPattern = /```json([\s\S]*?)```/g;
  const matches = text.match(jsonPattern);

  if (matches && matches.length > 0) {
    try {
      let jsonStr = matches[0].replace(/```json|```/g, "").trim();

      if (!jsonStr.startsWith("{")) {
        jsonStr = `{${jsonStr}}`;
      }

      const parsed = JSON.parse(jsonStr);
      return parsed.insights || text;
    } catch {
      return text;
    }
  }

  return text;
};

const insightPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful AI life coach. Based on the following journal analysis data, provide 2-3 brief, encouraging insights or suggestions for the user.

Provide practical, positive advice focusing on patterns, emotional well-being, and personal growth.
Keep it concise and encouraging (2-3 sentences maximum).

You can either respond in plain text or as JSON:
\`\`\`json
{{
  "insights": "Your insights here..."
}}
\`\`\``,
  ],
  ["human", "{analysisData}"],
]);

export async function getJournalInsights(
  analyses: JournalAnalysisResult[]
): Promise<string> {
  try {
    if (analyses.length === 0) {
      return "No journal entries to analyze yet. Start writing to get personalized insights!";
    }

    const llm = initializeLLM();

    const chain = insightPrompt
      .pipe(llm)
      .pipe(new RunnableLambda({ func: extractInsightsJson }));

    const analysisData = analyses
      .map(
        (analysis, index) =>
          `Entry ${index + 1}: Mood: ${analysis.mood}, Score: ${
            analysis.moodScore
          }, Summary: ${analysis.summary}`
      )
      .join("\n");

    const result = await chain.invoke({
      analysisData,
    });

    return result || "Keep up the great work with your journaling!";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Keep up the great work with your journaling! Regular reflection is a powerful tool for personal growth.";
  }
}

const queryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful AI assistant specializing in journal analysis and personal reflection. 
You have access to the user's journal entries and can help them understand patterns, emotions, and insights from their writing.

Based on the provided journal entries, please answer the user's question in a helpful, encouraging, and insightful way.
Be specific when referencing entries, but maintain privacy and respect.

Keep responses conversational and supportive, focusing on growth and self-awareness.

Journal Entries:
{journalContext}`,
  ],
  ["human", "{query}"],
]);

const extractQueryResponse = (output: AIMessage): string => {
  const text = output.content as string;
  return text.trim();
};

export async function handleJournalQuery(
  query: string,
  entries: Array<{
    id: string;
    content: string;
    createdAt: string | Date;
    journalAnalysis?: {
      summary?: string;
      mood?: string;
    } | null;
  }>
): Promise<string> {
  try {
    if (!query || query.trim().length === 0) {
      return "Please ask me a question about your journal entries.";
    }

    if (entries.length === 0) {
      return "You haven't written any journal entries yet! Start journaling to get personalized insights and answers to your questions.";
    }

    const recentEntries = entries.slice(0, 10);
    const journalContext = recentEntries
      .map((entry, index) => {
        const date = new Date(entry.createdAt).toLocaleDateString();
        const summary =
          entry.journalAnalysis?.summary || entry.content.slice(0, 100) + "...";
        const mood = entry.journalAnalysis?.mood || "Unknown";

        return `Entry ${index + 1} (${date}):
Mood: ${mood}
Summary: ${summary}
Content: ${entry.content.slice(0, 200)}${
          entry.content.length > 200 ? "..." : ""
        }

---`;
      })
      .join("\n");

    const llm = initializeLLM();

    const chain = queryPrompt
      .pipe(llm)
      .pipe(new RunnableLambda({ func: extractQueryResponse }));

    const response = await chain.invoke({
      query: query.trim(),
      journalContext,
    });

    return (
      response ||
      "I'm sorry, I couldn't process your question at the moment. Please try again."
    );
  } catch (error) {
    console.error("Error handling journal query:", error);
    return "I'm sorry, I couldn't process your question at the moment. Please try again.";
  }
}
