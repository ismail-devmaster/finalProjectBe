// import { PrismaClient } from "@prisma/client";
// import { faker } from "@faker-js/faker";

const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  // Seed Sex table
  await prisma.sex.createMany({
    data: [{ gender: "MALE" }, { gender: "FEMALE" }],
    skipDuplicates: true,
  });

  // Seed AppointmentStatus
  await prisma.appointmentStatus.createMany({
    data: [
      { status: "WAITING" },
      { status: "UPCOMING" },
      { status: "COMPLETED" },
    ],
    skipDuplicates: true,
  });

  // Seed AppointmentType
  await prisma.appointmentType.createMany({
    data: [
      { type: "GENERAL", requiredSpecialty: "GENERAL" },
      { type: "SPECIALIST", requiredSpecialty: "SPECIALIST" },
      { type: "FOLLOW_UP", requiredSpecialty: "FOLLOW_UP" },
      { type: "EMERGENCY", requiredSpecialty: "EMERGENCY" },
    ],
    skipDuplicates: true,
  });

  // Seed PaymentStatus
  await prisma.paymentStatus.createMany({
    data: [{ status: "PENDING" }, { status: "PAID" }, { status: "CANCELLED" }],
    skipDuplicates: true,
  });

  // Create Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@hospital.com",
      password: "$2b$10$ExampleHash", // Replace with real hash
      firstName: "Admin",
      lastName: "User",
      dateOfBirth: faker.date.past({ years: 30 }),
      phone: faker.phone.number(),
      sexId: 1,
      role: "ADMIN",
      admin: { create: {} },
    },
  });

  // Create Receptionist
  const receptionistUser = await prisma.user.create({
    data: {
      email: "reception@hospital.com",
      password: "$2b$10$ExampleHash",
      firstName: "Reception",
      lastName: "Staff",
      dateOfBirth: faker.date.past({ years: 25 }),
      phone: faker.phone.number(),
      sexId: 2,
      role: "RECEPTIONIST",
      receptionist: { create: {} },
    },
  });

  // Create Doctors
  const doctors = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: "$2b$10$ExampleHash",
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          dateOfBirth: faker.date.past({ years: 40 }),
          phone: faker.phone.number(),
          sexId: faker.number.int({ min: 1, max: 2 }),
          role: "DOCTOR",
          doctor: {
            create: {
              specialty: "SPECIALIST",
            },
          },
        },
      });
    })
  );

  // Create Patients
  const patients = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: "$2b$10$ExampleHash",
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          dateOfBirth: faker.date.past({ years: 60 }),
          phone: faker.phone.number(),
          sexId: faker.number.int({ min: 1, max: 2 }),
          role: "PATIENT",
          patient: {
            create: {
              medicalHistory: faker.lorem.paragraph(),
            },
          },
        },
      });
    })
  );

  // Create Actions
  const actions = await Promise.all(
    patients.map(async (patient) => {
      return prisma.action.create({
        data: {
          patientId: patient.id,
          appointmentTypeId: faker.number.int({ min: 1, max: 4 }),
          description: faker.lorem.sentence(),
          totalPayment: faker.number.float({ min: 50, max: 500 }),
        },
      });
    })
  );

  // Create Appointments
  await Promise.all(
    patients.map(async (patient) => {
      return prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctors[faker.number.int({ min: 0, max: 4 })].id,
          actionId:
            actions[faker.number.int({ min: 0, max: actions.length - 1 })].id,
          statusId: faker.number.int({ min: 1, max: 3 }),
          date: faker.date.future({ years: 1 }),
          time: faker.date.soon({ days: 7 }),
          additionalNotes: faker.lorem.sentence(),
        },
      });
    })
  );

  // Create Inventory Items
  await prisma.inventory.createMany({
    data: Array.from({ length: 50 }).map(() => ({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement([
        "MEDICATIONS",
        "MEDICAL_SUPPLIES",
        "EQUIPMENT",
      ]),
      quantity: faker.number.int({ min: 1, max: 100 }),
      unit: faker.helpers.arrayElement(["PCS", "BOXES", "BOTTLES"]),
      status: faker.helpers.arrayElement(["IN_STOCK", "LOW_STOCK"]),
      expiryDate: faker.date.future({ years: 2 }),
    })),
  });

  // Create Tasks
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return prisma.task.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          assignorId: adminUser.id,
          assignees: {
            connect: [{ id: receptionistUser.id }, { id: doctors[0].id }],
          },
          priority: faker.helpers.arrayElement(["HIGH", "MEDIUM", "LOW"]),
          dueDate: faker.date.future({ days: 30 }),
        },
      });
    })
  );

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
