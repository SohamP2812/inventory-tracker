import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import GetInventory, { GetFromInventory } from "./routes/get-inventory";
import GetInventoryHistory, {
  GetFromInventoryHistory,
} from "./routes/get-inventory-history";
import AddToInventory from "./routes/add-to-inventory";
import EditQuantity from "./routes/edit-quantity";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="get-inventory" element={<GetInventory />} />
      <Route path="get-inventory/:name" element={<GetFromInventory />} />
      <Route path="get-inventory-history" element={<GetInventoryHistory />} />
      <Route
        path="get-inventory-history/:id"
        element={<GetFromInventoryHistory />}
      />
      <Route path="add-to-inventory" element={<AddToInventory />} />
      <Route path="edit-quantity/:name" element={<EditQuantity />} />
    </Routes>
  </BrowserRouter>
);
