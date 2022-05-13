import Header from "./components/Header";
import "./styles.css";

export default function App() {
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
