// admin routes without admin auth
import express from "express";
import { getAllUsers, updateSubscription, deleteUser } from "../controllers/adminControllers.js";

const adminRouter = express.Router();
adminRouter.get("/allUsers", getAllUsers);
adminRouter.put("/updateSubscription/:id", updateSubscription);
adminRouter.delete("/deleteUser/:id", deleteUser);

export default adminRouter;