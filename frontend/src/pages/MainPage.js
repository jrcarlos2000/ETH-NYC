import React, {useState} from "react";
import { Link } from "react-router-dom"
import "../style/main.css"
import testData from "../testData/featured";
import { Connect } from '../Components/Connect';


    const MainPage = (props) => {

        const [hackerhouse, setHackerhouse] = useState(false);
        const [shortStay, setShortStay] = useState(false)

        const chooseHackerhouse = () => {
            setHackerhouse(true);
        }
        const chooseShortStay = () => {
            setShortStay(true);
        }

        const renderFeatured = () => {
            const offer = testData.map((offer) => {
                let pricePerPerson = offer.totalPrice/offer.nPersons;
                return(
                    <div className="main-offer" key={offer.id}>
                        <div className="main-offer-dim"></div>
                            <div className="offer-row1">
                                <h3 className="main-offer-name">{offer.city}</h3>
                                <p className="offer-ppl"><b>{offer.slotsReserved}/{offer.nPersons}</b></p>
                            </div>
                            <div className="offer-row2">
                                {offer.tags.map((tag) => {
                                    return(
                                        <div className="tag">{tag}</div>
                                    )
                                })}
                            </div>
                            <div className="offer-row3">
                                <p className="chip-in-txt">Chip in for: <b>${pricePerPerson}</b></p>
                            <button className="button join-btn">JOIN</button>
                        </div>
                </div>
            )
        });

        return(
            <div className="featured-offers desktop">
            <h2 className="upcoming-header">UPCOMING</h2>
            
            {offer}
        </div>
        )
    }
        return(
            <div className="main-page">
                <div id="world-id-container"></div>
                <div className="background-pic"></div>
                <Link to="/"><h1 className="logo">NOMADIC</h1></Link>
                <Link to="/profile"><div className="profile-btn"></div></Link>
                <div className="slogan-container">
                    <h1 className="slogan">SHARING SPACE<br className="mobile"/> IS EASY.</h1>
                    <p className="slogan-mini">Book the best place together<br className="mobile"/> with no worries!</p>
                </div>
                <div>
                    {hackerhouse ? <div className="main-btns">
                                <Link to="/hackerhouse/feed"><button className="button main-btn" id="find-btn">FIND</button></Link>
                                <Link to="/hackerhouse/create"><button className="button main-btn">CREATE</button></Link>
                            </div> : 
                            shortStay ?
                            <div className="main-btns">
                                <Link to="/feed"><button className="button main-btn" id="find-btn">FIND</button></Link>
                                <Link to="/create"><button className="button main-btn">CREATE</button></Link>
                            </div> :
                            <div className="main-btns">
                                <button className="button main-btn" onClick={chooseHackerhouse} id="find-btn">HACKERHOUSE</button>
                                <button className="button main-btn" onClick={chooseShortStay}>SHORT STAY</button>
                            </div>                            
                            }
                </div>
                {renderFeatured()}
            </div>
        )
}

export default MainPage;