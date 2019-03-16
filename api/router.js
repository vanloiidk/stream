const _ = require('lodash');

exports.routers = (app) => {


    /**
     * @method GET
     * @endpoint /
     * @description Root api
     *
     */

    app.get('/', (req, res)=>{


        return res.json({version:'1.0'});

    });

    /**
     * @method POST
     * @endpoint /api/on-live-auth
     * @description authentication for live stream user
     *
     */

    app.post('/api/on-live-auth', (req, res, next)=>{
        const streamInfo = req.body;
        const streamSecretKey = _.get(streamInfo, 'name');
        //we can check streaming_key to verify it in backend
        console.log(`user begin streaming and we are verifying ${streamSecretKey}`);
        // after verifing secret streaming key and we allow usr stream their video. return http status to 200.
        return res.status(200).json({
            verified: true,

        });
        return res.status(401).json({access: false});

    });

    /**
     * @method POST
     * @endpoint /api/on-live-done
     * @description Event after user finishing streaming
     *
     */

    app.post('/api/on-live-done', (req, res, next)=>{

        const streamingKey = _.get(req, 'body.name');
        console.log(`User finished streaming Camera: ${streamingKey}`);


        //return http code anything does not effect to our live server

        return res.json({
            done: true
        });

    });

    /**
     * @method POST
     * @endpoint /api/camera/:id/stream
     * @description Send command to server with camera ID and stream or stop stream
     *
     */
    app.post('/api/camera/:id/stream', (req, res, next) =>{

        const body =req.body;
        console.log("Got body command", body);

        const payload = _.get(body, 'stream', false);
        //after receiving action from user owner of camera we need to send to RaspberryPi with stream or not stream.

        const connections = app.connections.getClients();
        //loop every raspberry pi socket and send this command to Pi
        connections.forEach((con)=>{

            const ws = con.ws;
            if(ws){
                const message ={
                    action: "stream",
                    payload: payload
                }
                ws.send(JSON.stringify(message));
            }

        });



        return res.status(200).json({
            received: true

        });


    });


};