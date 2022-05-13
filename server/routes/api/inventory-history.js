const express = require("express");
const router = express.Router();
const InventoryHistory = require("../../models/inventory-history.model");
const Inventory = require("../../models/inventory.model");

// GET /api/inventory-history
router.get("/", (req, res) => {
  InventoryHistory.findAll({ order: [["createdAt", "DESC"]] })
    .then((inventoryHistory) => {
      res.status(200).json({
        message: "Retrieved Inventory Successfully.",
        inventoryHistory: inventoryHistory,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to get items. Please try again.",
      });
    });
});

// GET /api/inventory-history/:id
router.get("/:id", (req, res) => {
  InventoryHistory.findByPk(req.params.id)
    .then((item) => {
      res
        .status(200)
        .json({ message: "Retrieved Item Successfully.", item: item });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to get item. Please try again." });
    });
});

// GET /api/inventory-history/item-name/:name
router.get("/item-name/:name", (req, res) => {
  InventoryHistory.findAll({ where: { itemName: req.params.name } })
    .then((inventoryHistory) => {
      res.status(200).json({
        message: "Retrieved Items Successfully.",
        inventoryHistory: inventoryHistory,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to get items. Please try again." });
    });
});

// DELETE /api/inventory-history/:id/delete
router.delete("/:id/delete", (req, res) => {
  InventoryHistory.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200).json({ message: "Deleted Item Successfully." });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to delete item. Please try again." });
    });
});

module.exports = router;
