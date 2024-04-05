import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import Clientes from "./pages/clientes";
import Produtos from "./pages/produtos";
import Login from "./pages/login";
import Menu from "./components/menu";

export default function Router() {
    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                   
                <Route path="/" element={<Home />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/login" element={<Login />} />  
            </Routes>
        </BrowserRouter>
    );
}

