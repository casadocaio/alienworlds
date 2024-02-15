import React, { useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import waxlogo from '../imgs/WAX_Logo_White_NEU_new2.png';

function TopBar({ wax, setWax, userAccount, setUserAccount, pubKeys, setPubKeys }) {

    async function onClick() {
        const newWAX = await new waxjs.WaxJS({
            rpcEndpoint: 'https://wax.greymass.com',
            tryAutoLogin: false
          });

          console.log("newWAX: ", newWAX);

          const newUserAccount = await newWAX.login();

          
          console.log("newUserAccount: ", newUserAccount);
          setWax(newWAX);
          setUserAccount(newUserAccount);

    }

    useEffect(() => {
        if (userAccount && pubKeys) {
            console.log("userAccount effect: ", userAccount);
        }
    }, [userAccount, pubKeys, setWax]);


    return (
        <div  >
            {!userAccount
                && <button className="waxlogin" onClick={onClick}>
                    <img src={waxlogo} alt="Cloud Wallet Login" />
                </button>
            }
            {userAccount &&
                <div className="cabecalhoLogin">
                    <p> {userAccount}</p>
                </div>
            }
        </div>
    );
}

export default TopBar;
