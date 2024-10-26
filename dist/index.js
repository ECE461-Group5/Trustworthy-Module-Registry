/**
 * @file index.ts
 * @description Entry point of the API
 * Here we are creating a simple express server.
 * The server listens for requests made and processes the URLs accordingly.
 */
// Phase 1
/*
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { readURLsFromFile } from "./models/evaluators/readURLsFromFile.js";

import dotenv from "dotenv";
dotenv.config();

if (!process.env.LOG_FILE || !process.env.GITHUB_TOKEN) {
  process.exit(1);
}

// Command line arguments
const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    type: 'string',
    describe: 'URL of the module to evaluate'
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    describe: 'Path to the file containing the URLs'
  })
  .parseSync();

// Get file from the command line arguments, or use testing values
const file = argv.file;


if (file) {
  //console.log(`File: ${file}`);
  readURLsFromFile(file);
}
*/
/*
// Here is the server code for when we want to convert the project to an API
import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import URLRoutes from "./server/routes/urlRoutes";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/process-url', URLRoutes);

// Start the server listening on the specified port
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
*/
import express from "express";
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
// GET Package Retrieve
app.get('/package/:id', (req, res) => {
    res.send(`Package to retrieve: ${req.params.id}`);
});
// PUT Update this version of the package
app.put('/package/:id', (req, res) => {
    res.send(`Update specific version of ${req.params.id}`);
});
// DELETE Delete this version of the package
app.delete('/package/:id', (req, res) => {
    res.send(`Delete specific version of ${req.params.id}`);
});
// GET Package rate
app.get('/package/:id/rate', (req, res) => {
    res.send(`Get rate for ${req.params.id}`);
});
// GET Package by name
app.get('/package/byName/:name', (req, res) => {
    res.send(`Return history for all versions of ${req.params.name}`);
});
// DELETE Delete all versions of package
app.delete('/package/byName/:name', (req, res) => {
    res.send(`Delete all versions of ${req.params.name}`);
});
// POST Create package
app.post('/package', (req, res) => {
    res.send(`Create package`);
});
// POST Get packages fitting query
app.post('/packages', (req, res) => {
    const { query } = req;
    const test = JSON.parse(JSON.stringify(query));
    res.send(test);
});
// DELETE Registry reset
app.delete('/reset', (req, res) => {
    res.send(`Registry reset`);
});
// PUT Create auth token
app.put('/authenticate', (req, res) => {
    res.send("Create auth token");
});
app.listen({ port, address: '0.0.0.0' });
//# sourceMappingURL=index.js.map