import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { apiRouter } from "./routes/api";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5179",
    credentials: true,
  })
);

// Better Auth handler — must be BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
