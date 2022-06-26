import React, { useState } from "react";
import "../../style/create.css";
import { useSigner, useContract, useNetwork, useAccount } from "wagmi";
import { CONTRACT_NAMES, NOMADICVAULT } from "../../utils/config";
import { contractData } from "../../utils/config";
import { defaultAbiCoder as abi } from "@ethersproject/abi";
import { WorldIDComponent } from "../../WorldIDComponent";
import { Link } from "react-router-dom";
import { uploadDataToIPFS } from "../../utils/core";
const CreateShortstay = (props) => {
  const { activeChain } = useNetwork();
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [housemates, setHousemates] = useState("");
  const [worldIDProof, setWorldIDProof] = useState(null);
  const [tags, setTags] = useState([]);
  const [creatorSpot, setCreatorSpot] = useState(false);
  const [deadline, setDeadline] = useState("");
  const { data: signer } = useSigner();

  const contractName = CONTRACT_NAMES[NOMADICVAULT];
  const { data: userData } = useAccount();
  const contractAddress = contractData[activeChain.id][contractName].address;
  const contractAbi = contractData[activeChain.id][contractName].abi;

  console.log(contractAddress, contractAbi, activeChain.id, contractName);

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    signerOrProvider: signer,
  })

  const onSubmitWorldCoin = async () => {
    if (!worldIDProof) {
        throw "World ID proof is missing.";
      }

    const descriptionURI = `${city}-${tags}`;
    const nPersons = Number(housemates);
    const totalPrice = Number(price);
    const timeAvailable = 123;
    const isCreatorSlot = creatorSpot;
    
    const result = await contract.proposeShortStay(
      descriptionURI,
      nPersons,
      totalPrice,
      timeAvailable,
      isCreatorSlot,
      worldIDProof.merkle_root,
    worldIDProof.nullifier_hash,
    abi.decode(["uint256[8]"], worldIDProof.proof)[0],
    { gasLimit: 10000000 },

  );
    await result.wait();
  }

  const onSubmitNormal = async () => {
    const descriptionURI = `${city}-${tags}`;
    const nPersons = Number(housemates);
    const totalPrice = Number(price);
    const timeAvailable = 123;
    const isCreatorSlot = creatorSpot;

    const metadata = {
      city,
      tags,
      descriptionURI,
      link
    }

    const cid = await uploadDataToIPFS(metadata);
    console.log('cid in sc', cid);
    
    const result = await contract.proposeShortStay(
        cid,
        nPersons,
        totalPrice,
        timeAvailable,
        isCreatorSlot
    );
    console.log('result: ', result);
    const resWait = await result.wait();
    console.log('resWait: ', resWait);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    if(activeChain.id == 0){
        console.log('trying with worldcoin id');
        await onSubmitWorldCoin(); 
    }else {
        await onSubmitNormal();
    }
  }

  const handleCity = (event) => {
    setCity(event.target.value);
  };
  const handlePrice = (event) => {
    setPrice(event.target.value);
  };
  const handleLink = (event) => {
    setLink(event.target.value);
  };
  const handleHousemates = (event) => {
    setHousemates(event.target.value);
  };
  const handleCreatorSpot = (event) => {
    setCreatorSpot(event.target.value);
  };
  const handleTags = (event) => {
    setTags(event.target.value);
  };
  const handleDeadline = (event) => {
    setDeadline(event.target.value);
  };

  return (
    <div className="create-page">
      {userData && (
        <WorldIDComponent
          signal={userData.address}
          signalParams={['testing',10,10000,12000]}
          setProof={(proof) => setWorldIDProof(proof)}
        />
      )}
      <div className="background-pic"></div>
      <Link to="/"><h1 className="logo">NOMADIC</h1></Link>
      <Link to="/profile"><div className="profile-btn"></div></Link>
      <form onSubmit={onSubmit} className="create-form" id="shortstay-form">
        <div className="field-container">
          <label className="label">Where to?</label>
          <div>
            <input
              type="text"
              placeholder="City"
              className="text-field field-small"
              value={city}
              onChange={handleCity}
            />
          </div>
        </div>
        <div className="field-container">
          <label className="label">Total price($)</label>
          <div>
            <input
              type="number"
              placeholder="Price"
              className="text-field field-small"
              value={price}
              onChange={handlePrice}
            />
          </div>
        </div>
        <div className="field-container" id="link-field">
          <label className="label">Link to offer</label>
          <div>
            <input
              type="text"
              placeholder="ex. https://..."
              className="text-field field-small"
              value={link}
              onChange={handleLink}
            />
          </div>
        </div>
        <div className="field-container" id="housemates-field">
          <label className="label">Housemates(count)</label>
          <div>
            <input
              type="number"
              placeholder="Number"
              className="text-field field-small"
              value={housemates}
              onChange={handleHousemates}
            />
          </div>
        </div>
        <div className="field-container" id="tags-field">
          <label className="label">
            Tags(separate "<b>,</b>")
          </label>
          <div>
            <input
              type="text"
              placeholder="Insert some tags..."
              className="text-field"
              value={tags}
              onChange={handleTags}
            />
          </div>
        </div>
        <div className="field-container" id="tags-field">
          <label className="label">Deadline(timestamp)</label>
          <div>
            <input
              type="number"
              placeholder="Timestamp"
              className="text-field field-small"
              value={deadline}
              onChange={handleDeadline}
            />
          </div>
        </div>
        <div className="field-container" id="checkbox-field">
          <div className="checkbox-container">
            <label className="label">Do you take one spot?</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="checkbox"
                value={creatorSpot}
                onChange={handleCreatorSpot}
              />
            </div>
          </div>
        </div>
        <input type="submit" className="create-btn" placeholder="CREATE" />
      </form>
    </div>
  );
};

export default CreateShortstay;
