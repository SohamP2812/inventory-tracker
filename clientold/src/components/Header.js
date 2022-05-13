import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

const Header = () => (
  <div className="py-5 bg-slate-800 text-white px-4">
    <div className="flex flex-row justify-between">
      <h1>Inventory Tracking System</h1>
      <div>
        <Link to="/" className="bg-white text-black px-3 py-1 rounded-xl ml-2">
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
      </div>
    </div>
  </div>
);
export default Header;
