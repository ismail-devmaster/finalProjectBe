const {
  PrismaClient,
  Role,
  Gender,
  AppointmentStatusEnum,
  PaymentStatusEnum,
  QueueStatusEnum,
  AppointmentTypeEnum,
  InventoryUnit,
  InventoryStatus,
  TaskStatus,
  TaskPriority,
} = require("@prisma/client");
const { hash } = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
<<<<<<< HEAD
  // ----------------------------------------------------
  // Seed Lookup Tables
  // ----------------------------------------------------
  // Seed Sex records
  const maleSex = await prisma.sex.upsert({
    where: { gender: "MALE" },
    update: {},
    create: { gender: "MALE" },
  });

  const femaleSex = await prisma.sex.upsert({
    where: { gender: "FEMALE" },
    update: {},
    create: { gender: "FEMALE" },
=======
  console.log(`Start seeding...`);

  // Clear existing data (Optional - comment out if not needed)
  await clearDatabase();

  // Create Sex entries
  const maleGender = await prisma.sex.create({
    data: {
      gender: Gender.MALE,
    },
>>>>>>> a6f33b26e3c0ae699a00fe7e32942e5014b7dbce
  });

  const femaleGender = await prisma.sex.create({
    data: {
      gender: Gender.FEMALE,
    },
  });

  console.log(`Created gender entries`);

  // Create AppointmentStatus entries
  const waitingStatus = await prisma.appointmentStatus.create({
    data: {
      status: AppointmentStatusEnum.WAITING,
    },
  });

  const upcomingStatus = await prisma.appointmentStatus.create({
    data: {
      status: AppointmentStatusEnum.UPCOMING,
    },
  });

  const completedStatus = await prisma.appointmentStatus.create({
    data: {
      status: AppointmentStatusEnum.COMPLETED,
    },
  });

  console.log(`Created appointment status entries`);

  // Create AppointmentType entries
  const generalType = await prisma.appointmentType.create({
    data: {
      type: AppointmentTypeEnum.GENERAL,
    },
  });

  const specialistType = await prisma.appointmentType.create({
    data: {
      type: AppointmentTypeEnum.SPECIALIST,
    },
  });

  const followUpType = await prisma.appointmentType.create({
    data: {
      type: AppointmentTypeEnum.FOLLOW_UP,
    },
  });

  const emergencyType = await prisma.appointmentType.create({
    data: {
<<<<<<< HEAD
      email: "doctor@example.com",
      password: "doctorpassword",
      firstName: "Alice",
      lastName: "Smith",
      dateOfBirth: new Date("1980-05-15"),
      phone: "1111111111",
      sex: { connect: { id: femaleSex.id } },
      role: "DOCTOR",
      doctor: { create: {} },
=======
      type: AppointmentTypeEnum.EMERGENCY,
>>>>>>> a6f33b26e3c0ae699a00fe7e32942e5014b7dbce
    },
  });

  console.log(`Created appointment type entries`);

  // Create PaymentStatus entries
  const pendingPayment = await prisma.paymentStatus.create({
    data: {
<<<<<<< HEAD
      email: "patient1@example.com",
      password: "patient1password",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("1990-01-01"),
      phone: "2222222222",
      sex: { connect: { id: maleSex.id  } },
      role: "PATIENT",
      patient: { create: { medicalHistory: "No allergies" } },
=======
      status: PaymentStatusEnum.PENDING,
>>>>>>> a6f33b26e3c0ae699a00fe7e32942e5014b7dbce
    },
  });

  const paidPayment = await prisma.paymentStatus.create({
    data: {
<<<<<<< HEAD
      email: "patient2@example.com",
      password: "patient2password",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: new Date("1992-02-02"),
      phone: "3333333333",
      sex: { connect: { id: femaleSex.id } },
      role: "PATIENT",
      patient: { create: { medicalHistory: "Diabetic" } },
=======
      status: PaymentStatusEnum.PAID,
>>>>>>> a6f33b26e3c0ae699a00fe7e32942e5014b7dbce
    },
  });

  const cancelledPayment = await prisma.paymentStatus.create({
    data: {
<<<<<<< HEAD
      email: "reception@example.com",
      password: "receptionpassword",
      firstName: "Bob",
      lastName: "Brown",
      dateOfBirth: new Date("1985-03-03"),
      phone: "4444444444",
      sex: { connect: { id: maleSex.id } },
      role: "RECEPTIONIST",
      receptionist: { create: {} },
=======
      status: PaymentStatusEnum.CANCELLED,
>>>>>>> a6f33b26e3c0ae699a00fe7e32942e5014b7dbce
    },
  });

  console.log(`Created payment status entries`);

  // Create Users with different roles
  const hashedPassword = await hash("password123", 10);

  // Admin user
  const adminUser = await prisma.user.create({
    data: {
<<<<<<< HEAD
      email: "admin@example.com",
      password: "adminpassword",
      firstName: "Charlie",
      lastName: "Green",
      dateOfBirth: new Date("1975-04-04"),
      phone: "5555555555",
      sex: { connect: { id: maleSex.id } },
      role: "ADMIN",
      admin: { create: {} },
=======
      email: "admin@hospital.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      dateOfBirth: new Date("1980-01-15"),
      phone: "+1234567890",
      sexId: maleGender.id,
      isVerified: true,
      role: Role.ADMIN,
      admin: {
        create: {},
      },
>>>>>>> a6f33b26e3c0ae699a00fe7e32942e5014b7dbce
    },
  });

  // Doctor users
  const doctorUsers = [];
  const doctorData = [
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@hospital.com",
      sex: maleGender.id,
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@hospital.com",
      sex: femaleGender.id,
    },
    {
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.johnson@hospital.com",
      sex: maleGender.id,
    },
  ];

  for (const doctor of doctorData) {
    const newDoctor = await prisma.user.create({
      data: {
        email: doctor.email,
        password: hashedPassword,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        dateOfBirth: new Date(
          1975 + Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        phone: `+1${Math.floor(Math.random() * 10000000000)
          .toString()
          .padStart(10, "0")}`,
        sexId: doctor.sex,
        isVerified: true,
        role: Role.DOCTOR,
        doctor: {
          create: {},
        },
      },
    });
    doctorUsers.push(newDoctor);
  }

  console.log(`Created ${doctorUsers.length} doctor users`);

  // Receptionist user
  const receptionistUser = await prisma.user.create({
    data: {
      email: "receptionist@hospital.com",
      password: hashedPassword,
      firstName: "Rebecca",
      lastName: "Taylor",
      dateOfBirth: new Date("1990-05-20"),
      phone: "+1987654321",
      sexId: femaleGender.id,
      isVerified: true,
      role: Role.RECEPTIONIST,
      receptionist: {
        create: {},
      },
    },
  });

  console.log(`Created receptionist user`);

  // Patient users
  const patientUsers = [];
  const patientData = [
    {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
      sex: maleGender.id,
      medicalHistory: "Hypertension, Diabetes Type 2",
    },
    {
      firstName: "Emily",
      lastName: "Wilson",
      email: "emily.wilson@example.com",
      sex: femaleGender.id,
      medicalHistory: "Asthma, Allergies to penicillin",
    },
    {
      firstName: "David",
      lastName: "Miller",
      email: "david.miller@example.com",
      sex: maleGender.id,
      medicalHistory: "Knee surgery in 2020",
    },
    {
      firstName: "Sarah",
      lastName: "Jones",
      email: "sarah.jones@example.com",
      sex: femaleGender.id,
      medicalHistory: "Depression, Anxiety",
    },
    {
      firstName: "Thomas",
      lastName: "Garcia",
      email: "thomas.garcia@example.com",
      sex: maleGender.id,
      medicalHistory: "No significant medical history",
    },
  ];

  for (const patient of patientData) {
    const newPatient = await prisma.user.create({
      data: {
        email: patient.email,
        password: hashedPassword,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: new Date(
          1960 + Math.floor(Math.random() * 40),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        phone: `+1${Math.floor(Math.random() * 10000000000)
          .toString()
          .padStart(10, "0")}`,
        sexId: patient.sex,
        isVerified: true,
        role: Role.PATIENT,
        patient: {
          create: {
            medicalHistory: patient.medicalHistory,
          },
        },
      },
    });
    patientUsers.push(newPatient);
  }

  console.log(`Created ${patientUsers.length} patient users`);

  // Create Actions for patients
  const actions = [];
  for (const patient of patientUsers) {
    const appointmentTypeIds = [
      generalType.id,
      specialistType.id,
      followUpType.id,
      emergencyType.id,
    ];

    // Create 1-3 actions per patient
    const numActions = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numActions; i++) {
      const typeId =
        appointmentTypeIds[
          Math.floor(Math.random() * appointmentTypeIds.length)
        ];
      const completed = Math.random() > 0.5;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));

      let endDate = null;
      let completedAt = null;

      if (completed) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 1);
        completedAt = endDate;
      }

      const action = await prisma.action.create({
        data: {
          appointmentTypeId: typeId,
          patientId: patient.id,
          description: getActionDescription(typeId, appointmentTypeIds),
          totalPayment: Math.floor(Math.random() * 500) + 50,
          startDate,
          endDate,
          isCompleted: completed,
          completedAt,
        },
      });

      actions.push(action);
    }
  }

  console.log(`Created ${actions.length} actions`);

  // Create Appointments
  const appointments = [];
  for (const action of actions) {
    // Get a random doctor
    const doctor = doctorUsers[Math.floor(Math.random() * doctorUsers.length)];

    // Set the appointment date (in the future for some, in the past for others)
    const futureAppointment = Math.random() > 0.3;
    const appointmentDate = new Date();

    if (futureAppointment) {
      appointmentDate.setDate(
        appointmentDate.getDate() + Math.floor(Math.random() * 30) + 1
      );
    } else {
      appointmentDate.setDate(
        appointmentDate.getDate() - Math.floor(Math.random() * 30)
      );
    }

    // Set appointment time
    const appointmentTime = new Date();
    appointmentTime.setHours(
      9 + Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 12) * 5,
      0
    );

    // Determine status
    let statusId;
    if (!futureAppointment) {
      statusId = completedStatus.id; // Past appointments are completed
    } else if (Math.random() > 0.5) {
      statusId = upcomingStatus.id; // Future appointments are upcoming
    } else {
      statusId = waitingStatus.id; // Some future appointments are waiting
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: action.patientId,
        doctorId: doctor.id,
        actionId: action.id,
        statusId,
        date: appointmentDate,
        time: appointmentTime,
        additionalNotes: Math.random() > 0.7 ? getRandomNotes() : null,
      },
    });

    appointments.push(appointment);
  }

  console.log(`Created ${appointments.length} appointments`);

  // Create Queue entries for some waiting appointments
  const waitingAppointments = appointments.filter(
    (a) => a.statusId === waitingStatus.id
  );

  for (const appointment of waitingAppointments) {
    const queueStatuses = [
      QueueStatusEnum.WAITING,
      QueueStatusEnum.IN_PROGRESS,
    ];
    const queueStatus =
      queueStatuses[Math.floor(Math.random() * queueStatuses.length)];

    await prisma.queue.create({
      data: {
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        estimatedWaitTime: Math.floor(Math.random() * 60) + 10, // 10-70 minutes
        estimatedTimeToDoctor: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
        status: queueStatus,
      },
    });
  }

  console.log(`Created queue entries for waiting appointments`);

  // Create Payments
  for (const action of actions) {
    const paymentStatusIds = [
      pendingPayment.id,
      paidPayment.id,
      cancelledPayment.id,
    ];
    const statusId = action.isCompleted
      ? Math.random() > 0.2
        ? paidPayment.id
        : pendingPayment.id
      : paymentStatusIds[Math.floor(Math.random() * paymentStatusIds.length)];

    // Get a random doctor
    const appointment = appointments.find((a) => a.actionId === action.id);
    if (!appointment) continue;

    const paymentDate = new Date(action.startDate);
    const paymentTime = new Date();
    paymentTime.setHours(
      9 + Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 12) * 5,
      0
    );

    await prisma.payment.create({
      data: {
        patientId: action.patientId,
        doctorId: appointment.doctorId,
        statusId,
        actionId: action.id,
        amount: action.totalPayment,
        date: paymentDate,
        time: paymentTime,
        description: `Payment for ${getActionDescription(
          action.appointmentTypeId,
          [generalType.id, specialistType.id, followUpType.id, emergencyType.id]
        )}`,
      },
    });
  }

  console.log(`Created payments for actions`);

  // Create Categories
  const categories = [
    { name: "Medications" },
    { name: "Medical Supplies" },
    { name: "Equipment" },
    { name: "Laboratory" },
    { name: "Office Supplies" },
  ];

  const createdCategories = [];

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
      },
    });
    createdCategories.push(createdCategory);
  }

  console.log(`Created ${createdCategories.length} inventory categories`);

  // Create Inventory items
  const inventoryItems = [
    {
      name: "Paracetamol 500mg",
      categoryName: "Medications",
      unit: InventoryUnit.BOXES,
      quantity: 150,
    },
    {
      name: "Ibuprofen 400mg",
      categoryName: "Medications",
      unit: InventoryUnit.BOXES,
      quantity: 120,
    },
    {
      name: "Aspirin 100mg",
      categoryName: "Medications",
      unit: InventoryUnit.BOXES,
      quantity: 20,
    },
    {
      name: "Gauze Bandages",
      categoryName: "Medical Supplies",
      unit: InventoryUnit.PACKS,
      quantity: 75,
    },
    {
      name: "Surgical Masks",
      categoryName: "Medical Supplies",
      unit: InventoryUnit.BOXES,
      quantity: 200,
    },
    {
      name: "Disposable Gloves",
      categoryName: "Medical Supplies",
      unit: InventoryUnit.BOXES,
      quantity: 15,
    },
    {
      name: "Sphygmomanometer",
      categoryName: "Equipment",
      unit: InventoryUnit.PCS,
      quantity: 10,
    },
    {
      name: "Stethoscope",
      categoryName: "Equipment",
      unit: InventoryUnit.PCS,
      quantity: 8,
    },
    {
      name: "Thermometer",
      categoryName: "Equipment",
      unit: InventoryUnit.PCS,
      quantity: 5,
    },
    {
      name: "Test Tubes",
      categoryName: "Laboratory",
      unit: InventoryUnit.SETS,
      quantity: 100,
    },
    {
      name: "Microscope Slides",
      categoryName: "Laboratory",
      unit: InventoryUnit.BOXES,
      quantity: 50,
    },
    {
      name: "Blood Collection Tubes",
      categoryName: "Laboratory",
      unit: InventoryUnit.BOXES,
      quantity: 80,
    },
    {
      name: "Printer Paper",
      categoryName: "Office Supplies",
      unit: InventoryUnit.PACKS,
      quantity: 30,
    },
    {
      name: "Pens",
      categoryName: "Office Supplies",
      unit: InventoryUnit.BOXES,
      quantity: 40,
    },
    {
      name: "Folders",
      categoryName: "Office Supplies",
      unit: InventoryUnit.PACKS,
      quantity: 25,
    },
  ];

  for (const item of inventoryItems) {
    const category = createdCategories.find(
      (c) => c.name === item.categoryName
    );
    if (!category) continue;

    const status =
      item.quantity > 50
        ? InventoryStatus.IN_STOCK
        : item.quantity > 20
        ? InventoryStatus.LOW_STOCK
        : InventoryStatus.OUT_OF_STOCK;

    // Create expiry date for medications
    let expiryDate = null;
    if (item.categoryName === "Medications") {
      expiryDate = new Date();
      expiryDate.setFullYear(
        expiryDate.getFullYear() + 1 + Math.floor(Math.random() * 2)
      );
    }

    await prisma.inventory.create({
      data: {
        name: item.name,
        categoryId: category.id,
        quantity: item.quantity,
        unit: item.unit,
        status,
        expiryDate,
      },
    });
  }

  console.log(`Created inventory items`);

  // Create Tasks
  const taskTitles = [
    "Review patient charts",
    "Order new medical supplies",
    "Schedule staff meeting",
    "Update patient records",
    "Prepare monthly report",
    "Maintenance check for equipment",
    "Contact lab for test results",
    "Follow up with patients",
    "Inventory check",
    "Training session preparation",
  ];

  const allStaffUsers = [...doctorUsers, adminUser, receptionistUser];

  for (let i = 0; i < 15; i++) {
    const assignorId =
      allStaffUsers[Math.floor(Math.random() * allStaffUsers.length)].id;
    const assigneeId =
      allStaffUsers[Math.floor(Math.random() * allStaffUsers.length)].id;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

    const isCompleted = Math.random() > 0.7;
    const status = isCompleted
      ? TaskStatus.COMPLETED
      : Math.random() > 0.5
      ? TaskStatus.IN_PROGRESS
      : TaskStatus.PENDING;

    let completedAt = null;
    if (isCompleted) {
      completedAt = new Date();
      completedAt.setDate(
        completedAt.getDate() - Math.floor(Math.random() * 5)
      );
    }

    const priority =
      Math.random() > 0.7
        ? TaskPriority.HIGH
        : Math.random() > 0.5
        ? TaskPriority.MEDIUM
        : TaskPriority.LOW;

    await prisma.task.create({
      data: {
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        description:
          Math.random() > 0.3 ? "Detailed description for this task..." : null,
        assigneeId,
        assignorId,
        priority,
        status,
        dueDate,
        completedAt,
      },
    });
  }

  console.log(`Created tasks`);

  console.log(`Seeding completed.`);
}

// Helper Functions
function getActionDescription(typeId, typeIds) {
  if (typeId === typeIds[0]) return "General health checkup";
  if (typeId === typeIds[1]) return "Consultation with specialist";
  if (typeId === typeIds[2]) return "Follow-up after treatment";
  if (typeId === typeIds[3]) return "Emergency care";
  return "Medical consultation";
}

function getRandomNotes() {
  const notes = [
    "Patient reports persistent headaches",
    "Follow up on medication effectiveness",
    "Discuss lab results from previous visit",
    "Blood pressure monitoring required",
    "Patient has questions about new symptoms",
    "Check previous treatment effectiveness",
    "Annual physical examination",
  ];

  return notes[Math.floor(Math.random() * notes.length)];
}

async function clearDatabase() {
  // Delete related records first to maintain referential integrity
  await prisma.task.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.queue.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.action.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.receptionist.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.paymentStatus.deleteMany({});
  await prisma.appointmentType.deleteMany({});
  await prisma.appointmentStatus.deleteMany({});
  await prisma.sex.deleteMany({});

  console.log("Database cleared");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
