import models from "../models/index.js";
const { User} = models;

// Create a new user
export const createUser = async (req, res) => {
  try {
    const {user_id, user_name, registration_number, email_id, password } = req.body;

    const newUser = await User.create({
      user_id,
      user_name,
      registration_number,
      email_id,
      password,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
