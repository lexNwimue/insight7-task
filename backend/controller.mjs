import { User } from "./model/User.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { isValidWord } from "./utils/validateWord.mjs";
dotenv.config();

// Creating cookie data using jwt
// This is made global so it can be accessible to both signup and login modules
const expirationDuration = 7 * 24 * 60 * 60;
const createJWTtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expirationDuration,
  });
};

export const signup_post = (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ err: "Please fill in all fields" });
    User.findOne({ email: email })
      .then(async (result) => {
        if (result) {
          res.json({ failed: "Email already exists" });
        } else {
          // Encrypt password before saving to DB

          const salt = await bcrypt.genSalt(10);
          bcrypt
            .hash(password, salt)
            .then((hash) => {
              const newUser = new User({
                name: name,
                email: email,
                password: hash,
              });

              newUser
                .save()
                .then((user) => {
                  const token = createJWTtoken(user.email);
                  res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: expirationDuration * 1000,
                  });
                  res.json({ success: user });
                })
                .catch((e) => console.log(e));
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while searching for word",
    });
  }
};

export const login_post = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ err: "Please fill in all fields" });
    User.findOne({ email })
      .then(async (user) => {
        if (!user) {
          res.json({ failed: "Incorrect email or password" });
          return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = createJWTtoken(user.email);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: expirationDuration * 1000,
          });
          // We do not want to send back sensitive/irrelevant data to the frontend
          user.password = undefined;
          user.__v = undefined;

          res.json({ success: user });
          return;
        } else {
          res.json({ failed: "Incorrect email or password" });
        }
      })
      .catch((err) => res.json({ err: err }));
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while searching for word",
    });
  }
};

export const verify_user = (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      let decoded = {};
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(500).json({ failed: "Some error occured..." });
          return { failed: "Some error occured..." };
        } else if (decodedToken) {
          res.json({ success: "Authorized" });
          decoded = decodedToken;
          return decoded;
        }
      });

      return decoded;
    } else {
      res.json({ failed: "Unauthorized access..." });
    }
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while verifying user",
    });
  }
};

export const searchWord = async (req, res) => {
  try {
    const searchText = req.query.searchText;
    let result = [];
    let response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${searchText}`
    );
    if (response.status == 200) {
      response = await response.json();
      response = response[0].meanings.flat();

      // The data returned from the dictionary API is a bit unstructured.
      // Some iterative tweaks are required to product a structured response
      for (
        let j = 0;
        j < response.length && j < response[j].definitions.length;
        j++
      ) {
        result[j] = {};
        result[j].definitionNum = `Definition ${1 + j}: `;
        result[j].definition = response[j].definitions[j].definition;
        result[j].partOfSpeech = response[j].partOfSpeech;

        // Check if synonyms array is undefined (on initial interation)
        // if such, then define it as an array
        if (typeof result[j].synonyms === "undefined") result[j].synonyms = [];

        // If there exists a populated array of synonyms push it's value to the result array
        if (response[j].definitions[j].synonyms.length > 0) {
          result[j].synonyms.push(response[j].definitions[j].synonyms);
        }

        result[j].synonyms.push(response[j].definitions[j].synonyms);
        if (j === response.length - 1) {
          res.json(result); // Only return response after last iteration
          return;
        }
      }
    } else {
      res.json({ empty: "No results" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while searching for word",
    });
  }
};

export const add_to_favourites = async (req, res) => {
  try {
    const word = req.body.word;

    if (!isValidWord(word)) {
      return res.status(401).json({
        err: "Invalid input. Only single word containing only alphabets allowed",
      });
    }
    const userID = req.user._id;

    // Ensure the to-be-added word isn't already in the favourites array
    // for that particular user before adding.
    const userFavourites = await User.find(
      { _id: userID },
      { favourites: 1, _id: 0 } //Returns only the favourites field and not the entire user document
    );
    console.log(userFavourites);
    if (userFavourites.length == 0) {
      await User.updateOne({ _id: userID }, { $push: { favourites: word } });
      res.json({ success: "Added to Favourites successfully" });
    }
    if (userFavourites[0].favourites.indexOf(word) === -1) {
      await User.updateOne({ _id: userID }, { $push: { favourites: word } });
      res.json({ success: "Added to Favourites successfully" });
      return;
    } else {
      res.json({ failed: "Word already added to Favourites" });
      return;
    }
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while adding to favourites",
    });
  }
};

export const viewFavourites = async (req, res) => {
  try {
    const userID = req.user._id;

    let userFavourites = await User.find(
      { _id: userID },
      { favourites: 1, _id: 0 } //Returns only the favourites field and not the entire user document
    );
    userFavourites = userFavourites[0].favourites;
    return res.json(userFavourites);
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while fetching favourites",
    });
  }
};

export const deleteFavourite = async (req, res) => {
  try {
    const word = req.body.word;
    if (!isValidWord(word)) {
      return res.status(401).json({
        err: "Invalid input. Only single word containing only alphabets allowed",
      });
    }
    const userID = req.user._id;
    await User.updateOne({ _id: userID }, { $pull: { favourites: word } }); // Remove word from array
    let userFavourites = await User.find(
      { _id: userID },
      { favourites: 1, _id: 0 } //Returns only the favourites field and not the entire user document
    );
    userFavourites = userFavourites[0].favourites;

    res.json(userFavourites);
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while deleting favourite",
    });
  }
};

export const logout = (_req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.json({ success: "Logout successfull" });
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      err: err.message || "Encountered an error while logging out",
    });
  }
};
