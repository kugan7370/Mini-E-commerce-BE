import {
  createUserService,
  getAllUserService,
  getUserByIdService,
  loginUserService,
  updateUserService,
} from "../services/userService.js";
import CustomError from "../utils/customError.js";
import { errorResponse, successResponse } from "../utils/response.js";

const createUserController = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    successResponse(res, newUser, "User created successfully", 201);
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create user");
    }
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { userWithoutPassword, token } = await loginUserService(req.body);
    successResponse(
      res,
      { user: userWithoutPassword, token },
      "User logged in successfully"
    );
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to login");
    }
  }
};

const getAllUserController = async (req, res, next) => {
  try {
    const users = await getAllUserService();
    successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message, "Failed to retrieve users");
  }
};

const getUserByIdController = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    errorResponse(res, error.message, "Failed to retrieve user");
  }
};

const updateUserController = async (req, res, next) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body);
    successResponse(res, updatedUser, "User updated successfully");
  } catch (error) {
    errorResponse(res, error.message, "Failed to update user");
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    successResponse(res, deletedUser, "User deleted successfully");
  } catch (error) {
    errorResponse(res, error.message, "Failed to delete user");
  }
};

export default {
  createUserController,
  loginUserController,
  getAllUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
};
