/**
 * @file urlRoutes.ts
 * 
 * Defines the routes for the process-url endpoint.
 * 
 */

import { Router } from 'express';
import  URLController  from '../controllers/urlController.js';

const router = Router();

// Define the post route and call the processURL method from the URLController.
router.post('/', URLController.processURL);

export default router;