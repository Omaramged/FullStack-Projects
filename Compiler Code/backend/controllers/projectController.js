const mongoose = require("mongoose");
const Project = require("../models/Project");
const ProjectFile = require("../models/ProjectFile");

const startTemplates = {
  javascript: 'console.log("Hello, World!");\n',
  python: 'print("Hello, World!")\n',
};

const startFileNames = {
  javascript: "main.js",
  python: "main.py",
};

async function getProjects(req, res) {
  try {
    const projects = await Project.find({ ownerId: req.userId }).sort({ updatedAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: "Could not load your projects" });
  }
}

async function createProject(req, res) {
  const { name, description, language } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "A project name is required" });
  }

  if (!["javascript", "python"].includes(language)) {
    return res.status(400).json({ error: "Please pick a supported language" });
  }

  try {
    const project = await Project.create({
      ownerId: req.userId,
      name: name.trim(),
      description: description || "",
      language,
    });

    await ProjectFile.create({
      projectId: project._id,
      name: startFileNames[language],
      folder: "",
      type: "file",
      content: startTemplates[language],
    });

    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ error: "Could not create the project" });
  }
}

async function getProject(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = await Project.findOne({ _id: req.params.id, ownerId: req.userId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: "Could not load the project" });
  }
}

async function updateProject(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = await Project.findOne({ _id: req.params.id, ownerId: req.userId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { name, description, isStarred } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: "Project name cannot be empty" });
      }
      project.name = name.trim();
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (isStarred !== undefined) {
      project.isStarred = Boolean(isStarred);
    }

    await project.save();
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: "Could not update the project" });
  }
}

async function deleteProject(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await ProjectFile.deleteMany({ projectId: req.params.id });

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete the project" });
  }
}

async function duplicateProject(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = await Project.findOne({ _id: req.params.id, ownerId: req.userId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const copy = await Project.create({
      ownerId: req.userId,
      name: project.name + " copy",
      description: project.description,
      language: project.language,
    });

    const files = await ProjectFile.find({ projectId: project._id });

    for (const file of files) {
      await ProjectFile.create({
        projectId: copy._id,
        name: file.name,
        folder: file.folder,
        type: file.type,
        content: file.content,
      });
    }

    res.status(201).json({ project: copy });
  } catch (err) {
    res.status(500).json({ error: "Could not duplicate the project" });
  }
}

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  duplicateProject,
};
