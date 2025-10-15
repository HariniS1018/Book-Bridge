import User from "./user.js"; 
import Book from "./book.js";

async function getProfileDetailsModel(userId, transaction) {
  try {
    const user = await User.findByPk(userId, { 
      transaction, attributes: ['user_name', 'email_id', 'registration_number'] 
    });

    if (!user) {
      return null;
    }

    return user.toJSON(); 
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Error fetching user profile details");
  }
}
async function updateProfileModel(userId, updateData, transaction) {
  try {
    const user = await User.findByPk(userId, { transaction });

    if (!user) {
      return null; 
    }
    
    const updatedUser = await user.update(updateData, { transaction });
    
    const safeUser = updatedUser.toJSON();
    delete safeUser.password;
    delete safeUser.created_at; 
    delete safeUser.updated_at;
    
    return safeUser;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error("The email ID or registration number is already in use.");
    }
    console.error("Error updating user profile:", error);
    throw new Error("Error updating user profile details");
  }
}

async function deleteUserModel(userId, transaction) {
  try {
    const user = await User.findByPk(userId, { transaction });

    if (!user) {
      return null;
    }

    if (user.is_active === false) {
      return null; 
    }

    await user.update({ is_active: false }, { transaction });

    const safeUser = user.toJSON();
    delete safeUser.password;
    delete safeUser.created_at;
    delete safeUser.updated_at;

    return safeUser;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw new Error("Error deactivating user");
  }
}


async function getUserBookListModel(userId, transaction) {
  try {
    const user = await User.findByPk(userId, {
      attributes: ['user_id', 'user_name'], 
      transaction,
      include: [
        {
          model: Book,
          attributes: ['book_name', 'author_name', 'publication_year'], 
          through: {
            attributes: ['count', 'available_count', 'availability_status'], 
            where: { is_deleted: false } 
          },
        },
      ],
    });

    if (!user) {
      return null;
    }
    
    return user.Books || []; 

  } catch (error) {
    console.error("Error fetching user book list:", error);
    throw new Error("Error fetching the list of books owned by the user.");
  }
}

export { getProfileDetailsModel, updateProfileModel, deleteUserModel,getUserBookListModel };
