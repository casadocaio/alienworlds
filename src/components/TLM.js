import React, { useEffect, useState } from 'react';

function TLM({ userAccount, queryJson, setQueryJson }) {

    //const [queryJson, setQueryJson] = useState([{}]);
    const [lastActions, setLastActions] = useState([{}]);
    const [lstMedia, setLstMedia] = useState([{}]);
    const [rows, setRows] = useState([]);

    const [filtroMoeda, setFiltroMoeda] = useState('alien.worlds');
    const [symbol, setSymbol] = useState('TLM');
    const [includes, setIncludes] = useState('Mined Trilium');

    

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
        if (filtroMoeda) {
            switch (filtroMoeda) {
                case 'tokencrafter':
                    setSymbol('CAIT');
                  break;
                case 'niftywizards':
                    setSymbol('DUST');
                  break;
                case 'stoned':
                    setSymbol('DUST');
                  break;
                case 'token.nefty':
                    setSymbol('NEFTY');
                  break;
                case 't.taco':
                case 't.tacoR':
                    setSymbol('SHING');
                  break;
                case 'token.grF':
                    setSymbol('FLORIA');
                  break;
                case 'token.grS':
                    setSymbol('SAP');
                  break;
                case 'token.grV':
                    setSymbol('VERSAT');
                  break;
                case 'token.grN':
                    setSymbol('NANORE');
                  break;
                default:
                  setSymbol('TLM');
              }
        }
        if (filtroMoeda) {
            switch (filtroMoeda) {
                case 'tokencrafter':
                    setIncludes('LP REWARDS');
                  break;
                case 'niftywizards':
                    setIncludes('Dice');
                  break;
                case 'stoned':
                    setIncludes('Stoned Warlords');
                  break;
                case 'token.nefty':
                    setIncludes('Claim');
                  break;
                case 't.tacoR':
                    setIncludes('referral claim');
                  break;
                case 't.taco':
                    setIncludes('reward claim');
                  break;
                case 'token.grF':
                case 'token.grS':
                case 'token.grV':
                case 'token.grN':
                    setIncludes('');
                  break;
                default:
                    setIncludes('Mined Trilium');
              }
        }
    }, [filtroMoeda]);

    useEffect(() => {
        let tratado = [];

        //console.log('veio montar tratado');
        console.log('vqueryJson', queryJson);

        if (queryJson && queryJson[0] && queryJson[0].act) {
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
                        if (la.symbol === symbol && la.memo.includes(includes) && !la.memo.includes('WAX@') ) {
                            lastSnake.push({
                                symbol: la.symbol,
                                quantity: la.quantity.replace(' ' + symbol, ''),
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

    }, [includes, lastActions, symbol]);

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

    function onClick(){

         try {
            setQueryJson([{}]);

            if (userAccount) {
                let qtd = 1000;

                let filtrotratado = '';

                switch (filtroMoeda) {
                    case 't.tacoR':
                        filtrotratado = 't.taco';
                      break;
                    case 'stoned':
                        filtrotratado = 'niftywizards';
                      break;
                    case 'token.grF':
                    case 'token.grS':
                    case 'token.grV':
                    case 'token.grN':
                        filtrotratado = 'token.gr';
                      break;
                    default:
                        filtrotratado = filtroMoeda;
                  }

                fetch('https://api.waxsweden.org/v2/history/get_actions?limit=' + qtd + '&filter=' + filtrotratado + '%3A*&skip=0&account=' + userAccount + '&sort=desc'
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

    return (
        <div  >
            {userAccount &&
                <>
                    {userAccount &&
                        <div>
                            <p>Escolha a moeda para consulta: </p>
                            <p>
                                <select 
                                    id="moedas" 
                                    name="moedas"
                                    value={filtroMoeda}
                                    onChange={e => {
                                            setLstMedia([]);
                                            setFiltroMoeda(e.target.value);
                                        }
                                    }>
                                    <option value="tokencrafter">CAIT</option>
                                    <option value="niftywizards">DUST</option>
                                    <option value="stoned">DUST SWL</option>
                                    <option value="token.nefty">Nefty</option>
                                    <option value="t.taco">Shing</option>
                                    <option value="t.tacoR">Shing refer</option>
                                    <option value="alien.worlds">TLM</option>
                                    <option value="token.grF">Floria</option>
                                    <option value="token.grS">Sap</option>
                                    <option value="token.grV">Versat</option>
                                    <option value="token.grN">Nanore</option>
                                </select>
                                <button className="btnAtualizar" onClick={onClick} >
                                    Tacalepau marcos!
                                </button>
                            </p>
                            <table id="simple-board">
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                    }
                </>
            }
        </div>
    );
}

export default TLM;
