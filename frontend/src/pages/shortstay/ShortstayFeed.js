import React, { useEffect } from "react";
import "../../style/feed.css"
import testData from "../../testData/feed";
import { useSigner, useContract, useProvider, useNetwork } from 'wagmi'
import { CONTRACT_NAMES, NOMADICVAULT } from '../../utils/config';
import { contractData } from '../../utils/config';
import { Link } from "react-router-dom";

const ShortstayFeed = (props) => {
    const { data: signer } = useSigner()
    const provider = useProvider();
    const { activeChain } = useNetwork();
    const contractName = CONTRACT_NAMES[NOMADICVAULT];
    const contractAddress = contractData[activeChain.id][contractName].address;
    const contractAbi = contractData[activeChain.id][contractName].abi;
    console.log('contractAddress: ', contractAddress);
    console.log("signer: ", signer);
    const contract = useContract({
      addressOrName: contractAddress,
      contractInterface: contractAbi,
      signerOrProvider: signer,
    })

    useEffect(() => {
        fetchStayList();
    }, [signer]);
    const fetchStayList = async () => {
        if (!signer) {
            return;
        }
        const result = await contract.getShortStays([1]);
        console.log("result - ", result);
    };

    const renderOffers = () => {
    const offer = testData.map((offer) => {
        let pricePerPerson = offer.totalPrice/offer.nPersons;
        return(
            <div className="stay-container" key={offer.id}>
                <div className="stay-banner"></div>
                <div className="stay-info">
                    <div className="offer-row1">
                        <h3 className="main-offer-name" id="feed-city-header">{offer.city}</h3>
                        <p className="offer-ppl" id="feed-ppl"><b>{offer.slotsReserved}/{offer.nPersons}</b></p>
                    </div>
                    <div className="offer-row2">
                        {offer.tags.map((tag) => {
                            return(
                                <div className="tag">{tag}</div>
                            )
                        })}
                    </div>
                    <div className="offer-row3" id="row3-feed">
                        <p className="chip-in-txt">Chip in for: <b>${pricePerPerson}</b></p>
                        <button className="button join-btn join-feed">VIEW</button>
                    </div>
                </div>
            </div>
            )
        });

        return(
            <div className="feed">
                <div className="top-dim"></div>
                    {offer}
            </div>
        )
    }
    return(
        <div className="feed-page">
            <div className="background-pic"></div>
            <Link to="/"><h1 className="logo">NOMADIC</h1></Link>
            <Link to="/profile"><div className="profile-btn"></div></Link>
            {renderOffers()}
            <form className="search-container">
                <div className="input-container">
                    <label className="input-label">Where to?</label>
                    <input className="input" placeholder="City"/>
                </div>
                <div className="input-container">
                    <label className="input-label">Housemates(count)</label>
                    <input className="input" type="number" min="1" id="housemates-input" placeholder="Housemates"/>
                </div>
                <div className="input-container">
                    <label className="input-label">Tags</label>
                    <textarea className="input" id="textfield" placeholder="Insert tags..."/>
                </div>
                <button className="button search-btn">SEARCH</button>
            </form>
        </div>
    )
}

export default ShortstayFeed;