import {
  DiscordEmbedMessage,
  DiscordWebhookMessage,
  sendDiscordWebhook,
} from "@/lib/discord";
import { NextResponse } from "next/server";

export async function GET() {
  // const message = "Hello, this is a test webhook!";
  const messageEmbed: DiscordEmbedMessage = {
    title: "Hello from webhook!",
    fields: [
      {
        name: "Username",
        value: "John Doe",
        inline: true,
      },
      {
        name: "Amount",
        value: "1000 USD",
        inline: true,
      },
      {
        name: "Date",
        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
        inline: true,
      },
    ],
    color: "GREEN",
    footer: {
      text: "Donation ID: 12345",
    },
    timestamp: new Date().toISOString(),
  };

  const webhookMessage: DiscordWebhookMessage = {
    avatar_url: "https://i.ibb.co/zbqtFBQ/1727490493494.jpg",
    username: "Erzy.sh Market",
    embeds: [messageEmbed],
  };
  const res = await sendDiscordWebhook(webhookMessage);
  return NextResponse.json({ res }, { status: 200 });
}
