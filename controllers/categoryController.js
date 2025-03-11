const categoryService = require("../services/categoryService");

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.updateCategory(id, req.body);
    res.json({ message: "Category updated", category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryService.deleteCategory(id);
    res.json({ message: "Category deleted", category: deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
