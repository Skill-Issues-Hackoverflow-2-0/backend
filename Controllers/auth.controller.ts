import * as jwt from "jsonwebtoken";
import oauth2Client from "../utils/oauth2Client";
import type { Request, Response, RequestHandler, NextFunction } from "express";
import { z } from "zod";
import secrets from "../utils/secrets";
import prisma from "../utils/db";
import asyncWrapper from "../utils/asyncWrapper";
import { type userType, jwtPayloadSchema } from "../utils/customTypes";

const auth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { accessToken } = req.cookies;
  try {
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized Request!" });
    }
    const data = jwtPayloadSchema.parse(
      jwt.verify(accessToken, secrets.accessTokenSecret)
    );
    res.locals.email = data.data;
    next();
  } catch (error: any) {
    res.clearCookie("accessToken", {
      expires: new Date(Date.now() + 3600000 * 24),
      domain: secrets.serverURL,
      path: "/api",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.status(401).json({ message: "Session expired!" });
  }
};

const register = async (req: Request, res: Response) => {
  await asyncWrapper(req, res, async (req: Request, res: Response) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      include_granted_scopes: true,
    });
    //console.log(authUrl);
    return res.status(200).json({ message: "success", authUrl });
  });
};

const handleRedirect = async (req: Request, res: Response) => {
  await asyncWrapper(req, res, async (req: Request, res: Response) => {
    //Get tokens from AuthCode
    const authCode: string = z.string().parse(req.query.code);
    const { tokens } = await oauth2Client.getToken(authCode);
    const tokenResult = await oauth2Client.verifyIdToken({
      idToken: z.string().parse(tokens?.id_token),
      maxExpiry: z.number().parse(tokens?.expiry_date),
    });

    //Verify token and extract payload
    const user = tokenResult.getPayload();
    if (!user) throw new Error("Error getting token data!");

    //Register or login the user
    const allUsers = await prisma.users.findMany();
    const prevUser = allUsers.length > 0 ? allUsers[allUsers.length - 1] : null;

    const data = await getUserByEmail(z.string().parse(user?.email));
    if (data) {
      prisma.users.update({
        where: { email: user.email },
        data: {
          email: user.email,
          isVerified: user.email_verified,
          profileImg: user.picture,
          name: user.family_name,
        },
      });
    } else {
      await prisma.users.create({
        data: {
          email: z.string().parse(user.email),
          isVerified: user.email_verified,
          profileImg: user.picture,
          name: user.name,
          refreshToken: tokens.refresh_token,
        },
      });
    }

    //Generate and send accessToken
    const accessToken = jwt.sign(
      { data: z.string().parse(user?.email) },
      secrets.accessTokenSecret,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 3600000 * 24),
      domain: secrets.serverURL,
      path: "/api",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    //Redirect back to register page
    return res.redirect(`${secrets.clientURL_2}/register`);
  });
};

const getUserByEmail = async (email: string) => {
  try {
    return await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        name: true,
        role: true,
        phone: true,
        userID: true,
        isVerified: true,
        profileImg: true,
        refreshToken: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const me = async (req: Request, res: Response) => {
  await asyncWrapper(req, res, async (req: Request, res: Response) => {
    const user: userType = res.locals.user;
    res.status(200).json({
      user: {
        Name: user.name,
        ProfileImg: user.profileImg,
        Role: user.role,
        Email: user.email,
        UserID: user.userID,
        Phone: user.phone,
      },
      message: "success",
    });
  });
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    expires: new Date(Date.now() + 3600000 * 24),
    domain: secrets.serverURL,
    path: "/api",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "success" });
};

const deleteAccount = async (req: Request, res: Response) => {
  await asyncWrapper(req, res, async (req: Request, res: Response) => {
    const email = res.locals.email;
    await prisma.users.delete({
      where: {
        email,
      },
    });
    res.clearCookie("accessToken", {
      expires: new Date(Date.now() + 3600000),
      domain: secrets.serverURL,
      path: "/api",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({ message: "success" });
  });
};
const deleteUserById = async (req: Request, res: Response) => {
  await asyncWrapper(req, res, async (req: Request, res: Response) => {
    const { userID } = req.body;
    await prisma.users.delete({
      where: {
        userID,
      },
    });
    return res.status(200).json({ message: "success" });
  });
};

export {
  register,
  me,
  logout,
  auth,
  deleteAccount,
  getUserByEmail,
  handleRedirect,
  deleteUserById,
};
