const validateMaterialBody = (body, isPartial = false) => {
  const errors = [];

  const allowedFields = ["name", "quantity", "unit", "unitPrice"];

  //   make sure that request body is a valid object
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return ["Request body must be an object"];
  }

  //   Reject unexpected fields
  for (const field of Object.keys(body)) {
    if (!allowedFields.includes(field)) {
      errors.push(`Unexpected field ${field}`);
    }
  }

  //   POST AND PUT REQUIRE ALL FIELDS
  // PATCH only validates fields supplied by client
  const requiedFields = isPartial ? Object.keys(body) : allowedFields;

  if (requiedFields.length === 0) {
    errors.push("At least one field must be provided");
  }

  if (requiedFields.includes("name")) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      errors.push("Material name is required");
    }
  }

  if (requiedFields.includes("unit")) {
    if (typeof body.unit !== "string" || body.unit.trim().length === 0) {
      errors.push("Unit is required and must be number");
    }
  }

  if (requiedFields.includes("quantity")) {
    if (
      typeof body.quantity !== "number" ||
      !Number.isFinite(body.quantity) ||
      body.quantity < 0
    ) {
      errors.push("Quantity must be nonnegative finite number");
    }
  }

  if (requiedFields.includes("unitPrice")) {
    if (
      typeof body.unitPrice !== "number" ||
      !Number.isFinite(body.unitPrice) ||
      body.unitPrice < 0
    ) {
      errors.push("Unit price must be a nonnegative finite number");
    }
  }

  //   COUNT QUANTITIES MUST BE INTIGERS
  const unit = body.unit;

  if (
    unit !== undefined &&
    unit.trim().toLowerCase() === "count" &&
    body.quantity !== undefined &&
    typeof body.quantity !== "number" &&
    Number.isFinite(body.quantity) &&
    !Number.isInteger(body.quantity)
  ) {
    errors.push("Count quantity must be an integer");
  }

  return errors;
};

module.exports = {
  validateMaterialBody,
};
