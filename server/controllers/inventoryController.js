const InventoryHistory = require("../models/InventoryHistory.model");
const Inventory = require("../models/Inventory.model");
const Inventories = require("../models/Inventories.model");

// Handler for POST @ /api/inventory
// Creates inventory
exports.createInventory = (req, res) => {
  const { name } = req.body;

  Inventories.create({
    name: name,
    creator: req.user.user_id,
  })
    .then((inventory) => {
      return res.status(200).json({
        message: "Created Inventory Successfully.",
        inventory_id: inventory.id,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        message: "Unable to create inventory. Please try again.",
      });
    });
};

// Handler for GET @ /api/inventory
// Returns list of all inventory items
exports.getAllInventory = (req, res) => {
  const { inventoryID } = req.body;

  Inventory.findAll({
    where: { inventoryID: inventoryID },
    order: [["createdAt", "DESC"]],
  })
    .then((inventory) => {
      const message = inventory.length
        ? "Retrieved Inventory Successfully."
        : "No items in inventory.";
      res.status(200).json({
        message: message,
        inventory: inventory,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to get inventory. Please try again.",
      });
    });
};

// Handler for GET @ /api/inventory/:name
// Returns a specific inventory item with the desired item name (if it exists)
exports.getInventoryItem = (req, res) => {
  const { inventoryID } = req.body;
  const { name } = req.params;

  Inventory.findOne({
    where: { inventoryID: inventoryID, itemName: name },
  })
    .then((item) => {
      if (item == null) {
        res.status(400).json({ message: "Item not found in inventory." });
      } else {
        res
          .status(200)
          .json({ message: "Retrieved Item Successfully.", item: item });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to get item. Please try again." });
    });
};

// Handler for POST @ /api/inventory/add
// Adds a new inventory item in the inventory table with a specified name (PK), initial stock, and item description
exports.addToInventory = (req, res) => {
  const { inventoryID, name, amount, description } = req.body;

  Inventory.findOne({ where: { itemName: req.body.name } })
    .then((item) => {
      if (item === null) {
        Inventory.create({
          inventoryID: inventoryID,
          itemName: name,
          amountInStock: amount,
          description: description,
        })
          .then(() => {
            InventoryHistory.create({
              inventoryID: inventoryID,
              itemName: name,
              amount: amount,
              description: description,
              transactionType: "receivied",
            })
              .then(() => {
                res.status(200).json({
                  message: "Added Item Successfully.",
                });
              })
              .catch((error) => {
                console.log(error);
                res.status(400).json({
                  message: "Unable to add item. Please try again.",
                });
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({
              message: "Unable to add item. Please try again.",
            });
          });
      } else {
        if (item.deleted) {
          Inventory.update(
            {
              deleted: false,
              deletedDescription: "",
              description: description,
            },
            { where: { itemName: name } }
          )
            .then(() => {
              InventoryHistory.create({
                inventoryID: inventoryID,
                itemName: name,
                amount: amount,
                description: description,
                transactionType: "receivied",
              })
                .then(() => {
                  res.status(200).json({
                    message: "Added Item Successfully.",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(400).json({
                    message: "Unable to add item. Please try again.",
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json({
                message: "Unable to add item. Please try again.",
              });
            });
        } else {
          return res.status(400).json({
            message: "Item already exists.",
          });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to add item. Please try again.",
      });
    });
};

// Handler for PUT @ /api/inventory/:name/update-quantity
// Increases or decreases the quantity of a specified item by a specified amount and creates a subsequent inventory history entry
// Handles error if amount to be decreased is more than existing inventory quantity
exports.updateItemQuantity = (req, res) => {
  const { inventoryID, amount, description, transactionType } = req.body;
  const { name } = req.params;

  if (amount <= 0) {
    return res.status(400).json({
      message: "Please enter a quantity above 0.",
    });
  }

  Inventory.findOne({
    where: { inventoryID: inventoryID, itemName: name },
  })
    .then((item) => {
      if (item === null) {
        return res.status(400).json({ message: "Item does not exist." });
      } else {
        if (transactionType == "consumed" && item.amountInStock - amount < 0) {
          return res.status(400).json({
            message:
              "Existing quantity in stock is insufficient to reduce by transaction.",
          });
        } else {
          InventoryHistory.create({
            inventoryID: inventoryID,
            itemName: name,
            amount: amount,
            description: description,
            transactionType:
              transactionType == "consumed" ? "consumed" : "received",
          })
            .then(() => {
              Inventory.increment(
                {
                  amountInStock:
                    transactionType == "consumed" ? -1 * amount : amount,
                },
                { where: { inventoryID: inventoryID, itemName: name } }
              )
                .then(() => {
                  return res.status(200).json({
                    message: "Updated Item Successfully.",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  return res.status(400).json({
                    message: "Unable to change item's quantity.",
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              return res.status(400).json({
                message: "Unable to add item. Please try again.",
              });
            });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to get item. Please try again." });
    });
};

// Handler for DELETE @ /api/inventory/:name/delete
// Updates 'deleted' value from false to true and populates 'deletedDescription' for a specified inventory item
// Also creates a corresponding inventory history entry to display the entire quantity being consumed
exports.deleteItem = (req, res) => {
  const { inventoryID, deletedDescription } = req.body;
  const { name } = req.params;

  Inventory.findOne({
    where: { inventoryID: inventoryID, itemName: name },
  })
    .then((item) => {
      InventoryHistory.create({
        itemName: name,
        amount: item.amountInStock,
        description: "Deleted inventory item.",
        transactionType: "consumed",
      })
        .then(() => {
          Inventory.update(
            {
              amountInStock: 0,
              deleted: true,
              deletedDescription: deletedDescription,
            },
            { where: { inventoryID: inventoryID, itemName: name } }
          )
            .then(() => {
              return res
                .status(200)
                .json({ message: "Deleted Item Successfully." });
            })
            .catch((error) => {
              console.log(error);
              return res.json({
                message: "Unable to delete item. Please try again.",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            message:
              "Added inventory history entry for deletion, but was unable to delete inventory item.",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(400)
        .json({ message: "Unable to delete item. Please try again." });
    });
};

// Handler for DELETE @ /api/inventory/:name/undelete
// Updates 'deleted' value from true to false and resets 'deletedDescription' for a specified inventory item
exports.undeleteItem = (req, res) => {
  const { inventoryID } = req.body;
  const { name } = req.params;

  Inventory.update(
    {
      deleted: false,
      deletedDescription: "",
    },
    { where: { inventoryID: inventoryID, itemName: name } }
  )
    .then(() => {
      return res.status(200).json({ message: "Restored Item Successfully." });
    })
    .catch((error) => {
      console.log(error);
      return res.json({ message: "Unable to restore item. Please try again." });
    });
};
