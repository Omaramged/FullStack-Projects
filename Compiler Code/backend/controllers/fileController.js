const mongoose = require("mongoose");
const Project = require("../models/Project");
const ProjectFile = require("../models/ProjectFile");

const nameRegex = /^[a-zA-Z0-9._-]+$/;
const MAX_FILES = 50;
const MAX_DEPTH = 6;
const MAX_CONTENT = 100000;

function isFolderValid(folder) {
  if (folder === "") return true;

  const parts = folder.split("/");

  if (parts.length > MAX_DEPTH) return false;

  return parts.every((part) => part && nameRegex.test(part));
}

async function findProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.projectId)) {
    res.status(404).json({ error: "Project not found" });
    return null;
  }

  const project = await Project.findOne({
    _id: req.params.projectId,
    ownerId: req.userId,
  });

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return null;
  }

  return project;
}

async function getFiles(req, res) {
  try {
    const project = await findProject(req, res);
    if (!project) return;

    const files = await ProjectFile.find({ projectId: project._id }).sort({ folder: 1, name: 1 });

    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: "Could not load the project files" });
  }
}

async function createFile(req, res) {
  try {
    const project = await findProject(req, res);
    if (!project) return;

    const { name, folder, type, content } = req.body;

    if (!name || !nameRegex.test(name)) {
      return res
        .status(400)
        .json({ error: "Name can only contain letters, numbers, dots, dashes and underscores" });
    }

    if (name.length > 64) {
      return res.status(400).json({ error: "Name is too long (63 characters max)" });
    }

    if (!isFolderValid(folder || "")) {
      return res.status(400).json({ error: "Invalid folder path" });
    }

    if (!["file", "folder"].includes(type)) {
      return res.status(400).json({ error: "Invalid item type" });
    }

    if (type === "folder" && (folder || "").split("/").length >= MAX_DEPTH) {
      return res.status(400).json({ error: "Folders can only be " + MAX_DEPTH + " levels deep" });
    }

    const fileCount = await ProjectFile.countDocuments({ projectId: project._id });

    if (fileCount >= MAX_FILES) {
      return res.status(400).json({ error: "This project already has " + MAX_FILES + " items" });
    }

    const duplicate = await ProjectFile.findOne({
      projectId: project._id,
      name,
      folder: folder || "",
    });

    if (duplicate) {
      return res.status(400).json({ error: "A file with this name already exists here" });
    }

    const file = await ProjectFile.create({
      projectId: project._id,
      name,
      folder: folder || "",
      type,
      content: content || "",
    });

    project.updatedAt = new Date();
    await project.save();

    res.status(201).json({ file });
  } catch (err) {
    res.status(500).json({ error: "Could not create the file" });
  }
}

async function updateFile(req, res) {
  try {
    const project = await findProject(req, res);
    if (!project) return;

    if (!mongoose.isValidObjectId(req.params.fileId)) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = await ProjectFile.findOne({ _id: req.params.fileId, projectId: project._id });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const { content } = req.body;

    if (content === undefined) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    if (content.length > MAX_CONTENT) {
      return res.status(400).json({ error: "File is too big (100KB max)" });
    }

    file.content = content;
    await file.save();

    project.updatedAt = new Date();
    await project.save();

    res.json({ file });
  } catch (err) {
    res.status(500).json({ error: "Could not save the file" });
  }
}

async function renameItem(req, res) {
  try {
    const project = await findProject(req, res);
    if (!project) return;

    if (!mongoose.isValidObjectId(req.params.fileId)) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = await ProjectFile.findOne({ _id: req.params.fileId, projectId: project._id });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const { name } = req.body;

    if (!name || !nameRegex.test(name) || name.length > 64) {
      return res.status(400).json({ error: "Invalid new name" });
    }

    const duplicate = await ProjectFile.findOne({
      projectId: project._id,
      name,
      folder: file.folder,
      _id: { $ne: file._id },
    });

    if (duplicate) {
      return res.status(400).json({ error: "A file with this name already exists here" });
    }

    file.name = name;
    await file.save();

    if (file.type === "folder") {
      const oldPrefix = file.folder ? file.folder + "/" + file.name : file.name;
      const newPrefix = file.folder ? file.folder + "/" + name : name;

      const children = await ProjectFile.find({
        projectId: project._id,
        folder: { $regex: "^" + oldPrefix + "/" },
      });

      for (const child of children) {
        child.folder = newPrefix + child.folder.slice(oldPrefix.length);
        await child.save();
      }
    }

    res.json({ file });
  } catch (err) {
    res.status(500).json({ error: "Could not rename the item" });
  }
}

async function deleteItem(req, res) {
  try {
    const project = await findProject(req, res);
    if (!project) return;

    if (!mongoose.isValidObjectId(req.params.fileId)) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = await ProjectFile.findOne({ _id: req.params.fileId, projectId: project._id });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.type === "folder") {
      const prefix = file.folder ? file.folder + "/" + file.name : file.name;

      await ProjectFile.deleteMany({
        projectId: project._id,
        folder: { $regex: "^" + prefix + "/" },
      });
    }

    await ProjectFile.deleteOne({ _id: file._id });

    project.updatedAt = new Date();
    await project.save();

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete the item" });
  }
}

module.exports = { getFiles, createFile, updateFile, renameItem, deleteItem };
