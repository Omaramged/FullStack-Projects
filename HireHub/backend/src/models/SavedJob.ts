import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISavedJob extends Document {
  candidateId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true }
);

savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export const SavedJob: Model<ISavedJob> = mongoose.model<ISavedJob>("SavedJob", savedJobSchema);