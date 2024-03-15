import prisma from "../utils/db";
import asyncWrapper from "../utils/asyncWrapper";
import type { Request, Response } from "express";

const createVehicle = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { vehicleID, ownerEmail } = req.body;
    await prisma.vehicle.create({
      data: {
        numberPlate: vehicleID,
        user: {
          connect: {
            email: ownerEmail,
          },
        },
      },
    });
    return res.status(200).json({ message: "success" });
  });
};

export { createVehicle };
