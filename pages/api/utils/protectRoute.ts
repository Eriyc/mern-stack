import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

type Handler = (req: NextApiRequest, res: NextApiResponse) => any;

/**
 *
 * Protects an api route and makes sure the request is authorized
 * header {user} will be avalible in the {request}
 * @param handler Api function to protect.
 */

const protectRoute = (handler: Handler) => (req: NextApiRequest, res: NextApiResponse) => {
  // get and check token
  const token = req.headers['auth-token'] as string;
  if (!token) return res.status(401).send('Forbidden');

  // verify token
  try {
    const verified = jwt.verify(token, process.env.SECRET);

    // set header `user` to token and make it avalible to
    req.headers['user'] = JSON.stringify(verified);

    // run handler
    return handler(req, res);
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

export default protectRoute;
