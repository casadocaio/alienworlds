import React, { useEffect, useRef, useState } from 'react';

import nova from '../assets/nova.jpg';

function Snake({ wax, userAccount, queryJson, setQueryJson }) {

    //const [queryJson, setQueryJson] = useState([{}]);
    const [lastActions, setLastActions] = useState([{}]);
    const [snakeDisabled, setSnakeDisabled] = useState(true);
    const [snakeDisplay, setSnakeDisplay] = useState("");
    const [contagem, setContagem] = useState(0);
    const [contractReturn, setContractReturn] = useState("");
    const [valorCorrida, setValorCorrida] = useState(2500);
    //const [auxMsg, setAuxMsg] = useState("");

    let osciladorSnake = useRef();


    function getDiffMinutes(d) {
        return Math.floor(((Date.now() - d) / 1000) / 60)
    }

    function schedule() {
        if (contagem > 0) {
            setContagem(contagem - 1);
            if (contagem - 1 === 0) {
                setSnakeDisabled(false);
            } if (contagem === 1) {
                setSnakeDisabled(false);
            }
            //osciladorSnake.current = setTimeout(schedule, 1000);
            setSnakeDisplay(new Date(contagem * 1000).toISOString().substr(11, 8).toString());
        } else {
            clearTimeout(osciladorSnake.current);
            setSnakeDisabled(false);
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

        if (queryJson && queryJson[0].act) {
            clearTimeout(osciladorSnake.current);
            tratado = queryJson.map(q => {
                let data_corrigida = new Date(new Date(q.timestamp).setHours(new Date(q.timestamp).getHours() - (new Date(q.timestamp).getTimezoneOffset() / 60)))

                return {
                    timestamp: q.timestamp,
                    time: data_corrigida,
                    symbol: q.act.data.symbol,
                    quantity: q.act.data.quantity
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
                        if (la.symbol === "SNAKOIL") {
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
                osciladorSnake.current = setTimeout(schedule, 1000);
            } else {
                //setSnakeDisabled(false);
                clearTimeout(osciladorSnake.current);
            }
        };
        vai();
    })

    /*botão para pegar as moedas*/
    async function onClick() {

        if (!snakeDisabled) {
            //console.log("queryJsonOnClick: ", queryJson);
            if (!wax.api) {
                return document.getElementById('responseSnake').append('* Login first *');
            }

            try {
                const result = await wax.api.transact({
                    actions: [{
                        account: 'novarallysnk',
                        name: 'claim',
                        authorization: [{
                            actor: wax.userAccount,
                            permission: 'active',
                        }],
                        data: {
                            username: wax.userAccount,
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                });

                console.log('result', result);

                setContractReturn(result.transaction_id);
                setContagem(3600);
            } catch (e) {
                setContractReturn('error: ' + e.message);
                setContagem(3600);
            }
        }
    }
    /*botão para chamar a corrida*/
    async function onClickRace(composicao) {

        
        //setAuxMsg(composicao);
        //if (!snakeDisabled) {
            //console.log("queryJsonOnClick: ", queryJson);
            if (!wax.api) {
                return document.getElementById('responseSnake').append('* Login first *');
            }

            const composicao1 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099545203649,
                driver1_asset_id: 1099545310325,
                driver2_asset_id: 1099545310103
            }

            const composicao2 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099583590996,
                driver1_asset_id: 1099545254485,
                driver2_asset_id: 1099576913791
            }

            const composicao3 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099570211902,
                driver1_asset_id: 1099581066293,
                driver2_asset_id: 1099545310435
            }

            const composicao4 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099545581467,
                driver1_asset_id: 1099545310108,
                driver2_asset_id: 1099545310111
            }

            const composicao5 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099545310320,
                driver1_asset_id: 1099545310116,
                driver2_asset_id: 1099545310109
            }

            const composicao6 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099568514316,
                driver1_asset_id: 1099545203051,
                driver2_asset_id: 1099545232373
            }

            const composicao7 = {
                    player: wax.userAccount,
                    vehicle_asset_id: 1099545334065,
                    driver1_asset_id: 1099554379749,
                    driver2_asset_id: 1099545310321
            }
    
            const composicao8 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099567816486,
                driver1_asset_id: 1099545204416,
                driver2_asset_id: 1099545235420
            }

            const composicao9 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099545245936,
                driver1_asset_id: 1099545241980,
                driver2_asset_id: 1099545310441
            }

            const composicao10 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099545199111,
                driver1_asset_id: 1099545234264,
                driver2_asset_id: 1099545293200
            }

            const composicao11 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099570495962,
                driver1_asset_id: 1099545310105,
                driver2_asset_id: 1099545310120
            }

            const composicao12 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099598174203,
                driver1_asset_id: 1099545310113,
                driver2_asset_id: 1099545210157
            }

            const composicao13 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099569070025,
                driver1_asset_id: 1099545246473,
                driver2_asset_id: 1099606055485
            }

            const composicao14 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099579968334,
                driver1_asset_id: 1099606037004,
                driver2_asset_id: 1099545293788
            }

            const composicao15 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099586531856,
                driver1_asset_id: 1099566379421,
                driver2_asset_id: 1099606011877
            }

            const composicao16 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099576007909,
                driver1_asset_id: 1099545179789,
                driver2_asset_id: 1099545340768
            }

            const composicao17 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099570049334,
                driver1_asset_id: 1099545334470,
                driver2_asset_id: 1099545229433
            }

            const composicao18 = {
                player: wax.userAccount,
                vehicle_asset_id: 1099568894184,
                driver1_asset_id: 1099545290589,
                driver2_asset_id: 1099545329996
            }




            let composicaoEscolhida = {};

            switch (composicao) {
                case 2:
                    composicaoEscolhida = composicao2;
                  break;
                case 3:
                    composicaoEscolhida = composicao3;
                  break;
                case 4:
                    composicaoEscolhida = composicao4;
                  break;
                  case 5:
                    composicaoEscolhida = composicao5;
                  break;
                  case 6:
                    composicaoEscolhida = composicao6;
                  break;
                  case 7:
                    composicaoEscolhida = composicao7;
                  break;
                  case 8:
                    composicaoEscolhida = composicao8;
                  break;
                  case 9:
                    composicaoEscolhida = composicao9;
                  break;
                  case 10:
                    composicaoEscolhida = composicao10;
                  break;
                  case 11:
                    composicaoEscolhida = composicao11;
                  break;
                  case 12:
                    composicaoEscolhida = composicao12;
                  break;
                  case 13:
                    composicaoEscolhida = composicao13;
                  break;
                  case 14:
                    composicaoEscolhida = composicao14;
                  break;
                  case 15:
                    composicaoEscolhida = composicao15;
                  break;
                  case 16:
                    composicaoEscolhida = composicao16;
                  break;
                  case 17:
                    composicaoEscolhida = composicao17;
                  break;
                  case 18:
                    composicaoEscolhida = composicao18;
                  break;
                default:
                    composicaoEscolhida = composicao1;
              }

            try {
                const result = await wax.api.transact({
                    actions: [{
                        account: 'novarallytok',
                        name: 'transfer',
                        authorization: [{
                            actor: wax.userAccount,
                            permission: 'active',
                        }],
                        data: {
                            from: wax.userAccount,
                            to: 'novarallyapp',
                            quantity: valorCorrida + ' SNAKOIL',
                            memo: ''
                        },
                    },{
                        account: 'novarallyapp',
                        name: 'join',
                        authorization: [{
                            actor: wax.userAccount,
                            permission: 'active',
                        }],
                        data: composicaoEscolhida,
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                });

                console.log('result', result);

                setContractReturn(result.transaction_id);

                if (valorCorrida > 2500){
                    setValorCorrida(~~(valorCorrida*1.2));
                }
                //setContagem(3600);
            } catch (e) {
                setContractReturn('error: ' + e.message);
                //setContagem(3600);
            }
        //}
    }

    function onAdd20Perc(){

        try {
            setValorCorrida(~~(valorCorrida*1.2));
       } catch(e) {
           console.log('error 20%: ' + e.message);
       }
    }

    return (
        <>
            {userAccount &&
                <>
                    {userAccount &&
                        <div className="fichaClaim" onClick={onClick}>
                            <div className="image-cropper"><img src={nova} alt="NovaRally" className="logoCoin"></img></div>
                            <div >
                                {snakeDisabled && <div className="displayTimer">
                                    {snakeDisplay}
                                </div>}
                                <div>
                                    {contractReturn.includes('error')
                                        ? <code id="responseSnake">{contractReturn}</code>
                                        : <code id="responseSnake"><a href={"https://wax.bloks.io/transaction/" + contractReturn.replace(/(['"])/g, "\\$1")}>View TX:{contractReturn.replace(/(['"])/g, "\\$1").substr(0,15).toString()} </a></code>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    {userAccount &&
                        <div className="fichaClaim">
                            Valor da corrida: <input type="text" name="name" value={valorCorrida} onChange={e => setValorCorrida(e.target.value)}/>
                            <button className="btnAtualizar" onClick={onAdd20Perc} >
                                    +20%
                                </button>
                        </div>
                    }
                    {userAccount &&
                        <div className="fichaClaim" onClick={() => onClickRace(1)}>
                            <div className="image-cropper"><img src={nova} alt="NovaRally" className="logoCoin"></img></div>
                            <div >
                                Correr OCD Beanpole
                            </div>
                        </div>
                    }
                    {userAccount &&
                        <div className="fichaClaim" onClick={() => onClickRace(2)}>
                            <div className="image-cropper"><img src={nova} alt="NovaRally" className="logoCoin"></img></div>
                            <div >
                                Correr Raag Man Sammy Snek
                            </div>
                        </div>
                    }
                    {userAccount &&
                        <div className="fichaClaim" onClick={() => onClickRace(3)}>
                            <div className="image-cropper"><img src={nova} alt="NovaRally" className="logoCoin"></img></div>
                            <div >
                                Correr Serpent Dilly Dally
                            </div>
                        </div>
                    }
                    {userAccount &&
                        <div className="fichaClaim" onClick={() => onClickRace(4)}>
                            <div className="image-cropper"><img src={nova} alt="NovaRally" className="logoCoin"></img></div>
                            <div >
                                Correr Dilly Dally
                            </div>
                        </div>
                    }
                    {userAccount &&
                        <div className="fichaClaim" onClick={() => onClickRace(5)}>
                            <div className="image-cropper"><img src={nova} alt="NovaRally" className="logoCoin"></img></div>
                            <div >
                                Correr Scape Vorder
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default Snake;
