import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "./utils/initMiddleware";
import Cors from "cors";
import User, { registerBodySchema } from "./utils/model/User";
import { getDatabase } from "./utils/database.util";
import bcrypt from "bcryptjs";

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with POST and OPTIONS
    methods: ["POST", "OPTIONS"],
  })
);

// config the api function
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  const database = await getDatabase();

  const { method, body } = req;
  switch (method) {
    case "PUT":
      // Validate user input
      const validation = registerBodySchema.validate(body);
      if (validation.error) {
        return res.status(412).json(validation.error.details);
      }

      // Check if user exists in database
      const emailExists = await User.findOne({ email: body.email });
      if (emailExists) return res.status(400).end("Email already exists!");

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(body.password, salt);

      // Create user object
      const user = new User({
        email: body.email,
        name: body.name,
        password: hashPassword,
      });

      // Save the user
      try {
        const savedUser = await user.save();
        console.log(savedUser);
        res.status(200).json({ id: savedUser._id, timestamp: Date.now() });
      } catch (error) {
        console.log(error);
      }
      break;

    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowd, Use PUT`);
  }
};
