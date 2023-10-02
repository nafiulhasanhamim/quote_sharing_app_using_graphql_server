import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import "./config/db.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import "./models/User.js";
import "./models/Quotes.js";

import { typeDefs } from "./schemaGql.js";
import { resolvers } from "./resolvers.js";
import "dotenv/config";
const context = ({ req }) => {
  const authorization = req.headers["authorization"]?.split(" ")[1];
  // const authorization = (req.headers["authorization"]);
  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.SECRET_KEY);
    return { userId };
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
