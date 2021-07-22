import React, { useEffect, useRef, useState } from 'react';

function Cait({wax, userAccount}) {

    const [queryJson, setQueryJson] = useState([{}]);
    const [lastActions, setLastActions] = useState([{}]);
    const [snakeDisnabled, setSnakeDisabled] = useState(true);
    const [snakeDisplay, setSnakeDisplay] = useState("");
    const [contagem, setContagem] = useState(0);

    let oscilador = useRef();


    function getDiffMinutes(d){
        return Math.floor(((Date.now() - d)/1000)/60)
    }

    function schedule(){
        //console.log('contagem', contagem);

        if(contagem > 0){
            setContagem(contagem - 1);
            //oscilador.current = setTimeout(schedule, 1000);
            setSnakeDisplay("Next attempt: " + new Date(contagem * 1000).toISOString().substr(11, 8).toString());
        } else {
            clearTimeout(oscilador.current);
        }
    }

    useEffect(() => {

        if(userAccount){
            fetch('https://api.waxsweden.org/v2/history/get_actions?limit=100&skip=0&account='+userAccount+'&sort=desc')
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
                    quantity: q.act.data.quantity
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
                        if(la.symbol === "CAIT"){
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

        if(lastSnake[0]){
            if(lastSnake[0].diff > 60){
                setSnakeDisabled(false);
                setContagem(0);
            } else {
                setSnakeDisabled(true);
                setContagem((60 - lastSnake[0].diff) * 60);
            }
        }

        //console.log('lastSnake', lastSnake);

    }, [lastActions]);

    useEffect(()=>{
        if(contagem > 0){
            oscilador.current = setTimeout(schedule, 1000);
        } else {
            clearTimeout(oscilador.current);
        }
    }, [contagem, schedule])

    /*botão para pegar as moedas*/
    async function onClick(){

        console.log("queryJsonOnClick: ", queryJson);
        if(!wax.api) {
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

            //console.log('retorno', JSON.stringify(result, null, 2));
            document.getElementById('responseCait').innerHTML = JSON.stringify(result, null, 2).transaction_id;
            setContagem(3600);
        } catch(e) {
            document.getElementById('responseCait').innerHTML = e.message;
        }
    }

    return (
        <div  >
            {userAccount && 
                <>
                    {userAccount && 
                    <div>
                        <p>Claim your CAIT: </p>
                        <button className="btnlogin" onClick={onClick} disabled={snakeDisnabled}>
                                Ready to claim
                        </button>
                        <br />
                        {snakeDisnabled && <div>
                            {snakeDisplay}
                        </div>}
                        <div>
                            <code id="responseCait"></code>
                        </div>
                    </div>
                    }
                </>
            }
        </div>
    );
}

export default Cait;
