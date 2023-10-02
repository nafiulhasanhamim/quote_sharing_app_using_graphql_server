import { gql } from "apollo-server";
export const typeDefs = gql`
  type Query {
    greet: String
    users: [User]
    user(_id: ID!): User
    quotes: [QuoteWithName]
    iquote(by: ID!): [Quote]
    myprofile: User
  }
  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    quotes: [Quote]
  }
  type QuoteWithName {
    name: String
    by: IdName
  }
  type IdName {
    firstName: String
    _id: String
  }
  type Quote {
    name: String
    by: ID
  }
  type Token {
    token: String
  }
  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createQuote(name: String!): String
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserSigninInput {
    email: String!
    password: String!
  }
`;
