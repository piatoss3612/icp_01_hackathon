import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from './context/auth';
import Header from "./components/Header";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import Mypage from "./pages/Mypage";
import { BackendProvider } from './context/backend';
import { LedgerProvider } from './context/ledger';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <BackendProvider>
            <LedgerProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/create" element={<Create />} />
                <Route path="/mypage" element={<Mypage />} />
              </Routes>
            </LedgerProvider>
          </BackendProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;