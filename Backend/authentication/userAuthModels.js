async function getUserByEmailId(client, emailId) {
  try {
    const user = await client.query("SELECT * FROM users WHERE email_id = $1", [
      emailId,
    ]);
    if (user.rows.length > 0) {
      return user.rows[0];
    } else {
      console.log("[Models] No user found for the given email ID.");
      return null;
    }
  } catch (error) {
    console.error(
      "[Models] Error fetching user by email ID:",
      error.message
    );
    throw error;
  }
}

async function getUserByRegistrationNumber(client, registrationNumber) {
  try {
    const user = await client.query("SELECT * FROM users WHERE registration_number = $1", [
      registrationNumber,
    ]);
    if (user.rows.length > 0) {
      return user.rows[0];
    } else {
      console.log("[Models] No user found for the given registration number.");
      return null;
    }
  } catch (error) {
    console.error("[Models] Error fetching user by registration number:", error.message);
    throw error;
  }
}

async function registerUserModel(
  client,
  userName,
  emailId,
  registrationNumber,
  hashedPassword
) {
  try {
    const registeredUser = await client.query(
      "INSERT INTO users (user_name, email_id, registration_number, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [userName, emailId, registrationNumber, hashedPassword]
    );
    return registeredUser.rows[0];
  } catch (error) {
    console.error("[Models] Error registering user:", error.message);
    throw error;
  }
}

async function storeRefreshToken(client, refreshToken, expiresAt, userId) {
    try {
        await client.query('INSERT INTO refresh_tokens (token, expires_at, user_id, is_valid) VALUES ($1, $2, $3, $4)', [refreshToken, expiresAt, userId, true]);
        return true;
    } catch (error) {
        console.error("[Models] Error storing refresh token:", error.message);
        throw error;
    }
}

async function getRefreshToken(client, token) {
    try {
        const result = await client.query(
            'SELECT rt.*, u.email_id, u.user_name FROM refresh_tokens rt JOIN users u ON rt.user_id = u.user_id WHERE rt.token = $1 and is_valid=True',
            [token]
        );
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            console.log("[Models] The given refresh token not found.");
            return null;
        }
    } catch (error) {
        console.error("[Models] Error fetching refresh token:", error.message);
        throw error;
    }
}

async function updateRefreshToken(client, refreshToken) {
    try {
        const result = await client.query('UPDATE refresh_tokens SET is_valid = False WHERE token = $1', [refreshToken]);
        if (result.rowCount > 0) {
            return result.rows > 0;
        } else {
            console.log("[Models] The given refresh token not found to delete.");
            return null;
        }
    } catch (error) {
        console.error("[Models] Error deleting refresh token:", error.message);
        throw error;
    }
}

export {
  getUserByEmailId,
  getUserByRegistrationNumber,
  registerUserModel,
  storeRefreshToken,
  getRefreshToken,
  updateRefreshToken,
};
