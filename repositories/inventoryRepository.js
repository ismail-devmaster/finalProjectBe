const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createInventory = async (data) => {
  const quantity = Number(data.quantity);
  const status = quantity === 0 
    ? 'OUT_OF_STOCK' 
    : quantity < 5 
      ? 'LOW_STOCK' 
      : 'IN_STOCK';

  return await prisma.inventory.create({
    data: {
      name: data.name,
      quantity,
      category: data.category,
      unit: data.unit,
      status,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    },
  });
};

const getAllInventories = async () => {
  return await prisma.inventory.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getInventoryById = async (id) => {
  return await prisma.inventory.findUnique({
    where: { id: Number(id) },
  });
};

const updateInventory = async (id, data) => {
  const quantity = data.quantity ? Number(data.quantity) : undefined;
  let status = data.status;
  
  if (quantity !== undefined) {
    status = quantity === 0 
      ? 'OUT_OF_STOCK' 
      : quantity < 5 
        ? 'LOW_STOCK' 
        : 'IN_STOCK';
  }

  return await prisma.inventory.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      quantity,
      unit: data.unit,
      status,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    },
  });
};

const deleteInventory = async (id) => {
  return await prisma.inventory.delete({
    where: { id: Number(id) },
  });
};

const getLowInventories = async () => {
  return await prisma.inventory.findMany({
    where: { status: "LOW_STOCK" },
    orderBy: { createdAt: "desc" },
  });
};

const getInStockInventories = async () => {
  return await prisma.inventory.findMany({
    where: { status: "IN_STOCK" },
    orderBy: { createdAt: "desc" },
  });
};

const getOutOfStockInventories = async () => {
  return await prisma.inventory.findMany({
    where: { status: "OUT_OF_STOCK" },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getLowInventories,
  getInStockInventories,
  getOutOfStockInventories,
};
