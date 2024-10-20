/**
 * @file urlController.ts
 * 
 */

import { Request, Response } from 'express';
import { URL } from 'url';
import URLServices from '../services/urlServices.js';

/**
 * @class URLController
 * 
 * This class is the controller for the process-url endpoint.
 * It contains the processURL() method that will be called when the endpoint is hit with the appropriate HTTP request (POST).
 * That method will then call the beginScoringModule() method from the URLServices class.
 * 
 */
class URLController {
       
    public static async processURL(req: Request, res: Response): Promise<void> {
        
        // Get the URL from the request body
        const { url } = req.body;

        // Validate the URL format
        try {
            const urlObject = new URL(url);
            const response = await URLServices.beginScoringModule(url);
            res.send(response);

        } catch (error) {
            res.status(400).send("Invalid URL");
        }
    }
}

export default URLController;