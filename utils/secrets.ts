import * as dotenv from "dotenv";
dotenv.config();
import * as jwt from "jsonwebtoken";
import { z } from "zod";
const secrets = {
  port: process.env.PORT,
  accessTokenSecret: jwt.sign(
    z.string().parse(process.env.ACCESS_TOKEN_SECRET),
    z.string().parse(process.env.JWT_SECRET)
  ),
  refreshTokenSecret: jwt.sign(
    z.string().parse(process.env.REFRESH_TOKEN_SECRET),
    z.string().parse(process.env.JWT_SECRET)
  ),
  clientURL_1: process.env.CLIENT_URL_1,
  clientURL_2: process.env.CLIENT_URL_2,
  serverURL: process.env.SERVER_URL,
  oauthClientID: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthRedirectURL: process.env.OAUTH_REDIRECT_URL,
};

export default secrets;
