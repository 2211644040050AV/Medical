import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Medicine from "./components/Medicine";
import AddMedicine from "./components/AddMedicine";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Medicine /> } />
        <Route path="/add" element={ <AddMedicine /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
