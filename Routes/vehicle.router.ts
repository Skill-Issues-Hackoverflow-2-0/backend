import { Router } from "express";
const router = Router();
import { auth } from "../Controllers/auth.controller";
import { createVehicle } from "../Controllers/vehicle.controller";

router.post(
	"/api/vehicle/createVehicle",
	auth,
	createVehicle
);
router.post(
	"/api/vehicle/deleteVehicle",
	auth,
	// deleteVehicle
);

export default router;
