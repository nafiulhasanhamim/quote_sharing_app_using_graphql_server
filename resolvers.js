import { users } from "./fakeData.js";
import { quotoes } from "./fakeData.js";
import { uuid } from "uuidv4";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Quote from "./models/Quotes.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import "dotenv/config";
import Quotes from "./models/Quotes.js";
const saltRounds = 10;
export const resolvers = {
  Query: {
    greet: () => {
      return "Hello world";
    },
    users: async () => await User.find({}),
    quotes: async () =>
      await Quote.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "by",
            foreignField: "_id",
            as: "quotedetails",
          },
        },
        {
          $unwind: "$quotedetails",
        },
        {
          $project: {
            _id: 0,
            name: 1,
            by: {
              firstName: "$quotedetails.firstName",
              _id: "$quotedetails._id",
            },
          },
        },
      ]),
    user: async (_, { _id }) => await User.findOne({ _id }),
    iquote: async (_, { by }) => await Quote.find({ by }),
    myprofile: async (_, args, { userId }) => {
      if (!userId) throw new Error("You must be logged in");
      return await User.findOne({ _id: userId });
    },
  },
  User: {
    quotes: async (user) => await Quote.find({ by: user._id }),
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const { firstName, lastName, email, password } = userNew;
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("User already exist in this email account...");
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        ...userNew,
        password: hashedPassword,
      });
      return await newUser.save();
    },
    signinUser: async (_, { userSignin }) => {
      const { email, password } = userSignin;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User is not registered in this email account...");
      }
      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) {
        throw new Error("Password Mismatched...");
      }
      console.log(process.env.SECRET_KEY);
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
      return {
        token,
      };
    },
    createQuote: async (_, { name }, { userId }) => {
      if (!userId) throw new Error("Please login first");
      const newQuote = new Quote({
        name,
        by: userId,
      });
      const quoteData = await newQuote.save();
      return "Qutoe is posted successfully...";
    },
  },
};
