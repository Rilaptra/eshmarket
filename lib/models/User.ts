import mongoose, { Document, Model } from "mongoose";
export interface IGuild {
  id: string;
  name: string;
  owner: boolean;
}
export interface IUser extends Document {
  username: string;
  profileImage: string;
  role: string;
  isAdmin: boolean;
  discord_id: string;
  guilds?: Array<IGuild> | null;
  balance: {
    dl: number;
    money: number;
  };
  scriptBuyed: Array<string>;
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
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
