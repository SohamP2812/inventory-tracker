import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useParams } from "react-router-dom";

export default function DeleteFromInventory() {
  const [item, setItem] = useState();
  const [deletedDescription, setDeletedDescription] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  let { name } = useParams();

  function getItem() {
    setLoading(true);
    setError("");
    axios
      .get(`/api/inventory/${name}`)
      .then((response) => {
        setItem(response.data.item);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (name) {
      getItem();
    }
  }, []);

  function handleDeleteItem(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    axios
      .delete(`/api/inventory/${name}/delete`, {
        data: { deletedDescription: deletedDescription },
      })
      .then(() => {
        setDeletedDescription("");
        getItem();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      });
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="py-20">
          <p className="text-xl text-center">Loading...</p>
        </div>
      </>
    );
  }

  if (item.deleted) {
    return (
      <>
        <Header />
        <div className="py-20">
          <p className="text-xl text-center">{name} is deleted</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="py-20">
        <h1 className="text-4xl font-bold text-center mb-10">Delete Item</h1>
        <form className="flex flex-col items-center">
          <div className="flex flex-col max-w-[90%] w-[400px] mb-4">
            <p className="mb-4">{item && `Item Name: ${item.itemName}`}</p>
            <p className="mb-4">{item && `Stock: ${item.amountInStock}`}</p>
          </div>
          <div className="flex flex-col max-w-[90%] w-[400px] mb-4">
            <label>Deletion Description</label>
            <textarea
              placeholder="Reason for Deletion"
              className="border-2 border-slate-400"
              value={deletedDescription}
              onChange={(e) => setDeletedDescription(e.target.value)}
            />
          </div>
          <button
            className="bg-black text-white px-4 rounded-xl ml-4 py-2 mb-4"
            onClick={(e) => handleDeleteItem(e)}
          >
            Enter
          </button>
          <p className="text-red-600 text-center">{error}</p>
        </form>
      </div>
    </>
  );
}
