import express from "express";


import { createClaimRequest, createItem, getAllItems, getClaimRequests, updateClaimScore, getMyClaims, updateItem, deleteItem, resolveItem, createReport } from "../controllers/ItemControllers.js";
import { upload } from "../middlewares/multer.js";
import { isAuth } from "../middlewares/isAuth.js";

const itemRouter = express.Router();

/* POST ITEM */
itemRouter.post("/add", isAuth, upload.single("image"), createItem);

itemRouter.get("/getAll", getAllItems);
itemRouter.put("/:id", isAuth, upload.single("image"), updateItem);
itemRouter.delete("/:id", isAuth, deleteItem);
itemRouter.patch("/:id/resolve", isAuth, resolveItem);
itemRouter.post("/claim/:id", isAuth, upload.single("itemImage"), createClaimRequest);
itemRouter.get("/claimed-request", isAuth, getClaimRequests);
itemRouter.patch("/claim/:id/score", isAuth, updateClaimScore);
itemRouter.get("/claim/my", isAuth, getMyClaims);

itemRouter.post("/:id/report", isAuth, createReport);


export default itemRouter;
