import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/messages.controller.js";

const router = Router();
router.route("/get-messages").post(verifyJwt, getMessages);

export { router };
