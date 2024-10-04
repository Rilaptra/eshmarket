import mongoose, { Document, Model } from "mongoose";

export interface IDonation extends Document {
  transactionId: string;
  supporterName: string;
  amount: number;
  createdAt: Date;
}

const DonationSchema = new mongoose.Schema<IDonation>({
  transactionId: { type: String, required: true, unique: true },
  supporterName: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Donation: Model<IDonation> =
  mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", DonationSchema);

export default Donation;
