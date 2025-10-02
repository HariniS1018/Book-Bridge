import models from "../models/index.js";
const { RefreshToken } = models;

export const createRefreshToken = async (req, res) => {
  try {
    const { token, user_id, expires_at, is_valid } = req.body;
    const rt = await RefreshToken.create({ token, user_id, expires_at, is_valid });
    res.status(201).json(rt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
