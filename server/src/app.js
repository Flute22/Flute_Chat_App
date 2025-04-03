import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Radhe Radhe Veenu");
});

// Routes Import
import { router as userRoute } from "./routes/user.route.js";

// Routes Declaration
app.use("/api/v1/users", userRoute);

export { app };
