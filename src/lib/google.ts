import { google } from "googleapis";
import crypto from "crypto";

export const getOAuth2Client = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error("Missing Google OAuth env vars");
  }
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
};

export const makeState = () => {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET!;
  const nonce = crypto.randomBytes(16).toString("hex");
  const sig = crypto.createHmac("sha256", secret).update(nonce).digest("hex");
  return `${nonce}.${sig}`;
};

export const verifyState = (state: string) => {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET!;
  const [nonce, sig] = state.split(".");
  const expect = crypto.createHmac("sha256", secret).update(nonce).digest("hex");
  return sig === expect;
};
