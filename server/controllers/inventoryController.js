const InventoryHistory = require("../models/InventoryHistory.model");
const Inventory = require("../models/Inventory.model");

exports.getAllInventory = (req, res) => {
  Inventory.findAll({ order: [["createdAt", "DESC"]] })
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

exports.getInventoryItem = (req, res) => {
  Inventory.findOne({ where: { itemName: req.params.name } })
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

exports.addToInventory = (req, res) => {
  Inventory.findOne({ where: { itemName: req.body.name } })
    .then((item) => {
      if (item === null) {
        Inventory.create({
          itemName: req.body.name,
          amountInStock: req.body.amount,
          description: req.body.description,
        })
          .then(() => {
            InventoryHistory.create({
              itemName: req.body.name,
              amount: req.body.amount,
              description: req.body.description,
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
              description: req.body.description,
            },
            { where: { itemName: req.body.name } }
          )
            .then(() => {
              InventoryHistory.create({
                itemName: req.body.name,
                amount: req.body.amount,
                description: req.body.description,
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

exports.updateItemQuantity = (req, res) => {
  if (req.body.amount <= 0) {
    res.status(400).json({
      message: "Please enter a quantity above 0.",
    });
  }
  Inventory.findByPk(req.params.name)
    .then((item) => {
      if (item === null) {
        res.status(400).json({ message: "Item does not exist." });
      } else {
        if (
          req.body.transactionType == "consumed" &&
          item.amountInStock - req.body.amount < 0
        ) {
          res.status(400).json({
            message:
              "Existing quantity in stock is insufficient to reduce by transaction.",
          });
        } else {
          InventoryHistory.create({
            itemName: req.params.name,
            amount: req.body.amount,
            description: req.body.description,
            transactionType: req.body.transactionType,
          })
            .then(() => {
              Inventory.increment(
                {
                  amountInStock:
                    req.body.transactionType == "received"
                      ? req.body.amount
                      : -1 * req.body.amount,
                },
                { where: { itemName: req.params.name } }
              )
                .then(() => {
                  res.status(200).json({
                    message: "Updated Item Successfully.",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(400).json({
                    message: "Unable to change item's quantity.",
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json({
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

exports.deleteItem = (req, res) => {
  Inventory.findByPk(req.params.name)
    .then((item) => {
      InventoryHistory.create({
        itemName: req.params.name,
        amount: item.amountInStock,
        description: "Deleted inventory item.",
        transactionType: "consumed",
      })
        .then(() => {
          Inventory.update(
            {
              amountInStock: 0,
              deleted: true,
              deletedDescription: req.body.deletedDescription,
            },
            { where: { itemName: req.params.name } }
          )
            .then(() => {
              res.status(200).json({ message: "Deleted Item Successfully." });
            })
            .catch((error) => {
              console.log(error);
              res.json({ message: "Unable to delete item. Please try again." });
            });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            message:
              "Added inventory history entry for deletion, but was unable to delete inventory item.",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to delete item. Please try again." });
    });
};

exports.undeleteItem = (req, res) => {
  Inventory.update(
    {
      deleted: false,
      deletedDescription: "",
    },
    { where: { itemName: req.params.name } }
  )
    .then(() => {
      res.status(200).json({ message: "Restored Item Successfully." });
    })
    .catch((error) => {
      console.log(error);
      res.json({ message: "Unable to restore item. Please try again." });
    });
};
