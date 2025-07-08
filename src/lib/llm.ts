import { z } from "zod";
import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const JournalAnalysisSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of the journal entry content"),
  mood: z
    .enum(["HAPPY", "SAD", "ANGRY", "NEUTRAL", "EXCITED", "CALM"])
    .describe("The primary mood detected in the entry"),
  negative: z.boolean().describe("Whether the overall sentiment is negative"),
  moodScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall mood score from 0 (very negative) to 100 (very positive)"
    ),
  positivePercentage: z
    .number()
    .min(0)
    .max(100)
    .describe("Percentage of positive emotions in the text"),
  neutralPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe("Percentage of neutral emotions in the text"),
  negativePercentage: z
    .number()
    .min(0)
    .max(100)
    .describe("Percentage of negative emotions in the text"),
});

export type JournalAnalysisResult = z.infer<typeof JournalAnalysisSchema>;

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
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      model: process.env.OLLAMA_MODEL || "llama3.2:latest",
      temperature: 0.3,
    });
  }
}

const analysisPrompt = ChatPromptTemplate.fromTemplate(`
You are an expert AI psychologist analyzing a personal journal entry. 
Your task is to analyze the emotional content, mood, and sentiment of the provided text.

Please analyze the following journal entry and provide a structured response:

Journal Entry:
{content}

Instructions:
1. Provide a concise summary (2-3 sentences) of the main themes and events
2. Identify the primary mood from: HAPPY, SAD, ANGRY, NEUTRAL, EXCITED, CALM
3. Determine if the overall sentiment is negative (true/false)
4. Rate the overall mood on a scale of 0-100 (0 = very negative, 50 = neutral, 100 = very positive)
5. Estimate percentages for positive, neutral, and negative emotions (must sum to 100)

Be empathetic, accurate, and focus on the emotional undertones rather than just surface-level content.
`);

export async function analyzeJournalEntry(
  content: string
): Promise<JournalAnalysisResult> {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error("Journal content is empty");
    }

    const llm = initializeLLM();

    const structuredLlm = llm.withStructuredOutput(JournalAnalysisSchema, {
      name: "journal_analysis",
    });

    const chain = analysisPrompt.pipe(structuredLlm);

    const result = await chain.invoke({
      content: content.trim(),
    });

    const totalPercentage =
      result.positivePercentage +
      result.neutralPercentage +
      result.negativePercentage;

    if (totalPercentage !== 100) {
      const factor = 100 / totalPercentage;
      result.positivePercentage = Math.round(
        result.positivePercentage * factor
      );
      result.neutralPercentage = Math.round(result.neutralPercentage * factor);
      result.negativePercentage =
        100 - result.positivePercentage - result.neutralPercentage;
    }

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

const InsightsSchema = z.object({
  insights: z
    .string()
    .describe(
      "2-3 brief, encouraging insights or suggestions for the user based on their journal analysis"
    ),
});

export async function getJournalInsights(
  analyses: JournalAnalysisResult[]
): Promise<string> {
  try {
    if (analyses.length === 0) {
      return "No journal entries to analyze yet. Start writing to get personalized insights!";
    }

    const llm = initializeLLM();

    const structuredLlm = llm.withStructuredOutput(InsightsSchema, {
      name: "journal_insights",
    });

    const insightPrompt = ChatPromptTemplate.fromTemplate(`
You are a helpful AI life coach. Based on the following journal analysis data, provide 2-3 brief, encouraging insights or suggestions for the user.

Analysis Data:
{analysisData}

Provide practical, positive advice focusing on patterns, emotional well-being, and personal growth.
Keep it concise and encouraging (2-3 sentences maximum).
`);

    const analysisData = analyses
      .map(
        (analysis, index) =>
          `Entry ${index + 1}: Mood: ${analysis.mood}, Score: ${
            analysis.moodScore
          }, Summary: ${analysis.summary}`
      )
      .join("\n");

    const result = await insightPrompt.pipe(structuredLlm).invoke({
      analysisData,
    });

    return result.insights || "Keep up the great work with your journaling!";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Keep up the great work with your journaling! Regular reflection is a powerful tool for personal growth.";
  }
}
