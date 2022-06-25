import React from "react";
import "../style/profile.css"
import { Link } from "react-router-dom";

const UserProfile = (props) => {
        return(
            <div className="profile-page">
                <div className="background-pic"></div>
                <h1 className="logo">NOMADIC</h1>
                <Link to="/profile"><div className="profile-btn"></div></Link>
                <div className="profile-container">
                    <div className="profile-pic"></div>
                    <div className="general-info">
                        <p className="address">0x43GF42SDF3321HFDS342GHF97FD7UF342H</p>
                    </div>
                    <div className="badges">
                        <h2 className="badges-header">BADGES</h2>
                        <div className="nfts">
                            <div className="nft-container">
                                <div className="nft-image"></div>
                                <h3 className="nft-city">New York</h3>
                            </div>
                            <div className="nft-container">
                                <div className="nft-image"></div>
                                <h3 className="nft-city">New York</h3>
                            </div>
                            <div className="nft-container">
                                <div className="nft-image"></div>
                                <h3 className="nft-city">New York</h3>
                            </div>
                            <div className="nft-container">
                                <div className="nft-image"></div>
                                <h3 className="nft-city">New York</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default UserProfile;