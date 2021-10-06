import React, { useEffect, useRef, useState } from 'react';

import aw from '../assets/aw.jpg';

import { Serialize } from 'eosjs';
//import Int64LE from 'int64-buffer';
import crypto from 'crypto-browserify';
import { TextDecoder, TextEncoder } from 'text-encoding';

function AW({ wax, userAccount, queryJson, setQueryJson }) {

    //const [queryJson, setQueryJson] = useState([{}]);
    //const [lastActions, setLastActions] = useState([{}]);
    const [snakeDisabled, setSnakeDisabled] = useState(true);
    const [snakeDisplay, setSnakeDisplay] = useState("");
    //const [nonce, setNonce] = useState('');
    const [contagem, setContagem] = useState(0);
    const [contractReturn, setContractReturn] = useState("");
    const [label, setLabel] = useState("");

    let osciladorAW = useRef();


    function getDiffMinutes(d) {
        return Math.floor(((Date.now() - d) / 1000) / 60)
    }

    function schedule() {
        //console.log('contagem', contagem);

        if (contagem > 0) {
            setContagem(contagem - 1);
            setSnakeDisplay(new Date(contagem * 1000).toISOString().substr(11, 8).toString());
        } else {
            setSnakeDisabled(false);
            clearTimeout(osciladorAW.current);
        }
    }

    //let osciladorCait = useRef();

    const pushRand = (sb) => {
        const arr = getRand();
        sb.pushArray(arr);
        return arr;
    };

    const getRand = () => {
        const arr = new Uint8Array(8);
        for (let i=0; i < 8; i++){
            const rand = Math.floor(Math.random() * 255);
            arr[i] = rand;
        }
        return arr;
    };


    const nameToArray = (name) => {
        const sb = new Serialize.SerialBuffer({
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder()
        });

        sb.pushName(name);

        return sb.array;
    }

    function vaiAmigo (texto){
        let retorno = [];

        for(var i = 0; i < 16; i=i+2){
            //console.log('i',i);
            retorno.push(parseInt(texto.substr(i, 2), 16));
        }

        return retorno;
    }
/*
    const getNextMineDelay = async (mining_account, account, params, eos_rpc) => {
        const state_res = await eos_rpc.get_table_rows({
            code: mining_account,
            scope: mining_account,
            table: 'miners',
            lower_bound: account,
            upper_bound: account
        });
    
        let ms_until_mine = -1;
        const now = new Date().getTime();
        console.log(`Delay = ${params.delay}`);
    
        if (state_res.rows.length && state_res.rows[0].last_mine_tx !== '0000000000000000000000000000000000000000000000000000000000000000'){
            console.log(`Last mine was at ${state_res.rows[0].last_mine}, now is ${new Date()}`);
            const last_mine_ms = Date.parse(state_res.rows[0].last_mine + '.000Z');
            ms_until_mine = last_mine_ms + (params.delay * 1000) - now;
    
            if (ms_until_mine < 0){
                ms_until_mine = 0;
            }
        }
        console.log(`ms until next mine ${ms_until_mine}`);
    
        return ms_until_mine;
    };*/

    useEffect(() => {
        if (contagem <= 1) {
            setSnakeDisabled(false);
        }

        if (contagem > 0) {
            setSnakeDisabled(true);
            osciladorAW.current = setTimeout(schedule, 1000);
        } else {
            //setSnakeDisabled(false);
            clearTimeout(osciladorAW.current);
        }
    },[contagem])


    useEffect(() => {
        buscarUltimaMineracao();
    },[]);


    /*useEffect(() => {

        const vai = () => {

            //buscarUltimaMineracao();

            console.log('contagem', contagem);
            if (contagem <= 1) {
                setSnakeDisabled(false);
            }

            if (contagem > 0) {
                setSnakeDisabled(true);
                osciladorAW.current = setTimeout(schedule, 1000);
            } else {
                //setSnakeDisabled(false);
                clearTimeout(osciladorAW.current);
            }

            //buscarUltimaMineracao();
        };
        vai();
    })*/
    

    /*botão para pegar as moedas*/
    async function buscarUltimaMineracao() {

        //console.log('nameToArray(z5tbm.wam)', nameToArray('z5tbm.wam'));
        //return;

        fetch('https://api.waxsweden.org/v1/chain/get_table_rows', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "json": true,
                "code": "m.federation",
                "scope": "m.federation",
                "table": "miners",
                "lower_bound": wax.userAccount,
                "upper_bound": wax.userAccount,
                "index_position": 1,
                "key_type": "",
                "limit": "100",
                "reverse": false,
                "show_payer": false
              }),
            })
        .then(response => response.json())
        .then(data => {
            //console.log('Success:', data);
            let ms_until_mine = -1;
            const now = new Date().getTime();

            let lastM="";
        
            if (data.rows.length && data.rows[0].last_mine_tx !== '0000000000000000000000000000000000000000000000000000000000000000'){
                console.log(`Last mine was at ${data.rows[0].last_mine}, now is ${new Date()}`);
                const last_mine_ms = Date.parse(data.rows[0].last_mine + '.000Z');
                ms_until_mine = last_mine_ms + (360 * 1000) - now;

                lastM = data.rows[0].last_mine_tx.substr(0, 16);

                //console.log('getDiffMinutes(last_mine_ms)', getDiffMinutes(last_mine_ms));

                //clearTimeout(osciladorAW.current);

                let minutos = wax.userAccount ==='aumu.wam' ? 10 : 20;

                if (getDiffMinutes(last_mine_ms) > minutos) {
                    //setSnakeDisabled(false);
                    setContagem(0);
                    //clearTimeout(osciladorAW.current);
                } else {
                    //setSnakeDisabled(true);
                    setContagem((minutos - getDiffMinutes(last_mine_ms)) * 60);
                    //osciladorAW.current = setTimeout(schedule, 1000);
                }
        
                if (ms_until_mine < 0){
                    ms_until_mine = 0;
                }
            }
        })
    }

    /*botão para pegar as moedas*/
    async function onClick() {

        //console.log('nameToArray(z5tbm.wam)', nameToArray('z5tbm.wam'));
        //return;

        fetch('https://api.waxsweden.org/v1/chain/get_table_rows', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "json": true,
                "code": "m.federation",
                "scope": "m.federation",
                "table": "miners",
                "lower_bound": wax.userAccount,
                "upper_bound": wax.userAccount,
                "index_position": 1,
                "key_type": "",
                "limit": "100",
                "reverse": false,
                "show_payer": false
              }),
            })
        .then(response => response.json())
        .then(data => {
            //console.log('Success:', data);
            let ms_until_mine = -1;
            const now = new Date().getTime();

            let lastM="";
        
            if (data.rows.length && data.rows[0].last_mine_tx !== '0000000000000000000000000000000000000000000000000000000000000000'){
                //console.log(`Last mine was at ${data.rows[0].last_mine}, now is ${new Date()}`);
                const last_mine_ms = Date.parse(data.rows[0].last_mine + '.000Z');
                ms_until_mine = last_mine_ms + (360 * 1000) - now;

                lastM = data.rows[0].last_mine_tx.substr(0, 16);

                //console.log('getDiffMinutes(last_mine_ms)', getDiffMinutes(last_mine_ms));

                clearTimeout(osciladorAW.current);

                let minutos = wax.userAccount ==='aumu.wam' ? 10 : 20;

                if (getDiffMinutes(last_mine_ms) > minutos) {
                    setSnakeDisabled(false);
                    setContagem(0);
                } else {
                    setSnakeDisabled(true);
                    setContagem((minutos - getDiffMinutes(last_mine_ms)) * 60);
                }
        
                if (ms_until_mine < 0){
                    ms_until_mine = 0;
                }
            }

            

            //console.log(`ms until next mine ${ms_until_mine}`);
            //console.log('last_mine_tx', lastM);
            //console.log('last_mine_arr', vaiAmigo(lastM));
            


            /*let t1 = new Uint8Array ([0,0,144,134,3,121,114,249,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);*/

            let t1 = nameToArray(wax.userAccount);
                
                        let _message = {
                            data: {
                                mining_account: 'm.federation',
                                account: t1,
                                account_str: wax.userAccount,
                                difficulty: '4',
                                //last_mine_tx: '6a86497e142089bd6032944c0b333cee2e9fdc645b7eff8abd3b30ae8e223e91',
                                last_mine_tx: lastM,
                                //last_mine_tx: '4cb5bae49a6e459c',
                                last_mine_arr: new Uint8Array (vaiAmigo(lastM)),
                                sb: '',
                            }
                        };
                
                        //let {mining_account, account, account_str, difficulty, last_mine_tx, last_mine_arr, sb} = _message.data;
                        let { account, account_str, difficulty, last_mine_tx, sb} = _message.data;
                
                        console.log('_message', _message);
                        console.log('snakeDisabled', snakeDisabled);
                
                        //return;
                        //sb.pushName(toHex('z5tbm.wam'));
                
                        
                        account = account.slice(0, 8);
                
                        const is_wam = account_str.substr(-4) === '.wam';
                
                        let good = false, itr = 0, hash, hex_digest, rand_arr, last;
                
                        if (!last_mine_tx){
                            //console.error(`Please provide last mine tx`);
                            return;
                        }
                        last_mine_tx = last_mine_tx.substr(0, 16); // only first 8 bytes of txid
                        const last_mine_buf = Buffer.from(last_mine_tx, 'hex');
                        //const is_wam = account.substr(-4) === '.wam';
                        // const is_wam = true;
                    
                        console.log(`Performing work with difficulty ${difficulty}, last tx is ${last_mine_tx}...`);
                        if (is_wam){
                            console.log(`Using WAM account`);
                        }
                    
                        const start = (new Date()).getTime();
                
                        
                    
                        while (!good){
                            sb = new Serialize.SerialBuffer({
                                textEncoder: new TextEncoder(),
                                textDecoder: new TextDecoder()
                            });
                            //sb.pushName(account);
                            sb.pushName(account_str);
                            sb.pushArray(Array.from(last_mine_buf));
                            rand_arr = pushRand(sb);
                            hash = crypto.createHash("sha256");
                            hash.update(sb.array.slice(0, 24));
                            hex_digest = hash.digest('hex');
                            // console.log(hex_digest);
                            good = hex_digest.substr(0, 4) === '0000';
                            /*if (is_wam){
                                // easier for .wam accounts
                            }
                            else {
                                // console.log(`non-wam account, mining is harder`)
                                good = hex_digest.substr(0, 6) === '000000';
                            }*/
                    
                            if (good){
                                last = parseInt(hex_digest.substr(4, 1), 16);
                                /*if (is_wam){
                                }
                                else {
                                    last = parseInt(hex_digest.substr(6, 1), 16);
                                }*/
                                good &= (last <= difficulty);
                                // console.log(hex_digest);
                            }
                            itr++;
                    
                            if (itr % 50000000 === 0){
                                console.log(`Still mining - tried ${itr} iterations`);
                            }
                    
                            if (!good){
                                // delete sb;
                                // delete hash;
                            }
                    
                        }
                        const end = (new Date()).getTime();
                    
                        // console.log(sb.array.slice(0, 20));
                        // const rand_str = Buffer.from(sb.array.slice(16, 24)).toString('hex');
                        const rand_str = Array.from(rand_arr).map(i => ('0' + i.toString(16)).slice(-2)).join('');
                    
                        console.log(`Found hash in ${itr} iterations with ${account} ${rand_str}, last = ${last}, hex_digest ${hex_digest} taking ${(end-start) / 1000}s`)
                        //const mine_work = {account, rand_str, hex_digest};
                    
                        //return mine_work;
                
                       // this.postMessage(mine_work);
                
                        //return mine_work;
                
                        console.log('Nonce:', rand_str.toUpperCase());
                
                        //setNonce(mine_work);
                
                        //return;
                        mine(wax, rand_str.toUpperCase())
            })
        .catch((error) => {
            console.error('Error:', error);
            });

        //let t1 = toHex('z5tbm.wam');
        //let t2 = toHex('4cb5bae49a6e459c');
        //let ver = toHex('4cb5bae49a6e459c');
        
        //return;

        
    }


    async function mine (wax, nonce){
        if (!snakeDisabled) {
            //console.log("queryJsonOnClick: ", queryJson);
            if (!wax.api) {
                return document.getElementById('responseCait').append('* Login first *');
            }

            try {
                const result = await wax.api.transact({
                    actions: [{
                        account: 'm.federation',
                        name: 'mine',
                        authorization: [{
                            actor: wax.userAccount,
                            permission: 'active',
                        }],
                        data: {
                            miner: wax.userAccount,
                            nonce: nonce,
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                });
                console.log('result', result);
                setContractReturn(result.transaction_id);
                //setLabel(result.processed.action_traces[0].act.inline_traces[0].act.data.quantity);
                setLabel(result.processed.action_traces[0].inline_traces[0].act.data.quantity);

                let minutos = wax.userAccount ==='aumu.wam' ? 615 : 1230;

                setContagem(minutos);
                setSnakeDisabled(true);
            } catch (e) {
                setContractReturn('error: ' + e.message);
            }
        }
    }

    return (
        <>
            {userAccount &&
                <>
                    {userAccount &&
                        <div className="fichaClaim" onClick={onClick}>
                            <div className="image-cropper"><img src={aw} alt="AW" className="logoCoin"></img></div>
                            <div >
                                {snakeDisabled && <div className="displayTimer">
                                    {snakeDisplay}
                                </div>}
                                <div>
                                    {contractReturn.includes('error')
                                        ? <code id="responseAW">{contractReturn}</code>
                                        : <code id="responseAW"><a href={"https://wax.bloks.io/transaction/" + contractReturn.replace(/(['"])/g, "\\$1")}>Mined: {label}</a></code>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default AW;
