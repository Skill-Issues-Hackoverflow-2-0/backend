import { Router } from "express";
const router = Router();

import {
  createPositionRecord,
  getVehiclePosition,
} from "../Controllers/position.controller";
import { auth } from "../Controllers/auth.controller";
router.post(
  "/api/position/storeCurrentPosition",
  auth,
  createPositionRecord,
  //call store function
);
router.post(
  "/api/position/getCurrentPosition",
  auth,
  getVehiclePosition,
  //call store function
);

export default router;
