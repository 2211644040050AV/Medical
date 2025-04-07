import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'font-awesome/css/font-awesome.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Medicine from "./components/Medicine";
import AddMedicine from "./components/AddMedicine";
import UpdateMedicine from "./components/UpdateMedicine";
import Cards from "./components/Cards";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Medicine /> } />
        <Route path="/add" element={ <AddMedicine /> } />
        <Route path="/edit/:id" element={<UpdateMedicine />} />
        <Route path="/cards" element={<Cards />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
