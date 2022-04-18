import * as functions from 'firebase-functions';
import cors from 'cors';
import express from 'express';
import {functionsConfig} from './functions-config';
import {analysisFunction} from "./analysis.function";

// CORS configuration.
const options: cors.CorsOptions = {
    origin: functionsConfig.whitelist
};

const app = express()
app.use(cors(options))

/**
 * Trigger a function with an HTTP request.
 */
export const httpFunction = functions.https.onRequest((request: functions.Request, response: functions.Response) => {
    cors(options)(request, response, () => analysisFunction(request, response));
});

// Add here other functions.
app.get("/info", async (req, res) => {
    res.send(`${JSON.stringify({
        time: Math.floor(Date.now() / 1000)
    })}`)
})

export const api = functions.https.onRequest(app)
