import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CryptoDetail from "./pages/CryptoDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crypto/:id" element={<CryptoDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;