import mongoose, { Document, Model } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  title: string;
  description: string;
  price: {
    dl: number;
    money: number;
  };
  showcaseLink: string;
  content: string;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  title: String,
  description: String,
  showcaseLink: String,
  content: String,
  price: {
    dl: Number,
    money: Number,
  },
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
