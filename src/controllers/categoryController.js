import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "../services/categoryService.js";
import CustomError from "../utils/customError.js";
import { errorResponse, successResponse } from "../utils/response.js";

const createCategoryController = async (req, res) => {
  try {
    const newCategory = await createCategoryService(req);
    successResponse(res, newCategory, "Category created successfully", 201);
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create category");
    }
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    successResponse(res, categories, "Categories retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message, "Failed to retrieve categories");
  }
};

const getCategoryByIdController = async (req, res) => {
  try {
    const category = await getCategoryByIdService(req.params.categoryId);
    successResponse(res, category, "Category retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to retrieve category");
    }
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const updatedCategory = await updateCategoryService(req);
    successResponse(res, updatedCategory, "Category updated successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to update category");
    }
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    await deleteCategoryService(req.params.categoryId);
    successResponse(res, null, "Category deleted successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to delete category");
    }
  }
};

export default {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
};
