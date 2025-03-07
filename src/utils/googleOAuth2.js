import { OAuth2Client } from 'google-auth-library';
// import path from 'node:path';
// import { readFile } from 'fs/promises';
import env from './env.js';
import createHttpError from 'http-errors';

// const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

// const oauthConfig = JSON.parse(await readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: env('GOOGLE_AUTH_REDIRECT_URI'),
  // redirectUri: oauthConfig.web.redirect_uris[0],
});

const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    redirect_uri: env('GOOGLE_AUTH_REDIRECT_URI'),
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);

  if (!response.tokens.id_token)
    throw createHttpError(401, 'Google OAuth code invalid');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'User';

  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};

export { generateAuthUrl, validateCode, getFullNameFromGoogleTokenPayload };
