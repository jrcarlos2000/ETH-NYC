import React, {useState} from "react";
import { useSigner, useContract, useNetwork } from 'wagmi'
import { CONTRACT_NAMES, NOMADICVAULT } from '../../utils/config';
import { contractData } from '../../utils/config';
import { Link } from "react-router-dom";
import "../../style/create.css"
  
const CreateHackerhouse = (props) => {
    const { activeChain } = useNetwork();
    const [name, setName] = useState('');
    const [membershipFee, setMembershipFee] = useState('');
    const [values, setValues] = useState('');
    const [mission, setMission] = useState('');
    const [codeOfConduct, setCodeOfConduct] = useState('');
    const { data: signer } = useSigner()

    const contractName = CONTRACT_NAMES[NOMADICVAULT];
    const contractAddress = contractData[activeChain.id][contractName].address;
    const contractAbi = contractData[activeChain.id][contractName].abi;

    console.log(contractAddress, contractAbi, activeChain.id, contractName);
    const contract = useContract({
      addressOrName: contractAddress,
      contractInterface: contractAbi,
      signerOrProvider: signer,
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log("submit")
    }

    const handleName = (event) => {
        setName(event.target.value);
    }
    const handleMembershipFee = (event) => {
        setMembershipFee(event.target.value);
    }
    const handleValues = (event) => {
        setValues(event.target.value);
    }
    const handleMission = (event) => {
        setMission(event.target.value);
    }
    const handleCodeOfConduct = (event) => {
        setCodeOfConduct(event.target.value);
    }

    return (
        <div className="create-page">
            <div className="background-pic"></div>
            <Link to="/"><h1 className="logo">NOMADIC</h1></Link>
            <Link to="/profile"><div className="profile-btn"></div></Link>
            <form onSubmit={onSubmit} className="hackerhouse-form">
                    <div className="field-container">
                        <label className="label hackerhouse-label">Hackerhouse Name</label>
                        <div>
                            <input type="text" placeholder="Name" className="text-field hackerhouse-field field-small" value={name} onChange={handleName}/>
                        </div>
                    </div>
                    <div className="field-container">
                        <label className="label hackerhouse-label">Membership</label>
                        <div>
                            <input type="number" placeholder="Yearly Fee($)" className="text-field hackerhouse-field field-small" value={membershipFee} onChange={handleMembershipFee}/>
                        </div>
                    </div>
                    <div className="field-container">
                        <label className="label hackerhouse-label">Shared values</label>
                        <div>
                            <input type="text" placeholder="Separate with (,)" className="text-field hackerhouse-field" value={values} onChange={handleValues}/>
                        </div>
                    </div>
                    <div className="field-container">
                        <label className="label hackerhouse-label">What's your mission?</label>
                        <div>
                            <textarea type="text" className="text-field hackerhouse-field textarea" value={mission} onChange={handleMission}/>
                        </div>
                    </div>
                    <div className="field-container">
                        <label className="label hackerhouse-label">Code of conduct</label>
                        <div>
                            <textarea type="textarea" className="text-field hackerhouse-field textarea" value={codeOfConduct} onChange={handleCodeOfConduct}/>
                        </div>
                    </div>
                <input type="submit" className="create-btn" placeholder="CREATE"/>
            </form>
        </div>
    )
}

export default CreateHackerhouse;