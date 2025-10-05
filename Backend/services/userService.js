import { withTransaction } from "../db/transactionHandler.js";
import { getProfileDetailsModel,updateProfileModel,deleteUserModel } from "../models/userModels.js";

async function getProfileDetailsService(userId) {
  return withTransaction(async (transaction) => {
    const userProfile = await getProfileDetailsModel(userId,transaction);
    return userProfile;
  });
}

async function updateProfileDetailsService(userId, updateData) {
  return withTransaction(async (transaction) => {
    const updatedUser = await updateProfileModel(userId, updateData, transaction);
    
    if (!updatedUser) {
      throw new Error("User not found during update.");
    }
    
    return updatedUser;
  });
}
async function deleteUserService(userId) {
  return withTransaction(async (transaction) => {
    const user = await deleteUserModel(userId, transaction);
    return user;
  });
}



export { getProfileDetailsService,updateProfileDetailsService,deleteUserService };