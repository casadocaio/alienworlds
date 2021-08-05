import React, { useState } from 'react';

import TopBar from './components/TopBar';
import Snake from './components/Snake';
import Cait from './components/Cait';
import TLM from './components/TLM';

import './App.css';

function App() {

  const [userAccount, setUserAccount] = useState("");
  const [donateValue, setDonateValue] = useState(1);
  const [pubKeys, setPubKeys] = useState([{}]);
  const [wax, setWax] = useState();

  return (
    <div className="App">
      <div>
      </div>
      <div className="topbar">
        <TopBar 
          userAccount={userAccount}
          setUserAccount={setUserAccount}
          donateValue={donateValue}
          setDonateValue={setDonateValue}
          pubKeys={pubKeys}
          setPubKeys={setPubKeys}
          wax={wax}
          setWax={setWax}
        />
      </div>
      {userAccount &&
      <div>
        <div className="topbar padrao">
          <Snake 
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              donateValue={donateValue}
              setDonateValue={setDonateValue}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              wax={wax}
              setWax={setWax}
            />
          </div>
          <div className="topbar">
          <Cait 
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              donateValue={donateValue}
              setDonateValue={setDonateValue}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              wax={wax}
              setWax={setWax}
            />
          </div>
          <div className="topbar">
          <TLM 
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              donateValue={donateValue}
              setDonateValue={setDonateValue}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              wax={wax}
              setWax={setWax}
            />
          </div>
        </div>
      }
    </div>
  );
}

export default App;
