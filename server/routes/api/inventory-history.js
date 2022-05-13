const express = require("express");
const router = express.Router();

const inventoryHistoryController = require("../../controllers/inventoryHistoryController");

// GET /api/inventory-history
router.get("/", inventoryHistoryController.getAllInventoryHistory);

// GET /api/inventory-history/:id
router.get("/:id", inventoryHistoryController.getInventoryHistoryEntry);

// GET /api/inventory-history/item-name/:name
router.get(
  "/item-name/:name",
  inventoryHistoryController.filterInventoryHistoryByItem
);

// DELETE /api/inventory-history/:id/delete
router.delete("/:id/delete", inventoryHistoryController.deleteEntry);

module.exports = router;
