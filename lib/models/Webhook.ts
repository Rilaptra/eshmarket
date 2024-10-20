import mongoose, { Document, Model } from "mongoose";

export interface IDiscordWebhook extends Document {
  messageid: string;
  timestamp: string;
  userId: string;
  origin: string;
}

const DiscordWebhookSchema = new mongoose.Schema<IDiscordWebhook>({
  messageid: { type: String, required: true },
  timestamp: { type: String, required: true },
  userId: { type: String, required: true },
  origin: { type: String, required: true },
});

const DiscordWebhook: Model<IDiscordWebhook> =
  mongoose.models.DiscordWebhook ||
  mongoose.model<IDiscordWebhook>("DiscordWebhook", DiscordWebhookSchema);

export default DiscordWebhook;
