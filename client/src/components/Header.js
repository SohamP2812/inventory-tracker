import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { logout } = useContext(AuthContext);

  function handleLogout(e) {
    e.preventDefault();
    logout();
  }

  return (
    <div className="py-5 bg-slate-800 text-white px-4">
      <div className="flex flex-row justify-between">
        <h1>Inventory Tracking System</h1>
        <div>
          <Link
            to="/"
            className="bg-white text-black px-3 py-1 rounded-xl ml-2"
          >
            Home
          </Link>
          <Link
            to="/get-inventory"
            className="bg-white text-black px-3 py-1 rounded-xl ml-2"
          >
            List Inventory
          </Link>
          <Link
            to="/get-inventory-history"
            className="bg-white text-black px-3 py-1 rounded-xl ml-2"
          >
            Inventory History
          </Link>
          <Link
            to="/add-to-inventory"
            className="bg-white text-black px-3 py-1 rounded-xl ml-2"
          >
            Add Item
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-black px-3 py-1 rounded-xl ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
