import { sequelize } from "./sequelize.js";

async function withTransaction(callback) {
  const t = await sequelize.transaction();
  try {
    console.log("Transaction started.");
    const result = await callback(t);
    await t.commit();
    console.log("Transaction committed.");
    return result;
  } catch (error) {
    await t.rollback();
    console.error("Transaction rolled back due to error:", error.message);
    throw error;
  }
}

export { withTransaction };
