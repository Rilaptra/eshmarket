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
  url?: string;

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
  username?: "Erzy.sh Market";
  avatar_url?: "https://i.ibb.co/zbqtFBQ/1727490493494.jpg";
}

export interface DiscordWebhookResponse {
  id: string;
  timestamp: string;
}

interface WebhookData {
  id: string;
  type: number;
  guild_id?: string;
  channel_id: string;
  name: string;
  avatar: string | null;
  token: string;
  application_id: string | null;
  url: string;
}

interface EditWebhookOptions {
  content?: string;
  embeds?: DiscordEmbedMessage[];
  attachments?: File[];
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
export function colorConverter(color: DiscordEmbedMessage["color"]) {
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
  message: string | DiscordWebhookMessage | FormData
): Promise<DiscordWebhookResponse> {
  // Check if te message is FormData
  if (message instanceof FormData) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: message, // Mengirimkan FormData berisi file dan embed
    });

    if (!response.ok) {
      console.error(`Failed to send Discord webhook: ${response.status}`);
      throw new Error(`Failed to send Discord webhook: ${response.status}`);
    }

    return await response.json();
  }

  const data: DiscordWebhookMessage =
    typeof message === "string"
      ? {
          content: message,
          avatar_url: "https://i.ibb.co/zbqtFBQ/1727490493494.jpg",
          username: "Erzy.sh Market",
        }
      : message;
  data.avatar_url = "https://i.ibb.co/zbqtFBQ/1727490493494.jpg";
  data.username = "Erzy.sh Market";

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

  const response = await fetch(`${webhookUrl}?wait=true`, {
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

  return await response.json();
}

export async function createDM(userId: string, token: string): Promise<string> {
  const url = "https://discord.com/api/v10/users/@me/channels";
  const payload = {
    recipient_id: userId,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data.id; // Mengembalikan DM channel ID
}

export async function sendMessageWithFileAndEmbed(
  channelId: string,
  token: string,
  file: File,
  embed_payload: DiscordEmbedMessage[]
) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;

  const formData = new FormData();

  // Menambahkan file ke formData
  formData.append("file", file, file.name);

  // Menambahkan embed ke formData

  formData.append("payload_json", JSON.stringify({ embeds: embed_payload }));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      // Jangan atur Content-Type karena fetch secara otomatis akan mengatur multipart boundary.
    },
    body: formData,
  });

  if (response.ok) {
    console.log("Message sent successfully with file and embed!");
  } else {
    console.error("Error sending message:", response.statusText);
  }
}

export async function getWebhook(webhookId: string): Promise<{
  data: WebhookData;
  edit: (options: EditWebhookOptions) => Promise<WebhookData>;
  delete: () => Promise<void>;
}> {
  const webhook = `${webhookUrl}/messages/${webhookId}?wait=true`;
  const response = await fetch(webhook);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch webhook: ${response.status} ${response.statusText}`
    );
  }

  const data: WebhookData = await response.json();

  const edit = async (options: EditWebhookOptions): Promise<WebhookData> => {
    const editResponse = await fetch(webhook, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!editResponse.ok) {
      throw new Error(
        `Failed to edit webhook: ${editResponse.status} ${editResponse.statusText}`
      );
    }

    return editResponse.json();
  };

  const deleteWebhook = async (): Promise<void> => {
    const deleteResponse = await fetch(webhookUrl, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) {
      throw new Error(
        `Failed to delete webhook: ${deleteResponse.status} ${deleteResponse.statusText}`
      );
    }
  };

  return {
    data,
    edit,
    delete: deleteWebhook,
  };
}
