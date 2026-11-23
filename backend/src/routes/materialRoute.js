const express = require("express");
const materialController = require("../controllers/materialController");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get("/", materialController.getMaterials);
router.get("/:id", materialController.getMaterialById);
router.post("/", validateRequest(), materialController.createMaterial);
router.patch("/:id/quantity", materialController.addMaterialQuantity);
router.put("/:id", validateRequest(), materialController.updateMaterial);
router.patch("/:id", validateRequest(true), materialController.updateMaterialPartial);
router.delete("/:id", materialController.deletedMaterial);

module.exports = router;
