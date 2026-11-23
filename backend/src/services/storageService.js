// THIS FILE IS RESPONSIBLE FOR COMMUNICATING WITH LOCAL JSONL FILE

const fs = require("fs/promise");
const path = require("path");
const { createAppError } = require("../utils/appError");

// locate data file from the project root
const dataFilePath = path.join(__dirname, "../data/data.jsonl");

// Create a data directory and file if they don't exist
const initializeStorage = async () => {
  const dataDirectory = path.dirname(dataFilePath);

  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    // Use "wx" flag to create the file only if it doesn't exist.
    /*If you use "w" instead of "wx"(write-exclusive), Node.js will create the file if it doesn't exist, 
    but overwrite its contents if it already exists

    Use "wx" for your data-file initialization. 
    It protects existing JSONL data from accidental deletion during application startup.

    ===========
    Is "a" suitable for initialization?
    Yes! In this particular case, both "a" and "wx" preserve existing data.

    However, there is an important difference:
        - "a" silently succeeds if the file already exists.
        - "wx" explicitly fails with EEXIST if the file already exists.
    */
    await fs.writeFile(dataFilePath, "", { flag: "wx" });
  } catch {
    // EEXIST means the file already exists.
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
};

// Read all materials from the JSONL file
const readMaterials = async () => {
  await initializeStorage();
  const fileContent = await fs.readFile(dataFilePath, "utf8");

  if (!fileContent.trim()) {
    return [];
  }

  const lines = fileContent.split(/\r?\n/).filter(Boolean);

  try {
    return lines.map((line) => JSON.parse(line));
  } catch (error) {
    throw createAppError("Stored JSONL data is corrupted", 500);
  }
};

// Append a new material without replacing existing records.
const appendMaterials = async (material) => {
  await initializeStorage();

  const jsonline = JSON.stringify(material) + "\n";

  await fs.appendFile(dataFilePath, jsonline, "utf8");
};

// Replace the entire JSONL file with update records.
const writeMaterials = async (materials) => {
  initializeStorage();

  const jsonlines = materials
    .map((material) => JSON.stringify(material))
    .join("\n");

  const fileContent = jsonlines ? jsonlines + "\n" : ""; //add newline to the end of the content if content exist

  await fs.writeFile(dataFilePath, fileContent, "utf8");
};
module.exports = {
  initializeStorage,
  readMaterials,
  appendMaterials,
  writeMaterials,
};
