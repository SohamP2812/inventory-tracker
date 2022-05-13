const express = require("express");
const router = express.Router();

const inventoryController = require("../../controllers/inventoryController");

// GET /api/inventory
router.get("/", inventoryController.getAllInventory);

// GET /api/inventory/:name
router.get("/:name", inventoryController.getInventoryItem);

// POST /api/inventory/add
router.post("/add", inventoryController.addToInventory);

// PUT /api/inventory/:name/update-quantity
router.put("/:name/update-quantity", inventoryController.updateItemQuantity);

// DELETE /api/inventory/:name/delete
router.delete("/:name/delete", inventoryController.deleteItem);

module.exports = router;
