import { createUser, deleteUser, updateUser } from "@/data/user";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    if (eventType === "user.created") {
      const userData = evt.data;
      const user = {
        clerkId: userData.id,
        email: userData.email_addresses[0].email_address,
        fullName: userData.first_name + " " + userData.last_name,
        imageUrl: userData.image_url || undefined,
      };

      await createUser(user);
    } else if (eventType === "user.updated") {
      const userData = evt.data;
      const user = {
        clerkId: userData.id,
        email: userData.email_addresses[0].email_address,
        fullName: userData.first_name + " " + userData.last_name,
        imageUrl: userData.image_url || null,
      };

      await updateUser(user.clerkId, {
        email: user.email,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
      });
    } else if (eventType === "user.deleted") {
      const userData = evt.data;
      const clerkId = userData.id;
      if (!clerkId) {
        throw new Error("clerkId is undefined");
      }
      await deleteUser(clerkId);
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

export async function GET() {
  return new Response("Webhook endpoint is active", { status: 200 });
}
