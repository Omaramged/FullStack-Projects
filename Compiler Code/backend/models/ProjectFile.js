const mongoose = require("mongoose");

const projectFileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["file", "folder"],
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

projectFileSchema.index({ projectId: 1, folder: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("ProjectFile", projectFileSchema);
