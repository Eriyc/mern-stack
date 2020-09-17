import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

import { getDatabase } from './utils/database.util';
import initMiddleware from './utils/initMiddleware';
import PostModel, { postAddSchema, postGetSchema } from './utils/model/Post';
import protectRoute from './utils/protectRoute';
import { Model } from 'mongoose';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with POST and OPTIONS
    methods: ['POST', 'OPTIONS'],
  })
);

const Posts = async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  const database = await getDatabase();

  const { method, body } = req;

  switch (method) {
    case 'GET':
      // expect number of posts to get
      const result = postGetSchema.validate(body);
      if (result.error) return res.status(400).send(result.error.details[0]);

      console.log(body);
      const filterId = body.seen.length > 0 ? { $nin: body.seen } : undefined;
      const posts = await PostModel.find({}).sort({ timestamp: -1, _id: filterId }).limit(body.amount);

      res.status(200).json(posts);

      break;
    case 'PUT':
      // expect data according to mongoose schema
      const { error } = postAddSchema.validate(body);
      if (error) return res.status(400).send(error.details[0]);

      // check if title is in use
      const titleExists = await PostModel.findOne({ title: body.title });
      if (titleExists) return res.status(400).end('Post with same title already exists!');

      // create new post with model
      // ---- get author from jwt header
      const userheader = req.headers['user'] as string;
      const author = JSON.parse(userheader)['_id'];

      const post = new PostModel({
        author,
        title: body.title,
        description: body.description,
        timestamp: new Date(),
      });

      // save the post
      try {
        const savedPost = await post.save();
        console.log(savedPost);
        res.status(200).json({ savedPost });
      } catch (error) {}

      break;

    case 'POST':
      // expect fields to be updated

      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      res.status(405).send(`Method ${method} Not Allowed`);
      break;
  }
};

export default protectRoute(Posts);
