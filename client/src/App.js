import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Auth from "./components/Auth";
import GetInventory, { GetFromInventory } from "./routes/get-inventory";
import GetInventoryHistory, {
  GetFromInventoryHistory,
} from "./routes/get-inventory-history";
import AddToInventory from "./routes/add-to-inventory";
import EditQuantity from "./routes/edit-quantity";
import DeleteFromInventory from "./routes/delete-from-inventory";
import "./App.css";

function Home() {
  return (
    <>
      <Header />
      <div className="py-20">
        <h1 className="text-4xl font-bold underline text-center">
          Inventory Tracking System
        </h1>
      </div>
    </>
  );
}

export default function App() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="get-inventory" element={<GetInventory />} />
        <Route path="get-inventory/:name" element={<GetFromInventory />} />
        <Route path="get-inventory-history" element={<GetInventoryHistory />} />
        <Route
          path="get-inventory-history/:id"
          element={<GetFromInventoryHistory />}
        />
        <Route path="add-to-inventory" element={<AddToInventory />} />
        <Route path="edit-quantity/:name" element={<EditQuantity />} />
        <Route
          path="delete-from-inventory/:name"
          element={<DeleteFromInventory />}
        />
      </Routes>
    </BrowserRouter>
  );
}
