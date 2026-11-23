// THIS FILE IS RESPONSIBLE FOR COMMUNICATING WITH LOCAL JSONL FILE
const path = require("path");
const fs = require("fs/promises");
const initializeStorage = require("./storageService");
const createAppError = require("../utils/appError");
const { v4: uuidv4, validate: validateUUID } = require("uuid");

const dataFilePath = path.join(__dirname, "../data/data.jsonl");

// Read all materials from the JSONL file
const getMaterials = async () => {
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

// CREATE MATERIAL
const createMaterial = async (materialData) => {
  const materials = await getMaterials();

  const normalizedName = materialData.name.trim().toLowerCase();

  const existingMaterial = materials.find(
    (item) => item.name.toLowerCase() === normalizedName,
  );

  if (existingMaterial) {
    throw createAppError("Material with this name already exist", 409);
  }

  // create the material with id
  const newMaterial = {
    id: uuidv4(),
    name: materialData.name.trim(),
    quantity: materialData.quantity,
    unit: materialData.unit.trim(),
    unitPrice: materialData.unitPrice,
  };

  await appendMaterials(newMaterial);
};

// Append a new material without replacing existing records.
const appendMaterials = async (material) => {
  await initializeStorage();

  const jsonline = JSON.stringify(material) + "\n";

  await fs.appendFile(dataFilePath, jsonline, "utf8");
};

// Replace the entire JSONL file with update records.
const writeMaterials = async (materials) => {
  await initializeStorage();

  const jsonlines = materials
    .map((material) => JSON.stringify(material))
    .join("\n");

  const fileContent = jsonlines ? jsonlines + "\n" : ""; //add newline to the end of the content if content exist

  await fs.writeFile(dataFilePath, fileContent, "utf8");
};

// UPDATE MATERIAL (PUT)
const updateMaterial = async (id, materialData) => {
  if (!validateUUID(id)) {
    throw createAppError("Invalid material ID", 400);
  }

  const materials = await getMaterials();

  const materialIndex = materials.findIndex((item) => item.id === id);

  if (materialIndex === -1) {
    throw createAppError("Material not found", 404);
  }

  const updatedMaterial = {
    id: materials[materialIndex].id,
    name: materialData.name.trim(),
    quantity: materialData.quantity,
    unit: materialData.unit.trim(),
    unitPrice: materialData.unitPrice,
  };

  materials[materialIndex] = updatedMaterial;
  await writeMaterials(materials);

  return updatedMaterial;
};

// UPDATE MATERIAL PARTIALLY (PATCH)
const updateMaterialPartial = async (id, materialData) => {
  if (!validateUUID(id)) {
    throw createAppError("Invalid material ID", 400);
  }

  const materials = await getMaterials();

  const materialIndex = materials.findIndex((item) => item.id === id);

  if (materialIndex === -1) {
    throw createAppError("Material not found", 404);
  }

  const mName = materialData.name
    ? materialData.name.trim()
    : materialData.name;
  const mUnit = materialData.unit
    ? materialData.unit.trim()
    : materialData.unit;

  const updatedMaterial = {
    id: materials[materialIndex].id,
    name: mName ? mName : materials[materialIndex].name,
    quantity: materialData.quantity
      ? materialData.quantity
      : materials[materialIndex].quantity,
    unit: mUnit ? mUnit : materials[materialIndex].unit,
    unitPrice: materialData.unitPrice
      ? materialData.unitPrice
      : materials[materialIndex].unitPrice,
  };

  materials[materialIndex] = updatedMaterial;
  await writeMaterials(materials);

  return updatedMaterial;
};

// GET MATERIAL BY ID
const getMaterialById = async (id) => {
  if (!validateUUID(id)) {
    throw createAppError("Invalid material Id", 400);
  }

  const materials = await getMaterials();

  const material = materials.find((item) => item.id === id);

  if (!material) {
    throw createAppError("Material Not Found", 404);
  }

  return material;
};

// ADD MATERIAL TO THE EXISTING ONE
const addMaterialQuantity = async (id, numberOfMaterials) => {
  numberOfMaterials = Number(numberOfMaterials);
  if (!validateUUID(id)) {
    throw createAppError("Invalid material Id", 400);
  }

  if (
    numberOfMaterials === NaN ||
    numberOfMaterials < 0 ||
    !Number.isFinite(numberOfMaterials)
  ) {
    throw createAppError("number of materials must be >= 0 and finite", 400);
  }

  const materials = await getMaterials();

  const material = materials.find((item) => item.id === id);

  if (!material) {
    throw createAppError("Material Not Found", 404);
  }

  if (material.unit === "count" && !Number.isInteger(numberOfMaterials)) {
    throw createAppError(
      "When unit is count the number of materials must be +ve integer",
      400,
    );
  }
  material.quantity += numberOfMaterials;
  materials[id] = material;

  await writeMaterials(materials);

  return material;
};

// DELETE MATERIAL BY ITS ID
const deleteMaterial = async (id) => {
  if (!validateUUID(id)) {
    throw createAppError("Invalid material ID", 400);
  }

  const materials = await getMaterials();

  const materialIndex = materials.findIndex((item) => item.id === id);

  if (materialIndex === -1) {
    throw createAppError("Material not found", 404);
  }

  const deletedMaterial = materials[materialIndex];
  const updatedMaterials = materials.filter((item) => item.id !== id);

  await writeMaterials(updatedMaterials);
  return deletedMaterial;
};
module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  addMaterialQuantity,
  updateMaterial,
  updateMaterialPartial,
  deleteMaterial,

  // Helpers
  appendMaterials, //help creation
  writeMaterials, //help, updation, deletion,
};
