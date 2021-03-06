const InventoryHistory = require("../models/InventoryHistory.model");

// Handler for GET @ /api/inventory-history
// Returns list of all inventory history entries
exports.getAllInventoryHistory = (req, res) => {
  InventoryHistory.findAll({ order: [["createdAt", "DESC"]] })
    .then((inventoryHistory) => {
      const message = inventoryHistory.length
        ? "Retrieved Inventory History Successfully."
        : "No entries in history.";
      res.status(200).json({
        message: message,
        inventoryHistory: inventoryHistory,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to get entries. Please try again.",
      });
    });
};

// Handler for GET @ /api/inventory-history/:id
// Returns a specific inventory history entry with the desired id (if it exists)
exports.getInventoryHistoryEntry = (req, res) => {
  InventoryHistory.findByPk(req.params.id)
    .then((item) => {
      if (item === null) {
        res.status(400).json({ message: "Entry does not exist." });
      } else {
        res
          .status(200)
          .json({ message: "Retrieved Entry Successfully.", item: item });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to get entry. Please try again." });
    });
};

// Handler for GET @ /api/inventory-history/item-name/:name
// Returns all entries associated with a specific inventory item name
exports.filterInventoryHistoryByItem = (req, res) => {
  InventoryHistory.findAll({
    where: { itemName: req.params.name },
    order: [["createdAt", "DESC"]],
  })
    .then((inventoryHistory) => {
      res.status(200).json({
        message: "Retrieved Entries Successfully.",
        inventoryHistory: inventoryHistory,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to get entries. Please try again." });
    });
};

// Handler for DELETE @ /api/inventory-history/:id/delete
// Deletes an entry corresponding with the specified id (PK)
exports.deleteEntry = (req, res) => {
  InventoryHistory.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200).json({ message: "Deleted Entry Successfully." });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to delete entry. Please try again." });
    });
};
