const express = require("express");
const router = express.Router();
// const InventoryHistory = require("../../models/InventoryHistoryModel");
// const Inventory = require("../../models/InventoryModel");

const db = require("../../index");
const InventoryHistory = require("../../models/inventory-history.model");
const Inventory = require("../../models/inventory.model");

// GET /api/inventory
router.get("/", (req, res) => {
  Inventory.findAll({ order: [["createdAt", "DESC"]] })
    .then((inventory) => {
      res.status(200).json({
        message: "Retrieved Inventory Successfully.",
        inventory: inventory,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to get inventory. Please try again.",
      });
    });
});

router.get("/:name", (req, res) => {
  Inventory.findOne({ where: { itemName: req.params.name } })
    .then((item) => {
      // SHOULD ERROR IF ITEM IS NULL (NONE FOUND)

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

// POST /api/inventory/add
router.post("/add", (req, res) => {
  Inventory.findOne({ where: { itemName: req.body.name } })
    .then((item) => {
      if (item === null) {
        Inventory.create({
          itemName: req.body.name,
          amountInStock: req.body.amount,
          description: req.body.description,
        })
          .then((item) => {
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
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Unable to add item. Please try again.",
      });
    });
});

// PUT /api/inventory/:name/update-quantity
router.put("/:name/update-quantity", (req, res) => {
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
});

// DELETE /api/inventory/:name/delete
router.delete("/:name/delete", (req, res) => {
  Inventory.findByPk(req.params.name)
    .then((item) => {
      InventoryHistory.create({
        itemName: req.params.name,
        amount: item.amountInStock,
        description: "Deleted inventory item.",
        transactionType: "consumed",
      })
        .then(() => {
          Inventory.destroy({ where: { itemName: req.params.name } })
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
});

module.exports = router;
