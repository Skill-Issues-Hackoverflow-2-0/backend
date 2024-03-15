import prisma from "../utils/db";
import asyncWrapper from "../utils/asyncWrapper";
import type { Request, Response, NextFunction } from "express";

const createPositionRecord = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { lat, long, vehicleNumber } = req.body;
    await prisma.locHistory.create({
      data: {
        lat,
        long,
        vehicleNumber,
      },
    });
    return res.status(200).json({ message: "success" });
  });
};

const getVehiclePosition = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { vehicleNumber } = req.params;
    const position = await prisma.locHistory.findFirst({
      where: {
        vehicleNumber,
      },
      orderBy: {
        timeStamp: "desc",
      },
    });
    return res.status(200).json({ position });
  });
};
export { createPositionRecord, getVehiclePosition };
