import React, { useEffect } from 'react';
import * as waxjs from "@waxio/waxjs/dist";

import waxlogo from '../assets/wax.png';

function TopBar({wax, setWax, userAccount, setUserAccount,pubKeys, setPubKeys}) {

    function onClick(){
        //console.log("wax: ", wax);
        //setWax(new waxjs.WaxJS('https://wax.greymass.com', null, null, false));
        login();
      }
    
    async function login() {
        try {
            setUserAccount(await wax.login());
            setPubKeys(wax.pubKeys);
        } catch (e) {
                
        }
    } 

    useEffect(() => {
        if(pubKeys){
          setWax(new waxjs.WaxJS('https://wax.greymass.com', userAccount, pubKeys, false));
        }
    }, [userAccount, pubKeys, setWax]);

    return (
        <div  >
            {!userAccount && <button className="btnlogin" onClick={onClick}>
                <img src={waxlogo} alt="Wax Login" />
                Cloud wallet Login
            </button>}
            {userAccount && 
                <div className="cabecalhoLogin">
                    <p> {userAccount}</p>
                </div>
            }
        </div>
    );
}

export default TopBar;
