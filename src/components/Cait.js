import React, { useEffect, useRef, useState } from 'react';

import cait from '../assets/cait.png';

function Cait({ wax, userAccount, queryJson, setQueryJson }) {

    //const [queryJson, setQueryJson] = useState([{}]);
    const [lastActions, setLastActions] = useState([{}]);
    const [snakeDisabled, setSnakeDisabled] = useState(true);
    const [snakeDisplay, setSnakeDisplay] = useState("");
    const [contagem, setContagem] = useState(0);
    const [contractReturn, setContractReturn] = useState("");

    let osciladorCait = useRef();


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
            clearTimeout(osciladorCait.current);
        }
    }

    /*useEffect(() => {

        if(userAccount){
            fetch('https://api.waxsweden.org/v2/history/get_actions?limit=100&skip=0&account='+userAccount+'&sort=desc')
            .then(response => response.json())
            .then(data => setQueryJson(data.actions));
        }

    }, [userAccount]);*/

    useEffect(() => {
        let tratado = [];

        if (queryJson && queryJson[0] && queryJson[0].act) {
            clearTimeout(osciladorCait.current);
            tratado = queryJson.map(q => {
                let data_corrigida = new Date(new Date(q.timestamp).setHours(new Date(q.timestamp).getHours() - (new Date(q.timestamp).getTimezoneOffset() / 60)))

                return {
                    timestamp: q.timestamp,
                    time: data_corrigida,
                    symbol: q.act.data.symbol,
                    quantity: q.act.data.quantity,
                    memo: q.act.data.memo,
                }
            });
        }

        setLastActions(tratado);

    }, [queryJson]);

    useEffect(() => {
        let lastSnake = [];

        if (lastActions) {
            if (lastActions[0]) {
                if (lastActions[0].symbol) {
                    lastActions.forEach(la => {
                        if (la.symbol === "CAIT" && !la.memo.includes("REWARDS")) {
                            lastSnake.push({
                                symbol: la.symbol,
                                hora: la.time.getHours(),
                                min: la.time.getMinutes(),
                                diff: getDiffMinutes(la.time),
                            })
                        }
                    })
                }
            }
        }

        if (lastSnake) {
            if (lastSnake[0]) {
                if (lastSnake[0].diff > 60) {
                    setSnakeDisabled(false);
                    setContagem(0);
                } else {
                    setSnakeDisabled(true);
                    setContagem((60 - lastSnake[0].diff) * 60);
                }
            }
        }

        //console.log('lastSnake', lastSnake);

    }, [lastActions]);

    useEffect(() => {

        const vai = () => {
            if (contagem <= 1) {
                setSnakeDisabled(false);
            }

            if (contagem > 0) {
                setSnakeDisabled(true);
                osciladorCait.current = setTimeout(schedule, 1000);
            } else {
                //setSnakeDisabled(false);
                clearTimeout(osciladorCait.current);
            }
        };
        vai();
    })

    /*botão para pegar as moedas*/
    async function onClick() {

        if (!snakeDisabled) {
            //console.log("queryJsonOnClick: ", queryJson);
            if (!wax.api) {
                return document.getElementById('responseCait').append('* Login first *');
            }

            try {
                const result = await wax.api.transact({
                    actions: [{
                        account: 'faucet.gm',
                        name: 'claim',
                        authorization: [{
                            actor: wax.userAccount,
                            permission: 'active',
                        }],
                        data: {
                            user: wax.userAccount,
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                });

                setContractReturn(result.transaction_id);
                setContagem(3600);
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
                            <div className="image-cropper"><img src={cait} alt="CAIT" className="logoCoin"></img></div>
                            <div >
                                {snakeDisabled && <div className="displayTimer">
                                    {snakeDisplay}
                                </div>}
                                <div>
                                    {contractReturn.includes('error')
                                        ? <code id="responseCait">{contractReturn}</code>
                                        : <code id="responseCait"><a href={"https://wax.bloks.io/transaction/" + contractReturn.replace(/(['"])/g, "\\$1")}>View on Bloks</a></code>
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

export default Cait;
