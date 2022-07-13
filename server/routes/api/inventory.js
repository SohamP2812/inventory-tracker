const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

const inventoryController = require("../../controllers/inventoryController");

// POST /api/inventory
router.post("/", auth, inventoryController.createInventory);

// GET /api/inventory
router.get("/", auth, inventoryController.getAllInventory);

// GET /api/inventory/:name
router.get("/:name", auth, inventoryController.getInventoryItem);

// POST /api/inventory/add
router.post("/add", auth, inventoryController.addToInventory);

// PUT /api/inventory/:name/update-quantity
router.put(
  "/:name/update-quantity",
  auth,
  inventoryController.updateItemQuantity
);

// DELETE /api/inventory/:name/delete
router.delete("/:name/delete", auth, inventoryController.deleteItem);

// PUT /api/inventory/:name/undelete
router.put("/:name/undelete", auth, inventoryController.undeleteItem);

module.exports = router;
