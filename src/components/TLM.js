import React, { useEffect, useState } from 'react';

function TLM({ userAccount, queryJson, setQueryJson }) {

    //const [queryJson, setQueryJson] = useState([{}]);
    const [lastActions, setLastActions] = useState([{}]);
    const [lstMedia, setLstMedia] = useState([{}]);
    const [rows, setRows] = useState([]);
    const [rowsCAIT, setRowsCAIT] = useState([]);
    const [queryJsonCAIT, setQueryJsonCAIT] = useState([]);
    const [lastActionsCAIT, setLastActionsCAIT] = useState([{}]);
    const [lstMediaCAIT, setLstMediaCAIT] = useState([{}]);

    const [rowsDICE, setRowsDICE] = useState([]);
    const [queryJsonDICE, setQueryJsonDICE] = useState([]);
    const [lastActionsDICE, setLastActionsDICE] = useState([{}]);
    const [lstMediaDICE, setLstMediaDICE] = useState([{}]);

    function getDiffMinutes(d) {
        return Math.floor(((Date.now() - d) / 1000) / 60)
    }

    /*
    useEffect(() => {

        if (userAccount) {
            fetch('https://api.waxsweden.org/v2/history/get_actions?limit=1000&skip=0&account=' + userAccount + '&sort=desc')
                .then(response => response.json())
                .then(data => setQueryJson(data.actions));
        }

    }, [userAccount]);

    */

    useEffect(() => {
        let tratado = [];

        //console.log('veio montar tratado');

        if (queryJson && queryJson[0].act) {
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
        let tratado = [];

        //console.log('veio montar tratado');

        if (queryJsonCAIT && queryJsonCAIT[0] && queryJsonCAIT[0].act) {
            tratado = queryJsonCAIT.map(q => {
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

        setLastActionsCAIT(tratado);

    }, [queryJsonCAIT]);

    useEffect(() => {
        let tratado = [];

        //console.log('veio montar tratado');

        if (queryJsonDICE && queryJsonDICE[0] && queryJsonDICE[0].act) {
            tratado = queryJsonDICE.map(q => {
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
        //console.log('veio montar tratado', tratado);
        setLastActionsDICE(tratado);

    }, [queryJsonDICE]);

    useEffect(() => {
        let lastSnake = [];

        if (lastActions) {
            if (lastActions[0]) {
                if (lastActions[0].symbol) {
                    lastActions.forEach(la => {
                        if (la.symbol === "TLM" && la.memo.includes("Mined Trilium")) {
                            lastSnake.push({
                                symbol: la.symbol,
                                quantity: la.quantity.replace(' TLM', ''),
                                time: la.time,
                                day: la.time.getDate(),
                                hora: la.time.getHours(),
                                min: la.time.getMinutes(),
                                diff: getDiffMinutes(la.time),
                                completo: la,
                            })
                        }
                    })
                }
            }
        }

        if (lastSnake[0]) {
            //console.log('ver lastSnake', lastSnake);

            let dias = [];
            let consolidado = [];

            lastSnake.forEach(ls => {
                if (!dias.includes(ls.day)) {
                    dias.push(ls.day);
                }
            });

            //console.log('ver dias', dias);

            dias.forEach(d => {
                let filtrado = dadosDia(lastSnake, d);

                let qtd = 0.0;
                let sum = 0.0;
                let min = 2.0;
                let max = 0.0;
                let avg = 0.0;

                filtrado.forEach(f => {
                    qtd += 1;
                    sum = sum + parseFloat(f.quantity);
                    min = min > parseFloat(f.quantity) ? parseFloat(f.quantity) : min;
                    max = max < parseFloat(f.quantity) ? parseFloat(f.quantity) : max;
                    avg = sum / qtd;
                });

                consolidado[dias.indexOf(d)] = { day: d, qtd: qtd, sum: sum, min: min, max: max, avg: avg }
            });

            //console.log('ver consolidado', consolidado);

            setLstMedia(consolidado)

        }

        //console.log('lastSnake', lastSnake);

    }, [lastActions]);


    useEffect(() => {
        let lastSnake = [];

        if (lastActionsCAIT) {
            if (lastActionsCAIT[0]) {
                if (lastActionsCAIT[0].symbol) {
                    lastActionsCAIT.forEach(la => {
                        if (la.symbol === "CAIT" && la.memo.includes("LP REWARDS")) {
                            lastSnake.push({
                                symbol: la.symbol,
                                quantity: la.quantity.replace(' CAIT', ''),
                                time: la.time,
                                day: la.time.getDate(),
                                hora: la.time.getHours(),
                                min: la.time.getMinutes(),
                                diff: getDiffMinutes(la.time),
                                completo: la,
                            })
                        }
                    })
                }
            }
        }

        if (lastSnake[0]) {
            //console.log('ver lastSnake', lastSnake);

            let dias = [];
            let consolidado = [];

            lastSnake.forEach(ls => {
                if (!dias.includes(ls.day)) {
                    dias.push(ls.day);
                }
            });

            //console.log('ver dias', dias);

            dias.forEach(d => {
                let filtrado = dadosDia(lastSnake, d);

                let qtd = 0.0;
                let sum = 0.0;
                let min = 2.0;
                let max = 0.0;
                let avg = 0.0;

                filtrado.forEach(f => {
                    qtd += 1;
                    sum = sum + parseFloat(f.quantity);
                    min = min > parseFloat(f.quantity) ? parseFloat(f.quantity) : min;
                    max = max < parseFloat(f.quantity) ? parseFloat(f.quantity) : max;
                    avg = sum / qtd;
                });

                consolidado[dias.indexOf(d)] = { day: d, qtd: qtd, sum: sum, min: min, max: max, avg: avg }
            });

            //console.log('ver consolidado', consolidado);

            setLstMediaCAIT(consolidado)

        }

        //console.log('lastSnake', lastSnake);

    }, [lastActionsCAIT]);

    useEffect(() => {
        let lastSnake = [];

        if (lastActionsDICE) {
            if (lastActionsDICE[0]) {
                if (lastActionsDICE[0].symbol) {
                    lastActionsDICE.forEach(la => {
                        if (la.symbol === "DUST" && la.memo.includes("DU$T Dice")) {
                            lastSnake.push({
                                symbol: la.symbol,
                                quantity: la.quantity.replace(' DUST', ''),
                                time: la.time,
                                day: la.time.getDate(),
                                hora: la.time.getHours(),
                                min: la.time.getMinutes(),
                                diff: getDiffMinutes(la.time),
                                completo: la,
                            })
                        }
                    })
                }
            }
        }

        if (lastSnake[0]) {
            //console.log('ver lastSnake', lastSnake);

            let dias = [];
            let consolidado = [];

            lastSnake.forEach(ls => {
                if (!dias.includes(ls.day)) {
                    dias.push(ls.day);
                }
            });

            //console.log('ver dias', dias);

            dias.forEach(d => {
                let filtrado = dadosDia(lastSnake, d);

                let qtd = 0.0;
                let sum = 0.0;
                let min = 2.0;
                let max = 0.0;
                let avg = 0.0;

                filtrado.forEach(f => {
                    qtd += 1;
                    sum = sum + parseFloat(f.quantity);
                    min = min > parseFloat(f.quantity) ? parseFloat(f.quantity) : min;
                    max = max < parseFloat(f.quantity) ? parseFloat(f.quantity) : max;
                    avg = sum / qtd;
                });

                consolidado[dias.indexOf(d)] = { day: d, qtd: qtd, sum: sum, min: min, max: max, avg: avg }
            });

            //console.log('ver consolidado', consolidado);

            setLstMediaDICE(consolidado)

        }

        //console.log('lastSnake', lastSnake);

    }, [lastActionsDICE]);

    function dadosDia(dados, dia) {
        return dados.filter(dd => {
            if (dd.day === dia) {
                return dd;
            }
            return false
        });
    }

    useEffect(() => {

        let tmprows = [];

        let cabecalho = []
        cabecalho.push(<th key={`cell${0}-${1}`} id={`cell${0}-${1}`}>Dia</th>)
        cabecalho.push(<th key={`cell${0}-${2}`} id={`cell${0}-${2}`}>Cliques</th>)
        cabecalho.push(<th key={`cell${0}-${3}`} id={`cell${0}-${3}`}>Total</th>)
        cabecalho.push(<th key={`cell${0}-${4}`} id={`cell${0}-${4}`}>Média</th>)
        cabecalho.push(<th key={`cell${0}-${5}`} id={`cell${0}-${5}`}>Max</th>)
        cabecalho.push(<th key={`cell${0}-${6}`} id={`cell${0}-${6}`}>Min</th>)
        tmprows.push(<tr key={0} id={`row${0}`} className='cabecalho'>{cabecalho}</tr>)

        //console.log('lstMedia', lstMedia);

        if (lstMedia && lstMedia.length > 1) {
            for (var i = 0; i < lstMedia.length; i++) {
                let rowID = `row${i + 1}`
                let cell = []
                cell.push(<td key={`cell${i + 1}-${1}`} id={`cell${i + 1}-${1}`}>{lstMedia[i].day}</td>)
                cell.push(<td key={`cell${i + 1}-${2}`} id={`cell${i + 1}-${2}`}>{lstMedia[i].qtd}</td>)
                cell.push(<td key={`cell${i + 1}-${3}`} id={`cell${i + 1}-${3}`}>{Math.round(lstMedia[i].sum * 100) / 100}</td>)
                cell.push(<td key={`cell${i + 1}-${4}`} id={`cell${i + 1}-${4}`}>{Math.round(lstMedia[i].avg * 100) / 100}</td>)
                cell.push(<td key={`cell${i + 1}-${5}`} id={`cell${i + 1}-${5}`}>{lstMedia[i].max}</td>)
                cell.push(<td key={`cell${i + 1}-${6}`} id={`cell${i + 1}-${6}`}>{lstMedia[i].min}</td>)
                tmprows.push(<tr key={i + 1} id={rowID}>{cell}</tr>)
            }
        }

        setRows(tmprows);

    }, [lstMedia]);

    useEffect(() => {

        let tmprows = [];

        let cabecalho = []
        cabecalho.push(<th key={`cell${0}-${1}`} id={`cell${0}-${1}`}>Dia</th>)
        cabecalho.push(<th key={`cell${0}-${2}`} id={`cell${0}-${2}`}>Payouts</th>)
        cabecalho.push(<th key={`cell${0}-${3}`} id={`cell${0}-${3}`}>Total</th>)
        cabecalho.push(<th key={`cell${0}-${4}`} id={`cell${0}-${4}`}>Média</th>)
        cabecalho.push(<th key={`cell${0}-${5}`} id={`cell${0}-${5}`}>Max</th>)
        cabecalho.push(<th key={`cell${0}-${6}`} id={`cell${0}-${6}`}>Min</th>)
        tmprows.push(<tr key={0} id={`row${0}`} className='cabecalho'>{cabecalho}</tr>)

        //console.log('lstMediaCAIT', lstMediaCAIT);

        if (lstMediaCAIT && lstMediaCAIT.length > 0) {
            for (var i = 0; i < lstMediaCAIT.length; i++) {
                let rowID = `row${i + 1}`
                let cell = []
                cell.push(<td key={`cell${i + 1}-${1}`} id={`cell${i + 1}-${1}`}>{lstMediaCAIT[i].day}</td>)
                cell.push(<td key={`cell${i + 1}-${2}`} id={`cell${i + 1}-${2}`}>{lstMediaCAIT[i].qtd}</td>)
                cell.push(<td key={`cell${i + 1}-${3}`} id={`cell${i + 1}-${3}`}>{Math.round(lstMediaCAIT[i].sum * 100) / 100}</td>)
                cell.push(<td key={`cell${i + 1}-${4}`} id={`cell${i + 1}-${4}`}>{Math.round(lstMediaCAIT[i].avg * 100) / 100}</td>)
                cell.push(<td key={`cell${i + 1}-${5}`} id={`cell${i + 1}-${5}`}>{lstMediaCAIT[i].max}</td>)
                cell.push(<td key={`cell${i + 1}-${6}`} id={`cell${i + 1}-${6}`}>{lstMediaCAIT[i].min}</td>)
                tmprows.push(<tr key={i + 1} id={rowID}>{cell}</tr>)
            }
        }

        setRowsCAIT(tmprows);

    }, [lstMediaCAIT]);

    useEffect(() => {

        let tmprows = [];

        let cabecalho = []
        cabecalho.push(<th key={`cell${0}-${1}`} id={`cell${0}-${1}`}>Dia</th>)
        cabecalho.push(<th key={`cell${0}-${2}`} id={`cell${0}-${2}`}>Payouts</th>)
        cabecalho.push(<th key={`cell${0}-${3}`} id={`cell${0}-${3}`}>Total</th>)
        cabecalho.push(<th key={`cell${0}-${4}`} id={`cell${0}-${4}`}>Média</th>)
        cabecalho.push(<th key={`cell${0}-${5}`} id={`cell${0}-${5}`}>Max</th>)
        cabecalho.push(<th key={`cell${0}-${6}`} id={`cell${0}-${6}`}>Min</th>)
        tmprows.push(<tr key={0} id={`row${0}`} className='cabecalho'>{cabecalho}</tr>)

        //console.log('lstMediaDICE', lstMediaDICE);

        if (lstMediaDICE && lstMediaDICE.length > 0) {
            for (var i = 0; i < lstMediaDICE.length; i++) {
                let rowID = `row${i + 1}`
                let cell = []
                cell.push(<td key={`cell${i + 1}-${1}`} id={`cell${i + 1}-${1}`}>{lstMediaDICE[i].day}</td>)
                cell.push(<td key={`cell${i + 1}-${2}`} id={`cell${i + 1}-${2}`}>{lstMediaDICE[i].qtd}</td>)
                cell.push(<td key={`cell${i + 1}-${3}`} id={`cell${i + 1}-${3}`}>{Math.round(lstMediaDICE[i].sum * 100) / 100}</td>)
                cell.push(<td key={`cell${i + 1}-${4}`} id={`cell${i + 1}-${4}`}>{Math.round(lstMediaDICE[i].avg * 100) / 100}</td>)
                cell.push(<td key={`cell${i + 1}-${5}`} id={`cell${i + 1}-${5}`}>{lstMediaDICE[i].max}</td>)
                cell.push(<td key={`cell${i + 1}-${6}`} id={`cell${i + 1}-${6}`}>{lstMediaDICE[i].min}</td>)
                tmprows.push(<tr key={i + 1} id={rowID}>{cell}</tr>)
            }
        }

        setRowsDICE(tmprows);

    }, [lstMediaDICE]);

    function onClick(){

         try {
            if (userAccount) {
                let qtd = 1000;

                fetch('https://api.waxsweden.org/v2/history/get_actions?limit=' + qtd + '&skip=0&account=' + userAccount + '&sort=desc'
                /*, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                  }*/)
                    .then(response => response.json())
                    .then(data => setQueryJson(data.actions));
            }
        } catch(e) {
            console.log('error: ' + e.message);
        }
    }

    function onClickTLM(){

        try {
           if (userAccount) {
               let qtd =250;

               fetch('https://api.waxsweden.org/v2/history/get_actions?limit=' + qtd + '&filter=alien.worlds%3A*&skip=0&account=' + userAccount + '&sort=desc'
               /*, {
                   method: 'GET', // *GET, POST, PUT, DELETE, etc.
                   referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                 }*/)
                   .then(response => response.json())
                   .then(data => setQueryJson(data.actions));
           }
       } catch(e) {
           console.log('error: ' + e.message);
       }
   }

function onClickCAIT(){

    try {
       if (userAccount) {
           let qtd =40;

           fetch('https://api.waxsweden.org/v2/history/get_actions?limit=' + qtd + '&filter=tokencrafter%3A*&skip=0&account=' + userAccount + '&sort=desc'
           /*, {
               method: 'GET', // *GET, POST, PUT, DELETE, etc.
               referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
             }*/)
               .then(response => response.json())
               .then(data => {
                   setQueryJsonCAIT(data.actions)
                   //console.log('data.actions', data.actions)
               });
       }
   } catch(e) {
       console.log('error: ' + e.message);
   }
}

function onClickDICE(){

    try {
       if (userAccount) {
           let qtd =1000;

           fetch('https://api.waxsweden.org/v2/history/get_actions?limit=' + qtd + '&filter=niftywizards%3A*&skip=0&account=' + userAccount + '&sort=desc'
           /*, {
               method: 'GET', // *GET, POST, PUT, DELETE, etc.
               referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
             }*/)
               .then(response => response.json())
               .then(data => {
                   setQueryJsonDICE(data.actions)
                   //console.log('dice data.actions', data.actions)
               });
       }
   } catch(e) {
       console.log('error: ' + e.message);
   }
}

    return (
        <div  >
            {userAccount &&
                <>
                    {userAccount &&
                        <div>
                            <p>Alien Worlds stats: </p>
                            <p>
                                <button className="btnAtualizar" onClick={onClick} >
                                    Atualizar
                                </button>
                                <button className="btnAtualizar" onClick={onClickTLM} >
                                    Atualizar TLM
                                </button>
                                <button className="btnAtualizar" onClick={onClickCAIT} >
                                    CAIT
                                </button>
                                <button className="btnAtualizar" onClick={onClickDICE} >
                                    DU$T DICE
                                </button>
                            </p>
                            <table id="simple-board">
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                            <p>
                            <table id="simple-boardCait">
                                <tbody>
                                    {rowsCAIT}
                                </tbody>
                            </table>
                            </p>
                            <p>
                            <table id="simple-boardDice">
                                <tbody>
                                    {rowsDICE}
                                </tbody>
                            </table>
                            </p>
                        </div>
                    }
                </>
            }
        </div>
    );
}

export default TLM;
