import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import { ErrorHandler } from "./errors/globalError";
import router from "./routes/authRoutes";
import config from "./config";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// Health endpoint (moved under /api so root can serve frontend)
app.get("/api/health", (_, res) => {
  res.send({
    health: "Good",
    msg: "welcome to Bank_Buddy",
  });
});

app.use("/api", router);
app.use("/public", express.static("public"));

// Serve frontend build (if present) so visiting backend root shows the app
// In dev (ts-node): __dirname = BACKEND/src, go up twice to reach project root
// In prod (compiled): __dirname = BACKEND/dist, go up twice to reach project root
const frontendDist = path.join(__dirname, "..", "..", "FRONTEND", "dist");
app.use(express.static(frontendDist));
app.get("/*", (req, res) => {
  const indexHtml = path.join(frontendDist, "index.html");
  res.sendFile(indexHtml, (err) => {
    if (err) res.status(500).send({ error: "Frontend not built" });
  });
});

app.use(ErrorHandler);

const startPortNumber = Number(config.PORT);
let PORT: number = startPortNumber;

const startServer = () => {
  mongoose
    .connect(config.DB_URL)
    .then(() => {
      console.log("DataBase connected successfully");
      const server = app.listen(PORT, () => {
        console.log(`Server Listening at the Port ${PORT}`);
      });

      server.on("error", (err: any) => {
        if (err && err.code === "EADDRINUSE") {
          console.log(
            `Port ${PORT} is already in use. Trying port ${PORT + 1}...`
          );
          PORT++;
          startServer();
        } else {
          console.error("Server error:", err);
          process.exit(1);
        }
      });
    })
    .catch((err) => console.log(`Error: ${err}`));
};

startServer();
