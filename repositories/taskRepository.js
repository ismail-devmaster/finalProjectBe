const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createTask = async (data) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      assigneeId: Number(data.assigneeId),
      assignorId: Number(data.assignorId), // new: assignor relation
      priority: data.priority, // e.g., "HIGH", "MEDIUM", "LOW"
      status: data.status, // e.g., "PENDING", "IN_PROGRESS", "COMPLETED"
      dueDate: new Date(data.dueDate),
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    },
  });
};

const getAllTasks = async () => {
  return await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignee: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      assignor: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

const getTaskById = async (id) => {
  return await prisma.task.findUnique({
    where: { id },
    include: {
      assignee: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      assignor: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

const updateTask = async (id, data) => {
  return await prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      ...(data.assigneeId && { assigneeId: Number(data.assigneeId) }),
      ...(data.assignorId && { assignorId: Number(data.assignorId) }), // update assignor if provided
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
    },
  });
};

const deleteTask = async (id) => {
  return await prisma.task.delete({
    where: { id },
  });
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
