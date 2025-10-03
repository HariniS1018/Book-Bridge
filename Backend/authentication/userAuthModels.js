import User from "../models/user.js";

async function getUserByEmailId(emailId) {
  try {
    const user = await User.findOne({ where: { email_id: emailId } });
    if (!user) {
      console.log("[Models] No user found for the given email ID.");
      return null;
    }
    return user;
  } catch (error) {
    console.error("[Models] Error fetching user by email ID:", error.message);
    throw error;
  }
}


async function getUserByRegistrationNumber(registrationNumber) {
  try {
    const user = await User.findOne({
      where: { registration_number: registrationNumber },
    });
    if (!user) {
      console.log("[Models] No user found for the given registration number.");
      return null;
    }
    return user;
  } catch (error) {
    console.error(
      "[Models] Error fetching user by registration number:",
      error.message
    );
    throw error;
  }
}

async function registerUserModel(
  userName,
  emailId,
  registrationNumber,
  hashedPassword
) {
  try {
    const user = await User.create({
      user_name: userName,
      email_id: emailId,
      registration_number: registrationNumber,
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    console.error("[Models] Error registering user:", error.message);
    throw error;
  }
}

async function updatePasswordModel(emailId, hashedPassword) {
  try {
    const [updatedCount, updatedUsers] = await User.update(
      { password: hashedPassword },
      { where: { email_id: emailId }, returning: true }
    );
    if (updatedCount === 0) {
      console.log(
        "[Models] No user found for the given email ID to update password."
      );
      return null;
    }
    return updatedUsers[0];
  } catch (error) {
    console.error("[Models] Error updating password:", error.message);
    throw error;
  }
}

import RefreshToken from "../models/refreshToken.js";

async function storeRefreshToken(refreshToken, expiresAt, userId) {
  try {
    await RefreshToken.create({
      token: refreshToken,
      expires_at: expiresAt,
      user_id: userId,
      is_valid: true,
    });
    return true;
  } catch (error) {
    console.error("[Models] Error storing refresh token:", error.message);
    throw error;
  }
}

async function getRefreshToken(token) {
  try {
    const result = await RefreshToken.findOne({
      where: { token, is_valid: true },
      include: {
        model: User,
        attributes: ["email_id", "user_name"],
      },
    });
    if (!result) {
      console.log("[Models] The given refresh token not found.");
      return null;
    }
    return result;
  } catch (error) {
    console.error("[Models] Error fetching refresh token:", error.message);
    throw error;
  }
}

async function updateRefreshToken(refreshToken) {
  try {
    const [updatedCount] = await RefreshToken.update(
      { is_valid: false },
      { where: { token: refreshToken } }
    );
    if (updatedCount === 0) {
      console.log("[Models] The given refresh token not found to delete.");
      return null;
    }
    return true;
  } catch (error) {
    console.error("[Models] Error deleting refresh token:", error.message);
    throw error;
  }
}

export {
  getUserByEmailId,
  getUserByRegistrationNumber,
  registerUserModel,
  updatePasswordModel,
  storeRefreshToken,
  getRefreshToken,
  updateRefreshToken,
};