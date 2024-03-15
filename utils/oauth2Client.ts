import secrets from "./secrets";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  secrets.oauthClientID,
  secrets.oauthClientSecret,
  secrets.oauthRedirectURL
);

oauth2Client.setCredentials({});
export default oauth2Client;
