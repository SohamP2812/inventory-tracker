const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

const inventoryHistoryController = require("../../controllers/inventoryHistoryController");

// GET /api/inventory-history
router.get("/", auth, inventoryHistoryController.getAllInventoryHistory);

// GET /api/inventory-history/:id
router.get("/:id", auth, inventoryHistoryController.getInventoryHistoryEntry);

// GET /api/inventory-history/item-name/:name
router.get(
  "/item-name/:name",
  auth,
  inventoryHistoryController.filterInventoryHistoryByItem
);

// DELETE /api/inventory-history/:id/delete
router.delete("/:id/delete", auth, inventoryHistoryController.deleteEntry);

module.exports = router;
