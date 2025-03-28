const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createTask = async (data) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      assignorId: Number(data.assignorId),
      priority: data.priority,
      status: data.status,
      dueDate: new Date(data.dueDate),
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
      assignees: {
        connect: data.assigneeIds.map((id) => ({ id: Number(id) })),
      },
    },
  });
};

const getAllTasks = async () => {
  return await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignees: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      assignor: {
        select: {
          id: true,
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
      assignees: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      assignor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

const getMyTasks = async (userId) => {
  return await prisma.task.findMany({
    where: {
      assignees: { some: { id: Number(userId) } },
      status: { not: "COMPLETED" }, // Exclude completed tasks
    },
    include: {
      assignee: true,
      assignor: true,
    },
    orderBy: { dueDate: "asc" },
  });
};

const getMyCompletedTasks = async (userId) => {
  return await prisma.task.findMany({
    where: {
      assignees: { some: { id: Number(userId) } },
      status: "COMPLETED",
    },
    include: {
      assignee: true,
      assignor: true,
    },
    orderBy: { completedAt: "desc" },
  });
};

const updateTask = async (id, data) => {
  return await prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      ...(data.assignorId && { assignorId: Number(data.assignorId) }),
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      // Handle multiple assignees
      ...(data.assigneeIds && {
        assignees: {
          set: data.assigneeIds.map((id) => ({ id: Number(id) })),
        },
      }),
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
  getMyTasks,
  getMyCompletedTasks,
  updateTask,
  deleteTask,
};
