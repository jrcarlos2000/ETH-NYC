import React from "react";
import { Link } from "react-router-dom";
import "../../style/hackerhouse.css"
  
const Hackerhouse = (props) => {
    return (
        <div className="hackerhouse-page">
            <Link to="/profile"><div className="profile-btn"></div></Link>
            <Link to="/"><h1 className="logo">NOMADIC</h1></Link>
            <div className="hackerhouse-banner"></div>
            <h1 className="hackerhouse-name">NOMAD DAO</h1>
            <p className="hackerhouse-mission">Some mission here pretty long mission up to 150 characters I think. Yeah I think it's long enough</p>
        </div>
    )
}

export default Hackerhouse;