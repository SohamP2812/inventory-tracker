import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useParams, Link } from "react-router-dom";

export function GetFromInventoryHistory() {
  const [entry, setEntry] = useState();
  let { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function parseISOString(s) {
      var b = s.split(/[-TZ:]/i);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
    }

    axios
      .get(`/api/inventory-history/${id}`)
      .then((response) => {
        response.data.item.createdAt = parseISOString(
          response.data.item.createdAt
        );

        setEntry(response.data.item);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

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
        <h1 className="text-4xl font-bold text-center mb-10">Get Entry</h1>
        {entry && (
          <div className="w-[90%] m-auto">
            <p>
              <strong>ID:</strong> {id}
            </p>
            <p>
              <strong>Name:</strong> {entry.itemName}
            </p>
            <p>
              <strong>Description:</strong> {entry.description}
            </p>
            <p>
              <strong>Amount:</strong> {entry.amount}
            </p>
            <p>
              <strong>Transaction Type:</strong> {entry.transactionType}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {`${
                monthNames[entry.createdAt.getMonth()]
              } ${entry.createdAt.getDate()}, ${entry.createdAt.getFullYear()} ${entry.createdAt.toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function GetInventoryHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemNameSearch, setItemNameSearch] = useState();
  let { id } = useParams();

  function parseISOString(s) {
    var b = s.split(/[-TZ:]/i);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
  }

  function getEntireInventoryHistory() {
    setLoading(true);
    axios
      .get("/api/inventory-history")
      .then((response) => {
        setHistory(
          response.data.inventoryHistory.map((item) => {
            item.createdAt = parseISOString(item.createdAt);
            return item;
          })
        );
        setItemNameSearch("");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    getEntireInventoryHistory();
  }, []);

  const handleSubmitItemName = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!itemNameSearch) {
      getEntireInventoryHistory();
    } else {
      axios.get(`/api/inventory/${itemNameSearch}`).then((response) => {
        axios
          .get(`/api/inventory-history/item-id/${response.data.item.id}`)
          .then((response) => {
            setHistory(
              response.data.inventoryHistory.map((entry) => {
                entry.createdAt = parseISOString(entry.createdAt);
                return entry;
              })
            );
            setLoading(false);
          });
      });
    }
  };

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

  if (id) {
    <GetFromInventoryHistory />;
  } else {
    return (
      <>
        <Header />
        <div className="py-20">
          <h1 className="text-4xl font-bold text-center mb-10">
            Get Inventory History
          </h1>
          <div className="flex flex-row w-[80%] m-auto mb-14">
            <input
              className="bg-gray-800 p-2 w-full rounded-xl text-white"
              placeholder="Filter by Item Name"
              value={itemNameSearch}
              onChange={(e) => setItemNameSearch(e.target.value)}
            />
            <button
              className="bg-black text-white px-4 rounded-xl ml-4 py-2"
              onClick={(e) => handleSubmitItemName(e)}
            >
              Enter
            </button>
            <button
              className="bg-black text-white px-4 rounded-xl ml-4 py-2"
              onClick={(e) => {
                getEntireInventoryHistory(e);
              }}
            >
              Reset
            </button>
          </div>
          {history.map((item) => (
            <div className="w-[90%] m-auto bg-gray-800 p-6 mb-4 flex flex-row justify-between rounded-xl">
              <div className="flex flex-col">
                <p className="text-white">{item.itemName}</p>
                <p className="text-white">Entry ID: {item.id}</p>
                <p className="text-white">Quantity: {item.amount}</p>
                <p className="text-white">
                  Transaction Type: {item.transactionType}
                </p>
                <p className="text-white">
                  Time:{" "}
                  {`${
                    monthNames[item.createdAt.getMonth()]
                  } ${item.createdAt.getDate()}, ${item.createdAt.getFullYear()} ${item.createdAt.toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}`}
                </p>
              </div>
              <div>
                <Link
                  to={`/get-inventory-history/${item.id}`}
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
