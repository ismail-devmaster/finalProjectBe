const inventoryService = require("../services/inventoryService");

exports.createInventory = async (req, res) => {
  try {
    const inventory = await inventoryService.createInventory(req.body);
    res.status(201).json({ message: "Inventory item created", inventory });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(500).json({ error: "Failed to create inventory item" });
  }
};

exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await inventoryService.getAllInventories();
    res.json({ inventories });
  } catch (error) {
    console.error("Error fetching inventories:", error);
    res.status(500).json({ error: "Failed to fetch inventories" });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await inventoryService.getInventoryById(id);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    res.json({ inventory });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).json({ error: "Failed to fetch inventory item" });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInventory = await inventoryService.updateInventory(
      id,
      req.body
    );
    res.json({
      message: "Inventory item updated",
      inventory: updatedInventory,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({ error: "Failed to update inventory item" });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInventory = await inventoryService.deleteInventory(id);
    res.json({
      message: "Inventory item deleted",
      inventory: deletedInventory,
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ error: "Failed to delete inventory item" });
  }
};

exports.getLowInventories = async (req, res) => {
  try {
    const inventories = await inventoryService.getLowInventories();
    res.json({ inventories });
  } catch (error) {
    console.error("Error fetching low inventories:", error);
    res.status(500).json({ error: "Failed to fetch low inventories" });
  }
};

exports.getInStockInventories = async (req, res) => {
  try {
    const inventories = await inventoryService.getInStockInventories();
    res.json({ inventories });
  } catch (error) {
    console.error("Error fetching in-stock inventories:", error);
    res.status(500).json({ error: "Failed to fetch in-stock inventories" });
  }
};

exports.getOutOfStockInventories = async (req, res) => {
  try {
    const inventories = await inventoryService.getOutOfStockInventories();
    res.json({ inventories });
  } catch (error) {
    console.error("Error fetching out-of-stock inventories:", error);
    res.status(500).json({ error: "Failed to fetch out-of-stock inventories" });
  }
};
