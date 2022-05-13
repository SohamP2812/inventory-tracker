import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useParams } from "react-router-dom";

export default function EditQuantity() {
  const [item, setItem] = useState();
  const [quantity, setQuantity] = useState();
  const [transactionType, setTransactionType] = useState("received");
  const [description, setDescription] = useState();
  const [error, setError] = useState();
  let { name } = useParams();

  function getItem() {
    axios.get(`/api/inventory/${name}`).then((response) => {
      setItem(response.data.item);
    });
  }

  useEffect(() => {
    if (name) {
      getItem();
    }
  }, []);

  function handleCreateNewItem(e) {
    e.preventDefault();
    setError();
    axios
      .put(`/api/inventory/${name}/update-quantity`, {
        amount: quantity,
        description: description,
        transactionType: transactionType,
      })
      .then((response) => {
        setTransactionType("received");
        setQuantity("");
        setDescription("");
        getItem();
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  }

  useEffect(() => {
    console.log(transactionType);
  }, [transactionType]);

  return (
    <>
      <Header />
      <div className="py-20">
        <h1 className="text-4xl font-bold text-center mb-10">
          Edit Item Quantity
        </h1>
        <form className="flex flex-col items-center">
          <div className="flex flex-col max-w-[90%] w-[400px] mb-4">
            <p className="mb-4">{item && `Item Name: ${item.itemName}`}</p>
            <p className="mb-4">{item && `Stock: ${item.amountInStock}`}</p>
            <label>Transaction Quantity</label>
            <input
              placeholder="Quantity"
              className="border-2 border-slate-400 mb-4"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select
              size="2"
              className="border-2 border-black"
              defaultValue={"received"}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="received">Goods Received</option>
              <option value="consumed">Goods Consumed</option>
            </select>
          </div>
          <div className="flex flex-col max-w-[90%] w-[400px] mb-4">
            <label>Description</label>
            <textarea
              placeholder="Reason for Change"
              className="border-2 border-slate-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
