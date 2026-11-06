import mongoose, { Schema, Document, Model } from "mongoose";

export type JobStatus = "draft" | "published" | "paused" | "closed";
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "temporary";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";
export type WorkplaceType = "onsite" | "remote" | "hybrid";

export interface IJob extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  category: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  workplaceType: WorkplaceType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  benefits: string;
  status: JobStatus;
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true },
    responsibilities: { type: String, default: "" },
    requirements: { type: String, default: "" },
    skills: { type: [String], default: [] },
    category: { type: String, default: "" },
    employmentType: {
      type: String,
      enum: ["full_time", "part_time", "contract", "internship", "temporary"],
      default: "full_time",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
      default: "mid",
    },
    workplaceType: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      default: "onsite",
    },
    location: { type: String, default: "" },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: "USD" },
    benefits: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published", "paused", "closed"], default: "draft" },
    applicationDeadline: { type: Date },
  },
  { timestamps: true }
);

jobSchema.index({ companyId: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ title: "text", description: "text" });

export const Job: Model<IJob> = mongoose.model<IJob>("Job", jobSchema);