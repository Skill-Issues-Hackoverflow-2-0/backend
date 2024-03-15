const router = require("express").Router();
import {
  register,
  me,
  logout,
  auth,
  deleteAccount,
  deleteUserById,
} from "../Controllers/auth.controller";

router.post("/api/auth/register", register);
router.post("/api/auth/me", auth, me);
router.delete("/api/auth/logout", logout);
router.post("/api/auth/deleteAccount", auth, deleteAccount);
router.post("/api/auth/deleteAccountByUserId", auth, deleteUserById);

export default router;
