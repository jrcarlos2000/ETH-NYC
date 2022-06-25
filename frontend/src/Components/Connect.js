import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";

export const Connect = (props) => {
  return (
    <div>
        <div className="connect-container">
          <ConnectButton className="connect-btn"/>
        </div>
        {props.children}
    </div>
  );
};
