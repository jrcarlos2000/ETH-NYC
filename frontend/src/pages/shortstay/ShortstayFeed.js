import React, { useEffect, useState } from "react";
import "../../style/feed.css"
import testData from "../../testData/feed";
import { useSigner, useContract, useProvider, useNetwork } from 'wagmi'
import { CONTRACT_NAMES, NOMADICVAULT } from '../../utils/config';
import { contractData } from '../../utils/config';
import { Link } from "react-router-dom";
import axios from 'axios';

const ShortstayFeed = (props) => {
    const { data: signer } = useSigner()
    const provider = useProvider();
    const { activeChain } = useNetwork();
    const contractName = CONTRACT_NAMES[NOMADICVAULT];
    const contractAddress = contractData[activeChain.id][contractName].address;
    const contractAbi = contractData[activeChain.id][contractName].abi;
    const [feedData, setFeedData] = useState();
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
        if (!signer || feedData) {
            return;
        }
        let result = await contract.getShortStays([0]);
        console.log("result - ", result);
        result = await Promise.all(result.map(async (item) => {
            const descriptionURI = item.descriptionURI;
            let descData = {
                city: "n/a",
                link: "n/a",
                tags: "n/a"
            }
            if (descriptionURI) {
                try {
                    descData = (await axios.get(descriptionURI)).data;
                } catch (e) {
                    console.error(e);
                }
            }

            return {
                ...descData,
                ...item,
            }
        }));
        setFeedData(result);
    };

    const joinShortStay = () => {

    }

    const renderOffers = () => {
        if (!feedData) return <div></div>;
        const offer = feedData.map((offer) => {
            console.log('offer - ', offer);

            const shortStayId = offer.id.toNumber();
            const { city, link, tags } = offer;
            const trusteeAddress = offer.trustee;
            const isCreatorSlot = offer.isCreatorSlot;
            const nPersons = offer.nPersons.toNumber();
            const slotsReserved = offer.slotsReserved.toNumber();
            const amountFunded = offer.amountFunded.toNumber();
            const members = offer.members;
            const totalPrice = offer.totalPrice.toNumber();
            const pricePerPerson = offer.pricePerPerson.toNumber();
            
            return(
                <div className="stay-container" key={shortStayId}>
                    <div className="stay-banner"></div>
                    <div className="stay-info">
                        <div className="offer-row1">
                            <h3 className="main-offer-name" id="feed-city-header">{city}</h3>
                            <p className="offer-ppl" id="feed-ppl"><b>{slotsReserved}/{nPersons}</b></p>
                        </div>
                        <div className="offer-row2">
                            {tags.split(', ').map((tag) => {
                                return(
                                    <div className="tag">{tag}</div>
                                )
                            })}
                        </div>
                        <div className="offer-row3" id="row3-feed">
                            <p className="chip-in-txt">Trustee: <b>{trusteeAddress}</b></p>
                            <p className="chip-in-txt">Chip in for: <b>${pricePerPerson}</b></p>
                            <p className="chip-in-txt">Amount Funded: <b>${amountFunded}</b></p>
                            <p className="chip-in-txt">Members: <b>{[members.slice(0, members - 1), isCreatorSlot ? trusteeAddress : ''].join(', ')}</b></p>
                            <button className="button join-btn" onClick={() => joinShortStay(shortStayId)}>Join</button>
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