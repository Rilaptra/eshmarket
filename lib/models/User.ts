import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  username: string;
  profileImage: string;
  role: string;
  isAdmin: boolean;
  discord_id: string;
  guilds?: Array<object> | null;
  balance: {
    dl: number;
    money: number;
  };
  scriptBuyed: Array<string>;
  chart: Array<object>;
}

const UserSchema = new mongoose.Schema<IUser>({
  discord_id: String,
  username: String,
  profileImage: String,
  role: String,
  isAdmin: Boolean,
  guilds: [Object],
  balance: {
    dl: Number,
    money: Number,
  },
  scriptBuyed: [String],
  chart: [Object],
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
