// /**
//  * @filename - server.ts
//  * @author(s) - Joe Dahms, Djamel Almabouada
//  * @purpose - Core logic of the express server. Defines what routers are used when a certain endpoint is hit.
//  */

// import express, { Express, Request, Response } from "express";
// import packagesRouter from "./routes/packagesRoutes.js";
// import resetRouter from "./routes/resetRoutes.js";
// import packageRouter from "./routes/packageRoutes.js";

// const app: Express = express();
// const port = 3000;

// import cors from "cors"; 
// app.use(cors({ origin: "*" }));

// app.use(express.json());
// app.use(express.urlencoded());

// app.get("/", (req: Request, res: Response) =>
//   res.json({ message: "Express + TypeScript Server" }),
// );
// app.use("/packages", packagesRouter);
// app.use("/reset", resetRouter);
// app.use("/package", packageRouter);
// app.use("/tracks", (req: Request, res: Response) =>
//   res.json({ plannedTracks: "[none]" }),
// );

// app.use((req: Request, res: Response) => {
//   res.status(404).json({ message: "Route not found" });
// });

// if (process.env.NODE_ENV !== "test") {
//   app.listen({ port, address: "0.0.0.0" });
// }

// export default app;

import express, { Express, Request, Response } from "express";
import cors from "cors";
import packagesRouter from "./routes/packagesRoutes.js";
import resetRouter from "./routes/resetRoutes.js";
import packageRouter from "./routes/packageRoutes.js";

const app: Express = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req: Request, res: Response) =>
  res.json({ message: "Express + TypeScript Server" })
);

// Add your routers
app.use("/packages", packagesRouter);
app.use("/reset", resetRouter);
app.use("/package", packageRouter);

// Example /upload route for testing
app.post("/upload", (req: Request, res: Response) => {
  console.log("Request body:", req.body);

  // Simulate successful upload response
  res.status(200).json({
    message: "Package uploaded successfully!",
    data: req.body, // Echo back the data for testing
  });
});

// Example /tracks route
app.use("/tracks", (req: Request, res: Response) =>
  res.json({ plannedTracks: "[none]" })
);

// 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
