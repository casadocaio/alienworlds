import React, { useEffect, useState } from 'react';

function Snake({wax, userAccount}) {

    const [queryJson, setQueryJson] = useState([{}]);

    useEffect(() => {
        //if(userAccount){
            async function fetchData(user) {
                let response = await fetch('https://api.waxsweden.org/v2/history/get_actions?limit=100&skip=0&account='+user+'&sort=desc');
                let jsonRes = await response.json().actions;
                return jsonRes;
            }
            let mandar = fetchData(userAccount);
            setQueryJson(mandar);
        //}

        /*let response = await fetch('https://api.waxsweden.org/v2/history/get_actions?limit=100&skip=0&account='+userAccount+'&sort=desc');

        setQueryJson(await response.json().actions);*/


    }, [userAccount]);

    useEffect(() => {
        if(queryJson.act){
            console.log("queryJson:", queryJson);

            let tratado = [''];

            queryJson.forEach(q => {
                if(q.act.account === 'novarallytok'){
                    tratado.push({
                        'timestamp': q.timestamp,
                        'symbol': q.act.data.symbol,
                        'quantity': q.act.data.quantity,
                    })
                }
            });

            console.log('tratado', tratado);
        }
    }, [queryJson]);

    /*botão para pegar as moedas*/
    async function onClick(){

        console.log("queryJsonOnClick: ", queryJson);
        if(!wax.api) {
            return document.getElementById('response').append('* Login first *');
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
            document.getElementById('response').innerHTML = JSON.stringify(result, null, 2).id;
        } catch(e) {
            document.getElementById('response').innerHTML = e.message;
        }
    }

    return (
        <div  >
            {userAccount && 
                <>
                    {userAccount && 
                    <div>
                        <p>Claim your SNAKOIL: </p>
                        <button className="btnlogin" onClick={onClick}>
                                Ready to claim
                            </button>
                            <br />
                        <div>
                            <code id="response"></code>
                        </div>
                    </div>
                    }
                </>
            }
        </div>
    );
}

export default Snake;
