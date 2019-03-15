const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const _ = require('lodash');


const PORT = 3001;
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.server = http.createServer(app);

app.get('/api', (req, res)=>{


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


//start server
app.server.listen(PORT,()=>{
    console.log(`Server is running on: http:localhost:${PORT}`);

})