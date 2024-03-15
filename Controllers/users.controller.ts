import prisma from "../utils/db";
import asyncWrapper from "../utils/asyncWrapper";
import type { Request, Response, NextFunction } from "express";

const verifyAccessToResorce = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAllowed = await asyncWrapper(
    req,
    res,
    async (req: Request, res: Response) => {
      const user = res.locals.user;
      if (user.hasAccessTo === "ADMIN" || user.hasAccessTo === "SUPERUSER") {
        return true;
      }
      res.status(403).json({
        message: "Oops! You don't have access to this",
      });
      return false;
    }
  );
  isAllowed && next();
};

const getAllUsers = async () => {
  return await prisma.users.findMany({
    select: {
      id: false,
      userID: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
};

const usersList = async (req: Request, res: Response) => {
  await asyncWrapper(req, res, async (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: "success", data: await getAllUsers() });
  });
};

const editUser = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { userToUpdate, NewRole } = req.body;
    await prisma.users.update({
      where: {
        userID: userToUpdate,
      },
      data: {
        role: NewRole,
      },
    });
    return res
      .status(200)
      .json({ message: "success", data: await getAllUsers() });
  });
};

const setUserInfo = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { name, phone, email } = req.body;
    let profileStatus = false;
    if (name !== null && phone !== null) {
      profileStatus = true;
    } else {
      return res
        .status(200)
        .json({ message: "Please fill in all the details!" });
    }
    await prisma.users.update({
      where: {
        email: res.locals.email,
      },
      data: {
        name,
        phone,
        email,
      },
    });
    res.status(200).json({ message: "success" });
  });
};

const linkVehicleToUser = async (req: Request, res: Response) => {
  asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { vehicleID } = req.body;
    await prisma.users.update({
      where: {
        email: res.locals.email,
      },
      data: {
        vehicle: {
          connect: {
            numberPlate: vehicleID,
          },
        },
      },
    });
    return res.status(200).json({ message: "success" });
  });
};

export {
  editUser,
  usersList,
  verifyAccessToResorce,
  setUserInfo,
  linkVehicleToUser,
};
