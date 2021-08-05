import React, { useEffect, useState } from 'react';

function TLM({userAccount}) {

    const [queryJson, setQueryJson] = useState([{}]);
    const [lastActions, setLastActions] = useState([{}]);
    const [lstMedia, setLstMedia] = useState([{}]);

    function getDiffMinutes(d){
        return Math.floor(((Date.now() - d)/1000)/60)
    }

    useEffect(() => {

        if(userAccount){
            fetch('https://api.waxsweden.org/v2/history/get_actions?limit=1000&skip=0&account='+userAccount+'&sort=desc'
            /*, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              }*/)
            .then(response => response.json())
            .then(data => setQueryJson(data.actions));
        }

    }, [userAccount]);

    useEffect(() => {
        let tratado = [];

        if(queryJson[0].act){
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
        let lastSnake =[];

        if(lastActions){
            if(lastActions[0]){
                if(lastActions[0].symbol){
                    lastActions.forEach(la => {
                        if(la.symbol === "TLM" && la.memo.includes("Mined Trilium")){
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

        if(lastSnake[0]){
            console.log('ver lastSnake', lastSnake);

            let dias = [];
            let consolidado = [];

            lastSnake.forEach(ls => {
                if(!dias.includes(ls.day)){
                    dias.push(ls.day);
                }
            });

            console.log('ver dias', dias);

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

            console.log('ver consolidado', consolidado);

            setLstMedia(consolidado)

        }

        //console.log('lastSnake', lastSnake);

    }, [lastActions]);

    function dadosDia(dados, dia){
        return dados.filter(dd => {
            if(dd.day === dia){
                return dd;
            }
            return false
        });
    }

    return (
        <div  >
            {userAccount && 
                <>
                    {userAccount && 
                    <div>
                        <p>{lstMedia.toString()}</p>
                    </div>
                    }
                </>
            }
        </div>
    );
}

export default TLM;
