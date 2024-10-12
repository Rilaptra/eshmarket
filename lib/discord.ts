import { NextResponse } from "next/server";

export interface DiscordEmbedMessage {
  title: string;
  description?: string;
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  color:
    | number
    | "GREEN"
    | "RED"
    | "PURPLE"
    | "BLUE"
    | "CYAN"
    | "YELLOW"
    | "ORANGE"
    | "PINK"
    | "GRAY"
    | "BLACK"
    | "WHITE"
    | "RANDOM";
  footer?: {
    text: string;
  };
  timestamp: string;
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
}

export interface DiscordWebhookMessage {
  content?: string;
  embeds?: DiscordEmbedMessage[];
  username: "Erzy.sh Market";
  avatar_url: "https://i.ibb.co/zbqtFBQ/1727490493494.jpg";
  tts?: boolean;
  file?: {
    attachment: string;
    name: string;
  };
  allowed_mentions?: {
    parse?: string[];
    roles?: string[];
    users?: string[];
  };
  components?: {};
}

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
if (!webhookUrl) {
  console.error("No Discord webhook URL found!");
  throw new Error("No Discord webhook URL found!");
}

/**
 * Converts a color string or number to a Discord-compatible color number.
 *
 * @param color - The color to convert. Can be a string (case-insensitive) representing a color name,
 * a hex color code starting with '#', or a number representing the color.
 *
 * @returns The Discord-compatible color number.
 *
 * @throws Will throw an error if the provided color is invalid.
 *
 * @example
 * colorConverter("green"); // Returns 0x00ff00
 * colorConverter("#ff0000"); // Returns 0xff0000
 * colorConverter(0x0000ff); // Returns 0x0000ff
 * colorConverter("invalid"); // Throws an error
 */
export function colorConverter(color: string | number) {
  if (typeof color === "number") return color;
  if (color.startsWith("#")) return parseInt(color.slice(1), 16);
  switch (color) {
    case "GREEN":
      return 0x00ff00;
    case "RED":
      return 0xff0000;
    case "BLUE":
      return 0x0000ff;
    case "YELLOW":
      return 0xffff00;
    case "PURPLE":
      return 0x800080;
    case "ORANGE":
      return 0xffa500;
    case "PINK":
      return 0xffc0cb;
    case "GRAY":
      return 0x808080;
    case "BLACK":
      return 0x000000;
    case "WHITE":
      return 0xffffff;
    case "CYAN":
      return 0x00ffff;
    case "RANDOM":
      return Math.floor(Math.random() * 0xffffff);
    default:
      throw new Error(`Invalid color: ${color}`);
  }
}

export async function sendDiscordWebhook(
  message: string | DiscordWebhookMessage
) {
  const data: DiscordWebhookMessage =
    typeof message === "string"
      ? {
          content: message,
          avatar_url: "https://i.ibb.co/zbqtFBQ/1727490493494.jpg",
          username: "Erzy.sh Market",
        }
      : message;

  data.embeds = data.embeds
    ? data.embeds.map((embed) => {
        embed.color = colorConverter(embed.color);
        embed.timestamp =
          typeof embed.timestamp === "string"
            ? embed.timestamp
            : new Date().toISOString();
        return embed;
      })
    : undefined;

  console.log(data, webhookUrl);
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    console.error(`Failed to send Discord webhook: ${response.status}`);
    throw new Error(`Failed to send Discord webhook: ${response.status}`);
  }
  return response;
}
