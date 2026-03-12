import express from "express";
import {
  signup,
  login,
  logout,
  updateprofile,
  checkAuth,
} from "../controllers/authControllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update", protectedRoute, updateprofile);
router.get("/checkauth", protectedRoute, checkAuth);
export default router;
