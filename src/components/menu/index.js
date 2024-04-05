import React from 'react';
import { Link, useLocation } from "react-router-dom";
import usuarioService from "../../services/usuario-service";
import './index.css'

export default function Menu() {
    const location = useLocation();

    const logout = () => {
        usuarioService.sairDoSistema();
    };

    if(useLocation().pathname !== "/login"){
        return (
            <ul className="menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/clientes">Clientes</Link></li>
                <li><Link to="/produtos">Produtos</Link></li>
                <li><Link to="/login" onClick={logout}>Sair</Link></li>
            </ul>
        );
    } else {
        return null; 
    }

    
}
