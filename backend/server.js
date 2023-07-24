import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import functions from "firebase-functions";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

import {
  signup_post,
  login_post,
  verify_user,
  searchWord,
  add_to_favourites,
  viewFavourites,
  deleteFavourite,
  logout,
} from "./controller.mjs";

import { verifyLogin } from "./middleware/verifyLogin.mjs";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Commented out, otherwise firebase function would throw a server error, as
    // the process of listening for request has been handed over the to the cloud function
    // as shown in the last line. Uncomment to test locally.
    // app.listen(4000);
    // console.log("Server ready . . .");
  })
  .catch((err) => console.log(err));

// Request handlers
app.post("/signup", signup_post);
app.post("/login", login_post);
app.get("/dashboard", verify_user);
app.get("/search", searchWord);
app.post("/favourites", verifyLogin, add_to_favourites);
app.get("/favourites", verifyLogin, viewFavourites);
app.delete("/favourites", verifyLogin, deleteFavourite);
app.get("/logout", verifyLogin, logout);
app.use("*", (_req, res) => {
  res.json({ err: "Invalid URL" });
});

export const api = functions.https.onRequest(app);
