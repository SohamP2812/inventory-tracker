import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useParams, Link } from "react-router-dom";

export function GetFromInventory() {
  const [item, setItem] = useState();
  const [itemHistory, setItemHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  let { name } = useParams();

  useEffect(() => {
    function parseISOString(s) {
      var b = s.split(/[-TZ:]/i);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
    }
    setError("");
    setLoading(true);
    axios
      .get(`/api/inventory/${name}`)
      .then((response) => {
        response.data.item.createdAt = parseISOString(
          response.data.item.createdAt
        );

        setItem(response.data.item);

        console.log(response.data.item);

        axios
          .get(`/api/inventory-history/item-name/${name}`)
          .then((response) => {
            setItemHistory(
              response.data.inventoryHistory.map((entry) => {
                entry.createdAt = parseISOString(entry.createdAt);
                return entry;
              })
            );
            setLoading(false);
          })
          .catch((error) => {
            setError(error.response.data.message);
            console.log(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        setError(error.response.data.message);
        console.log(error);
        setLoading(false);
      });
  }, [name]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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

  return (
    <>
      <Header />
      <div className="py-20">
        <h1 className="text-4xl font-bold text-center mb-10">Get Item</h1>
        <p className="text-red-600 text-center">{error}</p>
        {item && (
          <div className="w-[90%] m-auto">
            <p>
              <strong>Name:</strong> {item.itemName}
            </p>
            <p>
              <strong>Description:</strong> {item.description}
            </p>
            <p>
              <strong>Stock:</strong> {item.amountInStock}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {`${
                monthNames[item.createdAt.getMonth()]
              } ${item.createdAt.getDate()}, ${item.createdAt.getFullYear()} ${item.createdAt.toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}`}
            </p>
            {item.deleted && (
              <>
                <p>
                  <strong>DELETED</strong>
                </p>
                <p>
                  <strong>Deleted Description: </strong>
                  {item.deletedDescription}
                </p>
              </>
            )}
          </div>
        )}
        <h1 className="text-4xl font-bold text-center my-10">Item History</h1>
        {itemHistory &&
          itemHistory.map((entry) => (
            <div className="w-[90%] m-auto bg-gray-800 p-6 mb-4 flex flex-row justify-between rounded-xl">
              <div className="flex flex-col">
                <p className="text-white">Entry ID: {entry.id}</p>
                <p className="text-white">Quantity: {entry.amount}</p>
                <p className="text-white">
                  Transaction Type: {entry.transactionType}
                </p>
                <p className="text-white">
                  Time:{" "}
                  {`${
                    monthNames[entry.createdAt.getMonth()]
                  } ${item.createdAt.getDate()}, ${entry.createdAt.getFullYear()} ${entry.createdAt.toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}`}
                </p>
              </div>
              <div>
                <Link
                  to={`/get-inventory-history/${entry.id}`}
                  className="bg-white text-black px-3 py-1 rounded-xl ml-2"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default function GetInventory() {
  const [inventory, setInventory] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  let { name } = useParams();

  function parseISOString(s) {
    var b = s.split(/[-TZ:]/i);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
  }

  function getInventory() {
    setLoading(true);
    setError("");
    axios
      .get("/api/inventory")
      .then((response) => {
        setInventory(
          response.data.inventory.map((item) => {
            item.createdAt = parseISOString(item.createdAt);
            return item;
          })
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      });
  }

  function undelete(itemName) {
    setLoading(true);
    setError("");
    axios
      .put(`/api/inventory/${itemName}/undelete`)
      .then(() => {
        getInventory();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    getInventory();
  }, [name]);

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

  if (name) {
    <GetFromInventory />;
  } else {
    return (
      <>
        <Header />
        <div className="py-20 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-10">
            Get Inventory
          </h1>
          <Link
            to="/add-to-inventory"
            className="bg-black text-white px-3 py-1 rounded-xl mb-10 max-w-[90%] w-[200px] text-center"
          >
            Add New Item
          </Link>
          <p className="text-red-600 text-center">{error}</p>
          {inventory &&
            inventory.map((item) => (
              <div className="w-[90%] m-auto bg-gray-800 p-6 mb-4 flex flex-row justify-between rounded-xl">
                <div className="flex flex-col">
                  <p className="text-white">{item.itemName}</p>
                  <p className="text-white">Stock: {item.amountInStock}</p>
                  {item.deleted && <p className="text-white">DELETED</p>}
                </div>
                <div>
                  {item.deleted ? (
                    <button
                      className="bg-white text-black px-3 py-1 rounded-xl ml-2"
                      onClick={() => {
                        undelete(item.itemName);
                      }}
                    >
                      Undelete Item
                    </button>
                  ) : (
                    <>
                      <Link
                        to={`/delete-from-inventory/${item.itemName}`}
                        className="bg-white text-black px-3 py-1 rounded-xl ml-2"
                      >
                        Delete Item
                      </Link>
                      <Link
                        to={`/edit-quantity/${item.itemName}`}
                        className="bg-white text-black px-3 py-1 rounded-xl ml-2"
                      >
                        Update Quantity
                      </Link>
                    </>
                  )}
                  <Link
                    to={`/get-inventory/${item.itemName}`}
                    className="bg-white text-black px-3 py-1 rounded-xl ml-2"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }
}
