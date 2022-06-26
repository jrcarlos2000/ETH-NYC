import React, { useEffect, useState } from "react";
import "../../style/feed.css"
import testData from "../../testData/hackerhouses";
import { useSigner, useContract, useProvider, useNetwork } from 'wagmi'
import { CONTRACT_NAMES, NOMADICVAULT } from '../../utils/config';
import { contractData } from '../../utils/config';
import { Link } from "react-router-dom";
import axios from "axios";

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
        getActiveDAOs();
    }, [signer]);
    const fetchDescriptionURI = async (dao) => {
        let data = {
            values: 'programming, kindness, service',
            mission: 'build cool stuff',
            codeOfConduct: 'be excellent to each other'
        }
        if (dao.descriptionURI) {
            data = (await axios.get(dao.descriptionURI)).data;
        }
        return {
            ...data,
            ...dao
        }
    }
    const getFormingDAOs = async () => {
        if (!signer) {
            return;
        }
        let _formingDAOs = await contract.getFormingDAOs();
        _formingDAOs = await Promise.all(_formingDAOs.map(fetchDescriptionURI));
        console.log("formingDAOs - ", _formingDAOs);
        setFormingDAOs(_formingDAOs);
    };
    const getActiveDAOs = async () => {
        if (!signer) {
            return;
        }
        let _activeDAOs = await contract.getActiveDAOs();
        _activeDAOs = await Promise.all(_activeDAOs.map(fetchDescriptionURI));
        console.log("_activeDAOs - ", _activeDAOs);
        setActiveDAOs(_activeDAOs);
    };

    const renderOffers = (type) => {
        const hhouseData = type === 'active' ? activeDAOs : formingDAOs;
        const ActionButtonText = type === 'active' ? 'Apply' : 'Core Team'
        const offer = hhouseData.map((hackerhouse) => {
            console.log('hackerhouse: ', hackerhouse);
            // addr: "0x0000000000000000000000000000000000000000"
            // coreTeam: (5) ['0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']
            // coreTeamCount: BigNumber {_hex: '0x01', _isBigNumber: true}
            // descriptionURI: "https://ipfs.io/ipfs/bafkreigf2uqmvdzgj3a5ps2rxc7rhoaj4ivk6yair6gra3l25louo67nvi"
            // id: BigNumber {_hex: '0x00', _isBigNumber: true}
            // isActive: false
            // name: "HackerHouseDAO"
            return(
                <div className="stay-container" key={hackerhouse.id.toNumber()}>
                    <div className="stay-banner"></div>
                    <div className="stay-info">
                        <div className="offer-row1">
                            <h3 className="main-offer-name" id="feed-city-header">{hackerhouse.name}</h3>
                        </div>
                        <p className="hackerhouse-feed-mission">
                            {hackerhouse.mission}
                        </p>
                        <div className="offer-row2">
                            {hackerhouse.values.split(', ').map((value) => {
                                return(
                                    <div className="tag">{value}</div>
                                )
                            })}
                        </div>
                        <div className="offer-row3" id="row3-feed">
                            <p className="chip-in-txt">Chip in for: <b>${hackerhouse.fee}</b></p>
                            <Link to={`/hackerhouse/${hackerhouse.id.toNumber()}`}><button className="button join-btn join-feed">Learn More</button></Link>
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
            <div class="feed-wrapper">
                <div className="offer-row1">
                    <h3 className="main-offer-name" id="feed-city-header">Join as Core Member</h3>
                </div>
                {renderOffers('forming')}
                <div className="offer-row1">
                    <h3 className="main-offer-name" id="feed-city-header">Join a Nomad DAO</h3>
                </div>
                {renderOffers('active')}
            </div>
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