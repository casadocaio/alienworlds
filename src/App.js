import React, { useEffect, useState } from 'react';
import './App.css';
import * as waxjs from "@waxio/waxjs/dist";

import waxlogo from './assets/wax.png';

function App() {

  const [userAccount, setUserAccount] = useState("");
  const [donateValue, setDonateValue] = useState(1);
  const [pubKeys, setPubKeys] = useState([{}]);
  const [wax, setWax] = useState({});

  //const wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false); //teste

  useEffect(() => {
    if(pubKeys){
      setWax(new waxjs.WaxJS('https://wax.greymass.com', userAccount, pubKeys, false));
    }
   }, [pubKeys]);

  function onClick(){
    console.log("wax: ", wax);
    login();
  }

  async function login() {
    try {
        setUserAccount(await wax.login());
        setPubKeys(wax.pubKeys);

        
    } catch (e) {
            
    }
   } 

   async function donate() {

    console.log("wax.api: ", wax.api);
    //return;

    if(!wax.api) {
        return document.getElementById('response').append('* Login first *');
    }


    try {
        const result = await wax.api.transact({
        actions: [{
            //account: 'eosio',
            account: 'eosio.token',
            //name: 'delegatebw',
            name: 'transfer',
            authorization: [{
            actor: wax.userAccount,
            permission: 'active',
            }],
            data: {
            from: wax.userAccount,
            to: 'z5tbm.wam',
            //receiver: 'z5tbm.wam',
            //receiver: 'gcyto.wam',
            quantity: Number.parseFloat(donateValue).toPrecision(9) + ' WAX',
            /*stake_net_quantity: '0.00000001 WAX',
            stake_cpu_quantity: '0.00000000 WAX',*/
            //transfer: false,
            memo: 'Tks fellow mate.'
            },
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        document.getElementById('response').append(JSON.stringify(result, null, 2).id)
    } catch(e) {
        document.getElementById('response').append(e.message);
    }
  };

   useEffect(() => {
    if(wax.api){
      console.log("getTransactionAbis: ", wax.api);
    }
   }, [wax]);

   useEffect(() => {
    console.log("userAccount: ", userAccount);
    console.log("pubKeys: ", pubKeys);
   }, [userAccount, pubKeys]);

  return (
    <div className="App">
      <header className="App-header">
        {!userAccount && <button className="btnlogin" onClick={onClick}>
          <img src={waxlogo} alt="Wax Login" />
          Cloud wallet Login
        </button>}
        {userAccount && <>
            <p>Logged in as: {userAccount}</p>
            <div>
              <input id="txtDonate" value={donateValue} onChange={event => setDonateValue(event.target.value)}></input>
              <button className="btnlogin" onClick={donate}>
                Donate
              </button>
            </div>
            <div>
            <code id="response">Transaction Response: </code>
            </div>
          </>
        }
      </header>
    </div>
  );
}

export default App;
