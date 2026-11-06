import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description?: string;
  logo?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  location?: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    logo: { type: String },
    industry: { type: String },
    companySize: { type: String },
    website: { type: String },
    location: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

companySchema.index({ ownerId: 1 });

export const Company: Model<ICompany> = mongoose.model<ICompany>("Company", companySchema);