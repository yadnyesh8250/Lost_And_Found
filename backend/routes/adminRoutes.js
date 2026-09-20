import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getTableData, createEntry, deleteEntry, getAdvancedAnalytics } from "../controllers/AdminControllers.js";

const adminRouter = express.Router();

adminRouter.get("/analytics", isAuth, isAdmin, getAdvancedAnalytics);

adminRouter.get("/tables/:tableName", isAuth, isAdmin, getTableData);
adminRouter.post("/tables/:tableName", isAuth, isAdmin, createEntry);
adminRouter.delete("/tables/:tableName/:id", isAuth, isAdmin, deleteEntry);

export default adminRouter;
