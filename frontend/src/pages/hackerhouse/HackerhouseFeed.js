import React, { useEffect, useState } from "react";
import "../../style/feed.css"
import testData from "../../testData/hackerhouses";
import { useSigner, useContract, useProvider, useNetwork } from 'wagmi'
import { CONTRACT_NAMES, NOMADICVAULT } from '../../utils/config';
import { contractData } from '../../utils/config';
import { Link } from "react-router-dom";

const HackerhouseFeed = (props) => {
    const { data: signer } = useSigner()
    const provider = useProvider();
    const { activeChain } = useNetwork();
    const [formingDAOs, setFormingDAOs] = useState([]);
    const [activeDAOs, setActiveDAOs] = useState([]);
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
        getFormingDAOs();
    }, [signer]);
    const getFormingDAOs = async () => {
        if (!signer) {
            return;
        }
        const _formingDAOs = await contract.getFormingDAOs();
        console.log("formingDAOs - ", _formingDAOs);
        setFormingDAOs(_formingDAOs);
    };
    const getActiveDAOs = async () => {
        if (!signer) {
            return;
        }
        const _activeDAOs = await contract.getActiveDAOs();
        console.log("_activeDAOs - ", _activeDAOs);
        setActiveDAOs(_activeDAOs);
    };

    const renderOffers = (type) => {
        const hhouseData = type === 'active' ? activeDAOs : formingDAOs;
        const ActionButtonText = type === 'active' ? 'Apply' : 'Core Team'
        const offer = hhouseData.map((hackerhouse) => {
            return(
                <div className="stay-container" key={hackerhouse.id}>
                    <div className="stay-banner"></div>
                    <div className="stay-info">
                        <div className="offer-row1">
                            <h3 className="main-offer-name" id="feed-city-header">{hackerhouse.name}</h3>
                        </div>
                        <p className="hackerhouse-feed-mission">
                            {hackerhouse.mission}
                        </p>
                        <div className="offer-row2">
                            {hackerhouse.values.map((value) => {
                                return(
                                    <div className="tag">{value}</div>
                                )
                            })}
                        </div>
                        <div className="offer-row3" id="row3-feed">
                            <p className="chip-in-txt">Chip in for: <b>${hackerhouse.fee}</b></p>
                            <Link to={`/hackerhouse/${hackerhouse.id}`}><button className="button join-btn join-feed">{ActionButtonText}</button></Link>
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
            <div className="offer-row1">
                <h3 className="main-offer-name" id="feed-city-header">Join a Nomad DAO</h3>
            </div>
            {renderOffers('active')}
            <div className="offer-row1">
                <h3 className="main-offer-name" id="feed-city-header">Join as Core Member</h3>
            </div>
            {renderOffers('forming')}
            <form className="search-container">
                <div className="input-container">
                    <label className="input-label">Name</label>
                    <input className="input" placeholder="City"/>
                </div>
                <div className="input-container">
                    <label className="input-label">Membership fee</label>
                    <input className="input" type="number" min="1" id="housemates-input" placeholder="Fee($)"/>
                </div>
                <div className="input-container">
                    <label className="input-label">Values</label>
                    <textarea className="input" id="textfield" placeholder="Insert some values..."/>
                </div>
                <button className="button search-btn">SEARCH</button>
            </form>
        </div>
    )
}

export default HackerhouseFeed;