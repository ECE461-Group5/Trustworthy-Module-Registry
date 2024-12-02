import express from "express";
import packagesRouter from "./routes/packagesRoutes.js";
import resetRouter from "./routes/resetRoutes.js";
import packageRouter from "./routes/packageRoutes.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded());
app.get("/", (req, res) => res.json({ message: "Express + TypeScript Server" }));
app.use("/packages", packagesRouter);
app.use("/reset", resetRouter);
app.use("/package", packageRouter);
app.use("/tracks", (req, res) => res.json({ plannedTracks: "[none]" }));
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
if (process.env.NODE_ENV !== "test") {
    app.listen({ port, address: "0.0.0.0" });
}
export default app;
//# sourceMappingURL=server.js.map