import cloudinary from "../config/Cloudinary.js";
import Category from "../models/categoryModel.js";
import CustomError from "../utils/customError.js";

const getAllCategoriesService = async () => {
  const categories = await Category.find();

  if (!categories.length) {
    throw new CustomError("No categories found", 404);
  }
  return categories;
};

const getCategoryByIdService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new CustomError("Category not found", 404);
  }
  return category;
};

const createCategoryService = async (req) => {
  const { name } = req.body;

  // Get file images
  if (!req.files || req.files.length === 0) {
    throw new CustomError("No files were uploaded", 400);
  }

  const images = req.files.map((file) => file.path);

  // Save images into Cloudinary and get the URLs
  let cloudinaryImages;
  try {
    cloudinaryImages = await Promise.all(
      images.map(async (image) => {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          image
        );
        return { url: secure_url, public_id };
      })
    );
  } catch (uploadError) {
    throw new CustomError("Failed to upload images", 500);
  }

  // Create new category
  const newCategory = new Category({
    name,
    images: cloudinaryImages,
  });

  try {
    await newCategory.save();
  } catch (saveError) {
    // Remove uploaded files from Cloudinary if saving to DB fails
    await Promise.all(
      cloudinaryImages.map(async (img) => {
        await cloudinary.uploader.destroy(img.public_id);
      })
    );
    throw new CustomError("Failed to save Category", 500);
  }

  return newCategory;
};

const updateCategoryService = async (req) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new CustomError("category not found", 404);
  }

  // Get file images
  let newImages = [];
  if (req.files && req.files.length > 0) {
    console.log("req.files", req.files);
    const images = req.files.map((file) => file.path);

    // Save images into Cloudinary and get the URLs
    try {
      newImages = await Promise.all(
        images.map(async (image) => {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            image
          );
          return { url: secure_url, public_id };
        })
      );
    } catch (uploadError) {
      throw new CustomError("Failed to upload images", 500);
    }
  }

  // Remove old images from Cloudinary if new images are provided
  if (newImages.length > 0) {
    await Promise.all(
      category.images.map(async (img) => {
        await cloudinary.uploader.destroy(img.public_id);
      })
    );
  }

  // Update category details
  category.name = name ? name : category.name;
  category.images = newImages.length > 0 ? newImages : category.images;

  try {
    await category.save();
  } catch (saveError) {
    // Rollback Cloudinary uploads if saving to DB fails
    if (newImages.length > 0) {
      await Promise.all(
        newImages.map(async (img) => {
          await cloudinary.uploader.destroy(img.public_id);
        })
      );
    }
    throw new CustomError("Failed to update category", 500);
  }

  return category;
};

const deleteCategoryService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  await Category.findByIdAndDelete(categoryId);

  await Promise.all(
    category.images.map(async (img) => {
      await cloudinary.uploader.destroy(img.public_id);
    })
  );

  return category;
};

export {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
