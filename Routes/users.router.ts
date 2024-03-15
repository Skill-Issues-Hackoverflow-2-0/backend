import { Router } from "express";
const router = Router();

import {
  editUser,
  usersList,
  verifyAccessToResorce,
  setUserInfo,
  corsShit,
} from "../Controllers/users.controller";

import { auth } from "../Controllers/auth.controller";
router.post("/api/users/editUser", auth, editUser);
router.post("/api/users/usersList", auth, usersList);
router.post("/api/users/setUserInfo", auth, setUserInfo);
router.post("/api/users/corsShit", auth, corsShit);

export default router;
