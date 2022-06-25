import React from "react";
import { Link } from "react-router-dom";
import "../style/profile.css"
const ShortstayOffer = (props) => {
        return(
            <div className="offer-page">
                <div className="background-pic"></div>
                <Link to="/"><h1 className="logo">NOMADIC</h1></Link>
                <Link to="/profile"><div className="profile-btn"></div></Link>
                <div className="offer-container">
                </div>
            </div>
        )
}

export default ShortstayOffer;