const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding the database...");

  // Clear existing data (if needed)
  await clearDatabase();

  // Create enums and lookup tables first
  await seedEnums();

  // Create users with various roles
  await seedUsers();

  // Create actions
  await seedActions();

  // Create appointments
  await seedAppointments();

  // Create queues
  await seedQueues();

  // Create payments
  await seedPayments();

  // Create inventory categories and items
  await seedInventory();

  console.log("Database seeding completed successfully.");
}

async function clearDatabase() {
  console.log("Clearing existing data...");

  // Delete in a specific order to avoid foreign key constraints
  await prisma.queue.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.action.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.receptionist.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.paymentStatus.deleteMany({});
  await prisma.appointmentStatus.deleteMany({});
  await prisma.appointmentType.deleteMany({});
  await prisma.sex.deleteMany({});

  console.log("Database cleared.");
}

async function seedEnums() {
  console.log("Seeding enum lookup tables...");

  // Create sex entries
  const sexes = [{ gender: "MALE" }, { gender: "FEMALE" }];

  for (const sex of sexes) {
    await prisma.sex.upsert({
      where: { gender: sex.gender },
      update: {},
      create: sex,
    });
  }

  // Create appointment statuses
  const appointmentStatuses = [
    { status: "WAITING" },
    { status: "UPCOMING" },
    { status: "COMPLETED" },
  ];

  for (const status of appointmentStatuses) {
    await prisma.appointmentStatus.upsert({
      where: { status: status.status },
      update: {},
      create: status,
    });
  }

  // Create appointment types
  const appointmentTypes = [
    { type: "GENERAL" },
    { type: "SPECIALIST" },
    { type: "FOLLOW_UP" },
    { type: "EMERGENCY" },
  ];

  for (const type of appointmentTypes) {
    await prisma.appointmentType.upsert({
      where: { type: type.type },
      update: {},
      create: type,
    });
  }

  // Create payment statuses
  const paymentStatuses = [
    { status: "PENDING" },
    { status: "PAID" },
    { status: "CANCELLED" },
  ];

  for (const status of paymentStatuses) {
    await prisma.paymentStatus.upsert({
      where: { status: status.status },
      update: {},
      create: status,
    });
  }

  console.log("Enum lookup tables seeded.");
}

async function seedUsers() {
  console.log("Seeding users...");

  // Hash password function
  async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      dateOfBirth: new Date("1980-01-01"),
      phone: "+1234567890",
      sexId: 1, // MALE
      isVerified: true,
      role: "ADMIN",
      admin: {
        create: {},
      },
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // Create receptionist user
  const receptionistPassword = await hashPassword("reception123");
  const receptionist = await prisma.user.create({
    data: {
      email: "receptionist@example.com",
      password: receptionistPassword,
      firstName: "Reception",
      lastName: "Staff",
      dateOfBirth: new Date("1985-05-15"),
      phone: "+1234567891",
      sexId: 2, // FEMALE
      isVerified: true,
      role: "RECEPTIONIST",
      receptionist: {
        create: {},
      },
    },
  });
  console.log(`Created receptionist: ${receptionist.email}`);

  // Create doctor users
  const doctorData = [
    {
      email: "doctor1@example.com",
      password: await hashPassword("doctor123"),
      firstName: "John",
      lastName: "Smith",
      dateOfBirth: new Date("1975-03-20"),
      phone: "+1234567892",
      sexId: 1, // MALE
    },
    {
      email: "doctor2@example.com",
      password: await hashPassword("doctor123"),
      firstName: "Sarah",
      lastName: "Johnson",
      dateOfBirth: new Date("1980-07-12"),
      phone: "+1234567893",
      sexId: 2, // FEMALE
    },
  ];

  for (const data of doctorData) {
    const doctor = await prisma.user.create({
      data: {
        ...data,
        isVerified: true,
        role: "DOCTOR",
        doctor: {
          create: {},
        },
      },
    });
    console.log(`Created doctor: ${doctor.email}`);
  }

  // Create patient users
  const patientData = [
    {
      email: "patient1@example.com",
      password: await hashPassword("patient123"),
      firstName: "Robert",
      lastName: "Williams",
      dateOfBirth: new Date("1990-11-05"),
      phone: "+1234567894",
      sexId: 1, // MALE
      medicalHistory: "Asthma, Allergies to peanuts",
    },
    {
      email: "patient2@example.com",
      password: await hashPassword("patient123"),
      firstName: "Jennifer",
      lastName: "Brown",
      dateOfBirth: new Date("1988-04-25"),
      phone: "+1234567895",
      sexId: 2, // FEMALE
      medicalHistory: "Hypertension",
    },
    {
      email: "patient3@example.com",
      password: await hashPassword("patient123"),
      firstName: "Michael",
      lastName: "Davis",
      dateOfBirth: new Date("1995-08-30"),
      phone: "+1234567896",
      sexId: 1, // MALE
      medicalHistory: "No significant medical history",
    },
  ];

  for (const data of patientData) {
    const { medicalHistory, ...userData } = data;
    const patient = await prisma.user.create({
      data: {
        ...userData,
        isVerified: true,
        role: "PATIENT",
        patient: {
          create: {
            medicalHistory,
          },
        },
      },
    });
    console.log(`Created patient: ${patient.email}`);
  }

  console.log("Users seeding completed.");
}

async function seedActions() {
  console.log("Seeding actions...");

  // Get appointment types
  const appointmentTypes = await prisma.appointmentType.findMany();
  const typeIdMap = appointmentTypes.reduce((map, type) => {
    map[type.type] = type.id;
    return map;
  }, {});

  // Get patient IDs
  const patients = await prisma.patient.findMany({
    select: { userId: true },
  });

  // Create actions for each patient
  for (const patient of patients) {
    // General checkup action
    await prisma.action.create({
      data: {
        appointmentTypeId: typeIdMap["GENERAL"],
        patientId: patient.userId,
        description: "General health checkup",
        totalPayment: 100.0,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    });

    // Specialist consultation action
    await prisma.action.create({
      data: {
        appointmentTypeId: typeIdMap["SPECIALIST"],
        patientId: patient.userId,
        description: "Specialist consultation",
        totalPayment: 250.0,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      },
    });

    // Follow-up action
    await prisma.action.create({
      data: {
        appointmentTypeId: typeIdMap["FOLLOW_UP"],
        patientId: patient.userId,
        description: "Follow-up checkup",
        totalPayment: 80.0,
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    });
  }

  console.log("Actions seeding completed.");
}

async function seedAppointments() {
  console.log("Seeding appointments...");

  // Get status IDs
  const statuses = await prisma.appointmentStatus.findMany();
  const statusMap = statuses.reduce((map, status) => {
    map[status.status] = status.id;
    return map;
  }, {});

  // Get all doctors
  const doctors = await prisma.doctor.findMany({
    select: { userId: true },
  });

  // Get all actions
  const actions = await prisma.action.findMany({
    include: {
      patient: true,
    },
  });

  // Create appointments for each action
  for (const action of actions) {
    // Assign random doctor
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    // Create appointment date (based on action date)
    const appointmentDate = new Date(action.startDate);
    appointmentDate.setHours(9 + Math.floor(Math.random() * 8)); // Between 9 AM and 5 PM
    appointmentDate.setMinutes(Math.floor(Math.random() * 4) * 15); // 0, 15, 30, or 45 minutes

    // Determine status based on date
    let status = "UPCOMING";
    if (appointmentDate < new Date()) {
      status = "COMPLETED";
    }

    await prisma.appointment.create({
      data: {
        patientId: action.patientId,
        doctorId: randomDoctor.userId,
        actionId: action.id,
        statusId: statusMap[status],
        date: new Date(appointmentDate.toDateString()),
        time: appointmentDate,
        additionalNotes: `Notes for ${action.description}`,
      },
    });
  }

  console.log("Appointments seeding completed.");
}

async function seedQueues() {
  console.log("Seeding queues...");

  // Get all appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      status: {
        status: "UPCOMING",
      },
    },
    include: {
      patient: true,
    },
  });

  // Create queue entries for upcoming appointments
  for (const appointment of appointments) {
    await prisma.queue.create({
      data: {
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        estimatedWaitTime: Math.floor(Math.random() * 60) + 10, // 10-70 minutes
        estimatedTimeToDoctor: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
        status: "WAITING",
      },
    });
  }

  console.log("Queues seeding completed.");
}

async function seedPayments() {
  console.log("Seeding payments...");

  // Get payment statuses
  const statuses = await prisma.paymentStatus.findMany();
  const statusMap = statuses.reduce((map, status) => {
    map[status.status] = status.id;
    return map;
  }, {});

  // Get all actions with appointments
  const actions = await prisma.action.findMany({
    include: {
      appointments: {
        include: {
          doctor: true,
          patient: true,
        },
      },
    },
  });

  // Create payments for each action with appointments
  for (const action of actions) {
    if (action.appointments.length > 0) {
      const appointment = action.appointments[0];
      const paymentDate = new Date(appointment.date);

      // Create payment
      await prisma.payment.create({
        data: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          statusId: statusMap["PAID"], // Default to PAID
          actionId: action.id,
          amount: action.totalPayment,
          date: paymentDate,
          time: paymentDate,
          description: `Payment for ${action.description}`,
        },
      });
    }
  }

  console.log("Payments seeding completed.");
}

async function seedInventory() {
  console.log("Seeding inventory...");

  // Create categories
  const categories = [
    { name: "Medications" },
    { name: "Medical Supplies" },
    { name: "Office Supplies" },
    { name: "Equipment" },
  ];

  const categoryMap = {};

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category,
    });
    categoryMap[category.name] = createdCategory.id;
  }

  // Create inventory items
  const inventoryItems = [
    {
      name: "Paracetamol 500mg",
      categoryId: categoryMap["Medications"],
      quantity: 500,
      unit: "BOXES",
      status: "IN_STOCK",
      expiryDate: new Date("2025-12-31"),
    },
    {
      name: "Ibuprofen 200mg",
      categoryId: categoryMap["Medications"],
      quantity: 350,
      unit: "BOXES",
      status: "IN_STOCK",
      expiryDate: new Date("2025-10-15"),
    },
    {
      name: "Antibiotics",
      categoryId: categoryMap["Medications"],
      quantity: 75,
      unit: "BOXES",
      status: "LOW_STOCK",
      expiryDate: new Date("2025-06-30"),
    },
    {
      name: "Disposable Gloves",
      categoryId: categoryMap["Medical Supplies"],
      quantity: 1000,
      unit: "BOXES",
      status: "IN_STOCK",
      expiryDate: null,
    },
    {
      name: "Face Masks",
      categoryId: categoryMap["Medical Supplies"],
      quantity: 1200,
      unit: "BOXES",
      status: "IN_STOCK",
      expiryDate: null,
    },
    {
      name: "Syringes",
      categoryId: categoryMap["Medical Supplies"],
      quantity: 20,
      unit: "PACKS",
      status: "LOW_STOCK",
      expiryDate: null,
    },
    {
      name: "Paper",
      categoryId: categoryMap["Office Supplies"],
      quantity: 50,
      unit: "PACKS",
      status: "IN_STOCK",
      expiryDate: null,
    },
    {
      name: "Pens",
      categoryId: categoryMap["Office Supplies"],
      quantity: 5,
      unit: "BOXES",
      status: "LOW_STOCK",
      expiryDate: null,
    },
    {
      name: "Blood Pressure Monitor",
      categoryId: categoryMap["Equipment"],
      quantity: 10,
      unit: "PCS",
      status: "IN_STOCK",
      expiryDate: null,
    },
    {
      name: "Stethoscope",
      categoryId: categoryMap["Equipment"],
      quantity: 5,
      unit: "PCS",
      status: "IN_STOCK",
      expiryDate: null,
    },
    {
      name: "Thermometer",
      categoryId: categoryMap["Equipment"],
      quantity: 2,
      unit: "SETS",
      status: "LOW_STOCK",
      expiryDate: null,
    },
  ];

  for (const item of inventoryItems) {
    await prisma.inventory.create({
      data: item,
    });
  }

  console.log("Inventory seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
