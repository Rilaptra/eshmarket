import mongoose, { Document, Model } from "mongoose";

interface IProduct extends Document {
  title: string;
  description: string;
  price: {
    dl: string;
    money: string;
  };
}

const ProductSchema = new mongoose.Schema<IProduct>({
  title: String,
  description: String,
  price: {
    dl: String,
    money: String,
  },
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
