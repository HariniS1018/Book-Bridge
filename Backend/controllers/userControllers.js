import { getProfileDetailsService,updateProfileDetailsService,deleteUserService,getUserBookListService } from "../services/userService.js";

async function getProfileDetails(req, res, next) {
  try {
    const userId = req.user.userId; 

    if (!userId) {
      return res.status(401).json({ message: "Authentication failed. User ID missing." });
    }

    const userProfile = await getProfileDetailsService(userId);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    
    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
}

async function getUserBookList(req, res, next) {
    try {
        const userId = req.user.userId; 

        if (!userId) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const bookList = await getUserBookListService(userId);

        if (!bookList || bookList.length === 0) {
             return res.status(200).json({ 
                message: "you have no books added", 
                books: []
             });
        }
        
        res.status(200).json(bookList);

    } catch (error) {
        next(error);
    }
}
async function updateProfileDetails(req, res, next) {
    try {
        const userId = req.user.userId; 
        const updateData = req.body;    
        if (!userId) {
            return res.status(401).json({ message: "Authentication required." });
        }
        
        const allowedUpdates = {};
        
        if (updateData.user_name) {
            allowedUpdates.user_name = updateData.user_name;
        }
        if (updateData.email_id) {
            allowedUpdates.email_id = updateData.email_id;
        }
        if (updateData.registration_number) {
            allowedUpdates.registration_number = updateData.registration_number;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        const updatedProfile = await updateProfileDetailsService(userId, allowedUpdates);

        if (!updatedProfile) {
             return res.status(404).json({ message: "User not found or update failed." });
        }

        res.status(200).json({
            message: "Profile updated successfully.",
            profile: updatedProfile
        });

    } catch (error) {
        if (error.message.includes("already in use")) {
            return res.status(409).json({ message: error.message });
        }
        next(error);
    }
}

async function deleteUser(req, res, next) {
  try {
    const userId = req.user.userId; 

    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const deletedUser = await deleteUserService(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found or already inactive." });
    }

    res.status(200).json({
      message: "User deactivated successfully.",
      user: deletedUser
    });
  } catch (error) {
    next(error);
  }
}


export { getProfileDetails,updateProfileDetails,deleteUser,getUserBookList };