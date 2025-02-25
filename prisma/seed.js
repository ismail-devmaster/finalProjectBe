const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
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
  });

  // Seed AppointmentStatus records
  const waitingStatus = await prisma.appointmentStatus.create({
    data: { status: "WAITING" },
  });
  const upcomingStatus = await prisma.appointmentStatus.create({
    data: { status: "UPCOMING" },
  });
  const completedStatus = await prisma.appointmentStatus.create({
    data: { status: "COMPLETED" },
  });

  // Seed AppointmentType records
  const generalType = await prisma.appointmentType.create({
    data: { type: "GENERAL" },
  });
  const specialistType = await prisma.appointmentType.create({
    data: { type: "SPECIALIST" },
  });
  const followUpType = await prisma.appointmentType.create({
    data: { type: "FOLLOW_UP" },
  });
  const emergencyType = await prisma.appointmentType.create({
    data: { type: "EMERGENCY" },
  });

  // Seed PaymentStatus records
  const pendingStatus = await prisma.paymentStatus.create({
    data: { status: "PENDING" },
  });
  const paidStatus = await prisma.paymentStatus.create({
    data: { status: "PAID" },
  });
  const cancelledStatus = await prisma.paymentStatus.create({
    data: { status: "CANCELLED" },
  });

  // ----------------------------------------------------
  // Create Users and Their Roles
  // ----------------------------------------------------
  // Create a doctor
  const doctorUser = await prisma.user.create({
    data: {
      email: "doctor@example.com",
      password: "doctorpassword",
      firstName: "Alice",
      lastName: "Smith",
      dateOfBirth: new Date("1980-05-15"),
      phone: "1111111111",
      sex: { connect: { id: femaleSex.id } },
      role: "DOCTOR",
      doctor: { create: {} },
    },
  });

  // Create two patients
  const patientUser1 = await prisma.user.create({
    data: {
      email: "patient1@example.com",
      password: "patient1password",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("1990-01-01"),
      phone: "2222222222",
      sex: { connect: { id: maleSex.id  } },
      role: "PATIENT",
      patient: { create: { medicalHistory: "No allergies" } },
    },
  });

  const patientUser2 = await prisma.user.create({
    data: {
      email: "patient2@example.com",
      password: "patient2password",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: new Date("1992-02-02"),
      phone: "3333333333",
      sex: { connect: { id: femaleSex.id } },
      role: "PATIENT",
      patient: { create: { medicalHistory: "Diabetic" } },
    },
  });

  // Create a receptionist
  const receptionistUser = await prisma.user.create({
    data: {
      email: "reception@example.com",
      password: "receptionpassword",
      firstName: "Bob",
      lastName: "Brown",
      dateOfBirth: new Date("1985-03-03"),
      phone: "4444444444",
      sex: { connect: { id: maleSex.id } },
      role: "RECEPTIONIST",
      receptionist: { create: {} },
    },
  });

  // Create an admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "adminpassword",
      firstName: "Charlie",
      lastName: "Green",
      dateOfBirth: new Date("1975-04-04"),
      phone: "5555555555",
      sex: { connect: { id: maleSex.id } },
      role: "ADMIN",
      admin: { create: {} },
    },
  });

  // Fetch patient records (their id equals the user id)
  const patient1 = await prisma.patient.findUnique({
    where: { userId: patientUser1.id },
  });
  const patient2 = await prisma.patient.findUnique({
    where: { userId: patientUser2.id },
  });

  // ----------------------------------------------------
  // Create Actions
  // ----------------------------------------------------
  const action1 = await prisma.action.create({
    data: {
      appointmentType: { connect: { id: generalType.id } },
      patient: { connect: { userId: patient1.userId } },
      description: "General consultation for flu symptoms",
      totalPayment: 50.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 60000), // +30 minutes
    },
  });

  const action2 = await prisma.action.create({
    data: {
      appointmentType: { connect: { id: specialistType.id } },
      patient: { connect: { userId: patient1.userId } },
      description: "Specialist consultation for skin issues",
      totalPayment: 150.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 60000), // +60 minutes
    },
  });

  const action3 = await prisma.action.create({
    data: {
      appointmentType: { connect: { id: emergencyType.id } },
      patient: { connect: { userId: patient2.userId } },
      description: "Emergency visit for severe headache",
      totalPayment: 200.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 60000), // +45 minutes
    },
  });

  // ----- Additional Actions -----
  const action4 = await prisma.action.create({
    data: {
      appointmentType: { connect: { id: followUpType.id } },
      patient: { connect: { userId: patient1.userId } },
      description: "Follow-up consultation after initial treatment",
      totalPayment: 75.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 60000), // +30 minutes
    },
  });

  const action5 = await prisma.action.create({
    data: {
      appointmentType: { connect: { id: generalType.id } },
      patient: { connect: { userId: patient2.userId } },
      description: "General check-up for annual exam",
      totalPayment: 40.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 20 * 60000), // +20 minutes
    },
  });

  // ----------------------------------------------------
  // Create Appointments
  // ----------------------------------------------------
  const appointment1 = await prisma.appointment.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      action: { connect: { id: action1.id } },
      status: { connect: { id: waitingStatus.id } },
      date: new Date(), // today
      time: new Date(),
      additionalNotes: "Patient arrived on time.",
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      action: { connect: { id: action2.id } },
      status: { connect: { id: upcomingStatus.id } },
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
      time: new Date(new Date().setHours(10, 0, 0, 0)),
      additionalNotes: "Follow-up required.",
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      patient: { connect: { userId: patient2.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      action: { connect: { id: action3.id } },
      status: { connect: { id: completedStatus.id } },
      date: new Date(new Date().setDate(new Date().getDate() - 1)), // yesterday
      time: new Date(new Date().setHours(9, 30, 0, 0)),
      additionalNotes: "Treatment successful.",
    },
  });

  // ----- Additional Appointments -----
  const appointment4 = await prisma.appointment.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      action: { connect: { id: action4.id } },
      status: { connect: { id: upcomingStatus.id } },
      date: new Date(new Date().setDate(new Date().getDate() + 2)), // day after tomorrow
      time: new Date(new Date().setHours(11, 0, 0, 0)),
      additionalNotes: "Follow-up appointment scheduled.",
    },
  });

  const appointment5 = await prisma.appointment.create({
    data: {
      patient: { connect: { userId: patient2.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      action: { connect: { id: action5.id } },
      status: { connect: { id: waitingStatus.id } },
      date: new Date(new Date().setDate(new Date().getDate() + 3)), // in three days
      time: new Date(new Date().setHours(14, 30, 0, 0)),
      additionalNotes: "General check-up appointment.",
    },
  });

  // ----------------------------------------------------
  // Create Payments
  // ----------------------------------------------------
  const payment1 = await prisma.payment.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      status: { connect: { id: paidStatus.id } },
      action: { connect: { id: action1.id } },
      amount: 50.0,
      date: new Date(),
      time: new Date(),
      description: "Payment completed via credit card.",
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      status: { connect: { id: pendingStatus.id } },
      action: { connect: { id: action2.id } },
      amount: 150.0,
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: new Date(new Date().setHours(10, 30, 0, 0)),
      description: "Payment pending, to be processed later.",
    },
  });

  const payment3 = await prisma.payment.create({
    data: {
      patient: { connect: { userId: patient2.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      status: { connect: { id: cancelledStatus.id } },
      action: { connect: { id: action3.id } },
      amount: 200.0,
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      time: new Date(new Date().setHours(10, 15, 0, 0)),
      description: "Payment cancelled due to insurance issues.",
    },
  });

  // ----- Additional Payments -----
  const payment4 = await prisma.payment.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      status: { connect: { id: paidStatus.id } },
      action: { connect: { id: action4.id } },
      amount: 75.0,
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: new Date(new Date().setHours(11, 30, 0, 0)),
      description: "Payment for follow-up consultation completed.",
    },
  });

  const payment5 = await prisma.payment.create({
    data: {
      patient: { connect: { userId: patient2.userId } },
      doctor: { connect: { userId: doctorUser.id } },
      status: { connect: { id: pendingStatus.id } },
      action: { connect: { id: action5.id } },
      amount: 40.0,
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      time: new Date(new Date().setHours(15, 0, 0, 0)),
      description: "Payment pending for general check-up.",
    },
  });

  // ----------------------------------------------------
  // Create Queue Entries (for completeness)
  // ----------------------------------------------------
  const queue1 = await prisma.queue.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      appointment: { connect: { id: appointment1.id } },
      estimatedWaitTime: 15,
      estimatedTimeToDoctor: 5,
      status: "WAITING",
    },
  });

  const queue2 = await prisma.queue.create({
    data: {
      patient: { connect: { userId: patient2.userId } },
      appointment: { connect: { id: appointment3.id } },
      estimatedWaitTime: 0,
      estimatedTimeToDoctor: 0,
      status: "COMPLETED",
    },
  });

  // Additional queue entries for new appointments
  const queue3 = await prisma.queue.create({
    data: {
      patient: { connect: { userId: patient1.userId } },
      appointment: { connect: { id: appointment4.id } },
      estimatedWaitTime: 10,
      estimatedTimeToDoctor: 3,
      status: "WAITING",
    },
  });

  const queue4 = await prisma.queue.create({
    data: {
      patient: { connect: { userId: patient2.userId } },
      appointment: { connect: { id: appointment5.id } },
      estimatedWaitTime: 20,
      estimatedTimeToDoctor: 8,
      status: "WAITING",
    },
  });

  console.log(
    "Database seeded successfully with additional actions, appointments, and payments!"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
