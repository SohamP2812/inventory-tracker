import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

export default function AddToInventory() {
  const [itemName, setItemName] = useState();
  const [description, setDescription] = useState();
  const [initialStock, setInitialStock] = useState();
  const [error, setError] = useState();

  function handleCreateNewItem(e) {
    e.preventDefault();
    setError();
    axios
      .post("/api/inventory/add", {
        name: itemName,
        amount: initialStock,
        description: description,
      })
      .then((response) => {
        setItemName("");
        setDescription("");
        setInitialStock("");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  }

  return (
    <>
      <Header />
      <div className="py-20">
        <h1 className="text-4xl font-bold text-center mb-10">
          Add to Inventory
        </h1>
        <form className="flex flex-col items-center">
          <div className="flex flex-col max-w-[90%] w-[400px] mb-4">
            <label>Item Name</label>
            <input
              placeholder="Item Name"
              className="border-2 border-slate-400"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="flex flex-col max-w-[90%] w-[400px] mb-4">
            <label>Description</label>
            <textarea
              placeholder="Description"
              className="border-2 border-slate-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col max-w-[90%] w-[400px] mb-4">
            <label>Initial Stock</label>
            <input
              placeholder="Initial Stock"
              className="border-2 border-slate-400"
              value={initialStock}
              onChange={(e) => setInitialStock(e.target.value)}
            />
          </div>
          <button
            className="bg-black text-white px-4 rounded-xl ml-4 py-2 mb-4"
            onClick={(e) => handleCreateNewItem(e)}
          >
            Enter
          </button>
          <p className="text-red-600 text-center">{error}</p>
        </form>
      </div>
    </>
  );
}
