const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createInventory = async (data) => {
  return await prisma.inventory.create({
    data: {
      name: data.name,
      categoryId: Number(data.categoryId),
      quantity: Number(data.quantity),
      unit: data.unit, // Expect a value like "PCS", "BOXES", etc.
      status: data.status, // "IN_STOCK", "LOW_STOCK", or "OUT_OF_STOCK"
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    },
  });
};

const getAllInventories = async () => {
  return await prisma.inventory.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

const getInventoryById = async (id) => {
  return await prisma.inventory.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
};

const updateInventory = async (id, data) => {
  return await prisma.inventory.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      quantity: data.quantity ? Number(data.quantity) : undefined,
      unit: data.unit, // Must be a valid InventoryUnit value
      status: data.status,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    },
  });
};

const deleteInventory = async (id) => {
  return await prisma.inventory.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
