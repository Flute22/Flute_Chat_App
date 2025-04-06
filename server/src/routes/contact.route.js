import { Router } from "express";
import { searchContacts } from "../controllers/contact.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/search-contacts").post(verifyJwt, searchContacts);

export { router };
