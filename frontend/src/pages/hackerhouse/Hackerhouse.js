import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../style/hackerhouse.css"
import testCohorts from "../../testData/featured";
import testMembers from "../../testData/members";
  
const Hackerhouse = (props) => {

    const [coreComplete, setCoreComplete] = useState('')
    const [cohortsTab, setCohortsTab] = useState(true);
    const [membersTab, setMembersTab] = useState(false);
    const [applicantsTab, setApplicantsTab] = useState(false);

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
    return (
        <div className="hackerhouse-page">
            <Link to="/profile"><div className="profile-btn"></div></Link>
            <Link to="/"><h1 className="logo">NOMADIC</h1></Link>

            <div className="hackerhouse-banner"></div>
            <h1 className="hackerhouse-name">NOMAD DAO</h1>
            {coreComplete ? <button onClick={joinDAO} className="button hackerhouse-btn">APPLY</button> : <button onClick={joinCoreTeam} className="button hackerhouse-btn">JOIN CORE TEAM</button>}
            <p className="hackerhouse-mission">
                Some mission here pretty long mission up to 150 characters I think. 
                Yeah I think it's long enough or not lets add more text to check how it looks like
            </p>
            <div className="values">
                <div className="tag">WEB3</div>
                <div className="tag">DEVELOPMENT</div>
                <div className="tag">NETWORKING</div>
                <div className="tag">WORKSHOPS</div>

            </div>
            <div className="tabs-btns">
                {cohortsTab ? <button className="tab-btn tab-selected" onClick={selectCohortsTab}>COHORTS</button> : <button onClick={selectCohortsTab} className="tab-btn">COHORTS</button>}
                {membersTab ? <button className="tab-btn tab-selected" onClick={selectMembersTab}>MEMBERS</button> : <button onClick={selectMembersTab} className="tab-btn">MEMBERS</button>}
                {applicantsTab ? <button className="tab-btn tab-selected" onClick={selectApplicantsTab}>APPLICANTS</button> : <button onClick={selectApplicantsTab} className="tab-btn">APPLICANTS</button>}
            </div>
            <div className="line"></div>
            {cohortsTab ? 
                <div className="tab-content">{renderCohorts()}</div> :
            membersTab ? 
                <div className="tab-content">{renderMembers()}</div> :
            applicantsTab ? 
                <div>Applicants</div> : 
            ''}

        </div>
    )
}

export default Hackerhouse;