import React, { useEffect, useState } from 'react';

import TopBar from './components/TopBar';
import Snake from './components/Snake';
import Cait from './components/Cait';
import OLV from './components/OLV';
import TLM from './components/TLM';

import './App.css';

function App() {

  const [userAccount, setUserAccount] = useState("");
  const [donateValue, setDonateValue] = useState(1);
  const [pubKeys, setPubKeys] = useState([{}]);
  const [wax, setWax] = useState();
  const [queryJson, setQueryJson] = useState([{}]);

  useEffect(() => {

    if (userAccount) {
      fetch('https://api.waxsweden.org/v2/history/get_actions?limit=1000&skip=0&account=' + userAccount + '&sort=desc')
        .then(response => response.json())
        .then(data => setQueryJson(data.actions));
    }

  }, [userAccount]);

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
          queryJson={queryJson}
          setQueryJson={setQueryJson}
        />
      </div>
      {userAccount &&
        <div>
          <div className="fichaClaim">
            <Cait
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              donateValue={donateValue}
              setDonateValue={setDonateValue}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              wax={wax}
              setWax={setWax}
              queryJson={queryJson}
              setQueryJson={setQueryJson}
            />
          </div>
          <div className="fichaClaim">
            <Snake
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              donateValue={donateValue}
              setDonateValue={setDonateValue}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              wax={wax}
              setWax={setWax}
              queryJson={queryJson}
              setQueryJson={setQueryJson}
            />
          </div>
          <div className="fichaClaim">
            <OLV
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              donateValue={donateValue}
              setDonateValue={setDonateValue}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              wax={wax}
              setWax={setWax}
              queryJson={queryJson}
              setQueryJson={setQueryJson}
            />
          </div>
          <div className="fichaTable">
            <TLM
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              donateValue={donateValue}
              setDonateValue={setDonateValue}
              pubKeys={pubKeys}
              setPubKeys={setPubKeys}
              wax={wax}
              setWax={setWax}
              queryJson={queryJson}
              setQueryJson={setQueryJson}
            />
          </div>
        </div>
      }
    </div>
  );
}

export default App;
