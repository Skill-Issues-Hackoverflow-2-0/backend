import { Router } from "express";
const router = Router();

import {
  editUser,
  usersList,
  verifyAccessToResorce,
  setUserInfo,
} from "../Controllers/users.controller";

import { auth } from "../Controllers/auth.controller";
router.post("/api/users/editUser", auth, editUser);
router.post("/api/users/usersList", auth, usersList);
router.post("/api/users/setUserInfo", auth, setUserInfo);

export default router;
