import prisma from "../utils/db";
import asyncWrapper from "../utils/asyncWrapper";
import type { Request, Response } from "express";

const createPolice = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { name, email, phone } = req.body;
    const user = res.locals.user;
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        phone,
		name,
		email
      },
    });
    return res.status(200).json({ message: "success" });
  });
};

const verifyPolice = async (req: Request, res: Response) => {
	asyncWrapper(req, res, async (req: Request, res: Response) => {
		const user = res.locals.user;
		await prisma.users.update({
			where: {
				id: user.id,
			},
			data: {
				isVerified: true
			},
		});
		return res.status(200).json({ message: "success" });
	})
}

export { createPolice , verifyPolice};
