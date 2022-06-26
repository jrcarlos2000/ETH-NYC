import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../style/hackerhouse.css"
import testCohorts from "../../testData/cohorts";
import testMembers from "../../testData/members";
import { useParams } from "react-router-dom";
import { contractData, NOMADICVAULT, CONTRACT_NAMES } from "../../utils/config";
import { useContract, useNetwork, useSigner, useProvider } from 'wagmi';
import axios from "axios";
  
const Hackerhouse = (props) => {
    let { id: hackerHouseId } = useParams();
    console.log("id: ", hackerHouseId);
    const { activeChain } = useNetwork();
    const { data: signer } = useSigner()
    const provider = useProvider();

    const [coreComplete, setCoreComplete] = useState('')
    const [cohortsTab, setCohortsTab] = useState(true);
    const [membersTab, setMembersTab] = useState(false);
    const [applicantsTab, setApplicantsTab] = useState(false);
    const [name, setName] = useState("Nomad DAO");
    const [mission, setMission] = useState("Mission");
    const [values, setValues] = useState("Values");
    const [membershipCost, setMembershipCost] = useState(100);
    const [coreTeam, setCoreTeam] = useState([]);
    const [coreTeamCount, setCoreTeamCount] = useState(0);

    const contractName = CONTRACT_NAMES[NOMADICVAULT];
    const contractAddress = contractData[activeChain.id][contractName].address;
    const contractAbi = contractData[activeChain.id][contractName].abi;

    console.log(contractAddress, contractAbi, activeChain.id, contractName);

    useEffect(() => {
        fetchHouseData();
    });

    const contract = useContract({
        addressOrName: contractAddress,
        contractInterface: contractAbi,
        signerOrProvider: signer,
    })

    const fetchHouseData = async () => {
        const hhData = await contract.getHackerHouseById(hackerHouseId);
        console.log("hhData: ", hhData);
        setName(hhData.name);
        const metadata = (await axios.get(hhData.descriptionURI)).data;

        setMission(metadata.mission);
        setValues(metadata.values);
        setMembershipCost(hhData.membershipCost);
        setCoreTeam(hhData.coreTeam);
        setCoreTeamCount(hhData.coreTeamCount);
        // dr: "0x0000000000000000000000000000000000000000"
        // coreTeam: (5) ['0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']
        // coreTeamCount: BigNumber {_hex: '0x01', _isBigNumber: true}
        // descriptionURI: "https://ipfs.io/ipfs/bafkreibvqq562bqzd2quggblfrej6xuyqrnbnvqcrht3qvf5i4e42fzfxm"
        // id: BigNumber {_hex: '0x00', _isBigNumber: true}
        // isActive: false
        // membershipCost: BigNumber {_hex: '0x64', _isBigNumber: true}
        // name: "HackerHouse1"
        
    }

    const selectCohortsTab = () => {
        setCohortsTab(true);
        setMembersTab(false);
        setApplicantsTab(false);
    }

    const selectMembersTab = () => {
        setCohortsTab(false);
        setMembersTab(true);
        setApplicantsTab(false);
    }

    const selectApplicantsTab = () => {
        setCohortsTab(false);
        setMembersTab(false);
        setApplicantsTab(true);
    }

    const joinCoreTeam = () => {
        setCoreComplete(true);
    }

    const joinDAO = () => {
        setCoreComplete(false);
    }

    const renderCohorts = () => {
        const offer = testCohorts.map((offer) => {
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
            <div className="cohorts">
                {offer}
            </div>
        )
    }
    const renderMembers = () => {
        const member = testMembers.map((member) => {
            return(
                <div className="member-container">
                    <p className="member-address">{member}</p>
                </div>
            )
        });
        return(
            <div className="members">
                {member}
            </div>
        )
    }
    const renderApplicants = () => {
        const member = testMembers.map((applicant) => {
            return(
                <div className="member-container">
                    <p className="member-address">{applicant}</p>
                    <button className="button dao-approve-btn">APPROVE</button>
                </div>
            )
    });
    return(
        <div className="members">
            {member}
        </div>
    )
    }
    return (
        <div className="hackerhouse-page">
            <Link to="/profile"><div className="profile-btn"></div></Link>
            <Link to="/"><h1 className="logo">NOMADIC</h1></Link>

            <div className="hackerhouse-banner"></div>
            <h1 className="hackerhouse-name">{name}</h1>
             {coreComplete ? <button onClick={joinDAO} className="button hackerhouse-btn">APPLY</button> : <button onClick={joinCoreTeam} className="button hackerhouse-btn">JOIN CORE TEAM</button>}
            <p className="hackerhouse-mission">
                {mission}
            </p>
            <div className="values">
                {values && values.split(', ').map((val) => {
                    return (
                      <div className="tag">{val}</div>
                    )
                })}
                {/* <div className="tag">WEB3</div>
                <div className="tag">DEVELOPMENT</div>
                <div className="tag">NETWORKING</div>
                <div className="tag">WORKSHOPS</div> */}
            </div>
            <div className="tabs-btns">
                {cohortsTab ? <button className="tab-btn tab-selected" onClick={selectCohortsTab}>COHORTS</button> : <button onClick={selectCohortsTab} className="tab-btn">COHORTS</button>}
                {membersTab ? <button className="tab-btn tab-selected" onClick={selectMembersTab}>MEMBERS</button> : <button onClick={selectMembersTab} className="tab-btn">MEMBERS</button>}
                {applicantsTab ? <button className="tab-btn tab-selected" onClick={selectApplicantsTab}>APPLICANTS</button> : <button onClick={selectApplicantsTab} className="tab-btn">APPLICANTS</button>}
            </div>
            <div className="line"></div>
            {cohortsTab ? 
                <div className="tab-content"><div className="content-dim"></div>{renderCohorts()}</div> :
            membersTab ? 
                <div className="tab-content"><div className="content-dim"></div>{renderMembers()}</div> :
            applicantsTab ? 
            <div className="tab-content"><div className="content-dim"></div>{renderApplicants()}</div> : 
            ''}

        </div>
    )
}

export default Hackerhouse;