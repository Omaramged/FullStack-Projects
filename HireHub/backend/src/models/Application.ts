import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export interface IStatusHistory {
  status: ApplicationStatus;
  changedBy: mongoose.Types.ObjectId;
  changedAt: Date;
  note?: string;
}

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  statusHistory: IStatusHistory[];
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const statusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    changedAt: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    resumeUrl: { type: String },
    coverLetter: { type: String, default: "" },
    status: { type: String, enum: ["applied", "reviewing", "shortlisted", "interview", "offer", "hired", "rejected", "withdrawn"], default: "applied" },
    statusHistory: { type: [statusHistorySchema], default: [] },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ candidateId: 1, createdAt: -1 });
applicationSchema.index({ companyId: 1, status: 1 });

export const Application: Model<IApplication> = mongoose.model<IApplication>("Application", applicationSchema);