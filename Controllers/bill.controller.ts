import prisma from "../utils/db";
import asyncWrapper from "../utils/asyncWrapper";
import type { Request, Response } from "express";

const createBillEntry = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { amount, crime, vehicleNumber} = req.body;

	const vehicle = await prisma.vehicle.findUnique({
		where:{
			numberPlate:vehicleNumber
		},
		include:{
			user:true
		}
	})

	if(!vehicle){
		return res.status(400).json({message:"vehicle not found"})
	}

    await prisma.bills.create({
      data: {
		  crime:crime as string,
		  amount:Number(amount),
		  user:{
			  connect:{
				id:vehicle.user.id
			  }
		  }
      },
    });
    return res.status(200).json({ message: "success" });
  });
};

export { createBillEntry };
