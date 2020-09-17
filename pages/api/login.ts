import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "./utils/initMiddleware";
import Cors from "cors";
import User, { loginBodySchema } from "./utils/model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDatabase } from "./utils/database.util";

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with PUT and OPTIONS
    methods: ["PUT", "OPTIONS"],
  })
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Run middleware
  await cors(req, res);
  const database = await getDatabase();
  const { method } = req;

  try {
    // Determine method
    switch (method) {
      case "POST":
        // Validate body
        const { body } = req;
        const { error } = loginBodySchema.validate(body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if email exists
        const user = await User.findOne({ email: body.email });
        console.log("creating jwt");
        if (!user) return res.status(400).send("Email or password incorrect");

        // Compare password to hashed password
        const validPass = await bcrypt.compare(body.password, user.password);
        if (!validPass)
          return res.status(400).send("Email or password incorrect");

        // Create and assign JSON Web Token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        res.setHeader("auth-token", token);

        // Send JSON Web Token
        res.status(200).json({ token });
        break;

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).send(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log(error);
  }
};
