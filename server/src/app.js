import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();


app.use( cors(
    {
        origin: process.env.ORIGIN,
        credentials: true,
    }
) );


app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());


export { app };