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

import express, { Express, Request, Response, NextFunction } from "express";
import packagesRouter from "./routes/packagesRoutes.js";
import resetRouter from "./routes/resetRoutes.js";
import packageRouter from "./routes/packageRoutes.js";
import cors from 'cors';



const app: Express = express();
const port = 443; // port for https

// Enable CORS for all origins for typesript
app.use(cors({
  origin: "*",
}));


// app.use((req: Request, res: Response, next: NextFunction) => {
//   next();
// }, cors({ maxAge: 84600 }));
  

// The code bellow is the example for allowing only a specifc origin
// app.use(cors({
//   origin: ["http://192.168.0.11:5173", "192.168.109.1:3000", "192.168.109.1:3000"],
// })); 

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) =>
  res.json({ message: "Express + TypeScript Server" }),
);
app.get("/test", (req: Request, res: Response) =>
  res.json({
    "URL": "https://www.npmjs.com/package/axios",
    "NetScore": 0.85,
    "NetScore_Latency": 7.341,
    "RampUp": 0.9,
    "RampUp_Latency": 0.217,
    "Correctness": 0.95,
    "Correctness_Latency": 0.5164,
    "BusFactor": 0.8,
    "BusFactor_Latency": 6.155,
    "ResponsiveMaintainer": 0.92,
    "ResponsiveMaintainer_Latency": 0.1026,
    "License": 0.88,
    "License_Latency": 0.1461
  }),
);

app.use("/packages", packagesRouter);
app.use("/reset", resetRouter);
app.use("/package", packageRouter);
app.use("/tracks", (req: Request, res: Response) =>
  res.json({ plannedTracks: "[none]" }),
);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

/*
interface RequestParams {
  id: string;
}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  queryString: string;
}
*/

/*
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Express + TypeScript Server' });
});

// POST Get the packages from the registry
// Don't 100% understand this one. Need to come back to it
app.post('/packages', (req: Request<{}, {}, {}, RequestQuery>, res: Response) => {
  // Placeholder response
  const { query } = req;
  const packages = JSON.parse(JSON.stringify(query));
  res.json(packages);
});

// DELETE Registry reset
// Reset registry to default state
app.delete('/reset', (req: Request, res: Response) => {
  res.send(`Registry reset`);
});

// GET Get ratings for this package
app.get('/package/:id/rate', (req: Request, res: Response) => {
  res.send(`Get ratings for ${req.params.id}`);
});

// GET Get the cost of a package
// Need to figure out what cost means and what the dependency is
app.get('/package/:id/cost', (req: Request<RequestParams, {}, {}, RequestQuery>, res: Response) => {
  const { query, params } = req;
  console.log(query);
  console.log(params);

  const newQuery = Object.assign({}, req);
  console.log(newQuery);

  const dependency = JSON.parse(JSON.stringify(query));
  res.send(dependency);
});

// GET Interact with the package with this ID
// Return this package
app.get('/package/:id', (req: Request, res: Response) => {
  res.send(`Returning package: ${req.params.id}`);
});

// PUT Update this content of the package
app.put('/package/:id', (req: Request, res: Response) => {
  res.send(`Updating specific content of ${req.params.id}`);
});

// POST Get any packages fitting the regular expression
// Search with regex over package names and READMEs
app.post('/package/byRegEx', (req: Request, res: Response) => {
  res.send(`Create package`);
});

// POST Upload or ingest new package
// May have same name but new version
// Look into how ID is formed
app.post('/package', (req: Request, res: Response) => {
  res.send(`Upload or ingest new package`);
});

// GET Get the list of tracks implemented
app.get('/tracks', (req: Request, res: Response) => {
  res.send("No tracks implemented in this version");
});
*/
if (process.env.NODE_ENV !== "test") {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
});
  // app.listen({ port, address: "0.0.0.0" });
}

export default app;
