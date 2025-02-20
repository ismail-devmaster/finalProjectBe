const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
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
  });

  // Seed AppointmentStatus records
  const waitingStatus = await prisma.appointmentStatus.upsert({
    where: { status: "WAITING" },
    update: {},
    create: { status: "WAITING" },
  });
  const upcomingStatus = await prisma.appointmentStatus.upsert({
    where: { status: "UPCOMING" },
    update: {},
    create: { status: "UPCOMING" },
  });
  const completedStatus = await prisma.appointmentStatus.upsert({
    where: { status: "COMPLETED" },
    update: {},
    create: { status: "COMPLETED" },
  });

  // Seed AppointmentType records
  const generalType = await prisma.appointmentType.upsert({
    where: { type: "GENERAL" },
    update: {},
    create: { type: "GENERAL" },
  });
  const specialistType = await prisma.appointmentType.upsert({
    where: { type: "SPECIALIST" },
    update: {},
    create: { type: "SPECIALIST" },
  });
  const followUpType = await prisma.appointmentType.upsert({
    where: { type: "FOLLOW_UP" },
    update: {},
    create: { type: "FOLLOW_UP" },
  });
  const emergencyType = await prisma.appointmentType.upsert({
    where: { type: "EMERGENCY" },
    update: {},
    create: { type: "EMERGENCY" },
  });

  // Seed PaymentStatus records
  const pendingPaymentStatus = await prisma.paymentStatus.upsert({
    where: { status: "PENDING" },
    update: {},
    create: { status: "PENDING" },
  });
  const paidPaymentStatus = await prisma.paymentStatus.upsert({
    where: { status: "PAID" },
    update: {},
    create: { status: "PAID" },
  });
  const cancelledPaymentStatus = await prisma.paymentStatus.upsert({
    where: { status: "CANCELLED" },
    update: {},
    create: { status: "CANCELLED" },
  });

  // Create a Patient user and Patient record
  const patientUser = await prisma.user.create({
    data: {
      email: "patient@example.com",
      password: "password", // In production, use hashed passwords!
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("1990-01-01"),
      phone: "1234567890",
      sex: { connect: { gender: maleSex.gender } },
      role: "PATIENT",
    },
  });

  await prisma.patient.create({
    data: {
      userId: patientUser.id,
      medicalHistory: "No significant history",
    },
  });

  // Create a Doctor user and Doctor record
  const doctorUser = await prisma.user.create({
    data: {
      email: "doctor@example.com",
      password: "password",
      firstName: "Alice",
      lastName: "Smith",
      dateOfBirth: new Date("1980-05-15"),
      phone: "9876543210",
      sex: { connect: { gender: femaleSex.gender } },
      role: "DOCTOR",
    },
  });

  await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
    },
  });

  // Create a Receptionist user and record
  const receptionistUser = await prisma.user.create({
    data: {
      email: "reception@example.com",
      password: "password",
      firstName: "Bob",
      lastName: "Jones",
      dateOfBirth: new Date("1985-03-20"),
      phone: "1112223333",
      sex: { connect: { gender: maleSex.gender } },
      role: "RECEPTIONIST",
    },
  });

  await prisma.receptionist.create({
    data: {
      userId: receptionistUser.id,
    },
  });

  // Create an Admin user and record
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "password",
      firstName: "Carol",
      lastName: "White",
      dateOfBirth: new Date("1975-07-10"),
      phone: "4445556666",
      sex: { connect: { gender: femaleSex.gender } },
      role: "ADMIN",
    },
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
    },
  });

  // Create an Action record for the patient
  const action = await prisma.action.create({
    data: {
      appointmentTypeId: generalType.id,
      patientId: patientUser.id, // Patient.userId is same as User.id
      description: "General checkup",
      totalPayment: 100.0,
      startDate: new Date(),
      // endDate can be left undefined if not available
    },
  });

  // Create an Appointment for the patient with the doctor
  const appointment = await prisma.appointment.create({
    data: {
      patientId: patientUser.id,
      doctorId: doctorUser.id,
      actionId: action.id,
      statusId: waitingStatus.id,
      date: new Date(), // Using current date; adjust as needed
      time: new Date(), // Using current time; adjust as needed
      additionalNotes: "Follow-up appointment notes",
    },
  });

  // Create a Queue entry for the appointment
  const queueEntry = await prisma.queue.create({
    data: {
      patientId: patientUser.id,
      appointmentId: appointment.id,
      estimatedWaitTime: 15,
      estimatedTimeToDoctor: 5,
      status: "WAITING", // Enum value from QueueStatusEnum
    },
  });

  // Create a Payment record for the action
  const payment = await prisma.payment.create({
    data: {
      patientId: patientUser.id,
      doctorId: doctorUser.id,
      statusId: pendingPaymentStatus.id,
      actionId: action.id,
      amount: 100.0,
      date: new Date(),
      time: new Date(),
      description: "Payment for general checkup",
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
