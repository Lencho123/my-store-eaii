const materialService = require("../services/materialService");

// GET ALL MATERIALS
const getMaterials = async (req, res) => {
  const materials = await materialService.getMaterials();

  res.status(200).json({
    count: materials.length,
    data: materials,
  });
};

// GET MATERIAL BY ID
const getMaterialById = async (req, res) => {
  const { id } = req.params;

  const material = await materialService.getMaterialById(id);

  res.status(200).json({
    data: material,
  });
};

// CREATE MATERIAL
const createMaterial = async (req, res) => {
  const newMaterial = await materialService.createMaterial(req.body);

  res.status(201).json({
    message: "Material creation succeed",
    data: newMaterial,
  });
};

// ADD MATERIAL QUANTITY
const addMaterialQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.query;

  const material = await materialService.addMaterialQuantity(id, quantity);

  res.status(200).json({
    message: "Material added seccussfull",
    data: material,
  });
};

// UPDATE MATERIAL (PUT)
const updateMaterial = async (req, res) => {
  const { id } = req.params;

  const updatedMaterial = await materialService.updateMaterial(id, req.body);

  res.status(200).json({
    message: "Material updation succeed",
    data: updatedMaterial,
  });
};

//UPDATE MATERIAL PARTIALLY (PATCH)
const updateMaterialPartial = async (req, res) => {
  const { id } = req.params;

  const updatedMaterial = await materialService.updateMaterialPartial(
    id,
    req.body,
  );

  res.status(200).json({
    message: "Material partial updation succeed",
    data: updatedMaterial,
  });
};

// DELETE MATERIAL
const deletedMaterial = async (req, res) => {
  const { id } = req.params;

  const deletedMaterial = await materialService.deleteMaterial(id);

  res.status(200).json({
    message: "Materiall deleted",
    data: deletedMaterial,
  });
};

// Decrement material quantity by n
const decremntMaterialQuantityByN = async (req, res) => {
  const { id } = req.params;
  const { n } = req.query;

  const decrementedMaterial = await materialService.decremntMaterialQuantityByN(
    id,
    n,
  );

  res.status(200).json({
    message: "Material quantity is decremented by n",
    data: decrementedMaterial,
  });
};

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  addMaterialQuantity,
  updateMaterial,
  updateMaterialPartial,
  deletedMaterial,
  decremntMaterialQuantityByN,
};
