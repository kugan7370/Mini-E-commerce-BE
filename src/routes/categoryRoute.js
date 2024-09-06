import express from "express";
const router = express.Router();
import categoryController from "../controllers/categoryController.js";
import verifyUserToken from "../middleware/verifyUserToken.js";
import upload from "../middleware/multer.js";

// create category
router.post(
  "/create",
  verifyUserToken,
  upload.array("images"),
  categoryController.createCategoryController
);
// get all categories
router.get("/", categoryController.getAllCategoriesController);
// get category by id
router.get("/:categoryId", categoryController.getCategoryByIdController);
// update category
router.put(
  "/:categoryId",
  verifyUserToken,
  upload.array("images"),
  categoryController.updateCategoryController
);
// delete category
router.delete("/:categoryId", categoryController.deleteCategoryController);

export default router;
