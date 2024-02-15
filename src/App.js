import React, { useState } from 'react';

import TopBar from './components/TopBar.js';
import Grabber from './components/Grabber.js';

import capa from './imgs/nethrims_head_pag.png';
import waxLogo from './imgs/WAX_Logo_White_NEU_new2.png'
import './App.css';

function App() {
  const [wax, setWax] = useState();
  const [userAccount, setUserAccount] = useState("");
  const [pubKeys, setPubKeys] = useState([{}]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={capa}
          className="App-capa"
          alt="capa"
        />

        <div className="topbar">
          <TopBar
            wax={wax}
            setWax={setWax}
            userAccount={userAccount}
            setUserAccount={setUserAccount}
            pubKeys={pubKeys}
            setPubKeys={setPubKeys}
          />
        </div>

        {userAccount &&
          <div className="grabber">
            <Grabber
              userAccount={userAccount}
              setUserAccount={setUserAccount}
            />
          </div>

        }
        <a
          className="App-link"
          href="https://raulfgamestudio.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Raulf Game Studio - 2024
        </a>
      </header>
    </div>
  );
}

export default App;
