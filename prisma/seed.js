const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Seed Sex (Gender)
  const male = await prisma.sex.create({
    data: { gender: 'MALE' },
  });
  const female = await prisma.sex.create({
    data: { gender: 'FEMALE' },
  });
  console.log('Sex table seeded');

  // 2. Seed AppointmentStatus
  const waitingStatus = await prisma.appointmentStatus.create({
    data: { status: 'WAITING' },
  });
  const upcomingStatus = await prisma.appointmentStatus.create({
    data: { status: 'UPCOMING' },
  });
  const completedStatus = await prisma.appointmentStatus.create({
    data: { status: 'COMPLETED' },
  });
  console.log('AppointmentStatus table seeded');

  // 3. Seed AppointmentType
  const consultationType = await prisma.appointmentType.create({
    data: { type: 'Consultation' },
  });
  const followupType = await prisma.appointmentType.create({
    data: { type: 'Follow-up' },
  });
  console.log('AppointmentType table seeded');

  // 4. Seed PaymentStatus
  const pendingStatus = await prisma.paymentStatus.create({
    data: { status: 'PENDING' },
  });
  const paidStatus = await prisma.paymentStatus.create({
    data: { status: 'PAID' },
  });
  const cancelledStatus = await prisma.paymentStatus.create({
    data: { status: 'CANCELLED' },
  });
  console.log('PaymentStatus table seeded');

  // 5. Create Users with different roles

  // Patient User
  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@example.com',
      password: 'password123', // Remember: in production, hash your passwords!
      firstName: 'Patient',
      lastName: 'User',
      dateOfBirth: new Date('1990-01-01'),
      phone: '1234567890',
      sexId: male.id,
      isVerified: true,
      role: 'PATIENT',
    },
  });

  // Doctor User
  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@example.com',
      password: 'password123',
      firstName: 'Doctor',
      lastName: 'User',
      dateOfBirth: new Date('1980-05-15'),
      phone: '0987654321',
      sexId: female.id,
      isVerified: true,
      role: 'DOCTOR',
    },
  });

  // Receptionist User
  const receptionistUser = await prisma.user.create({
    data: {
      email: 'reception@example.com',
      password: 'password123',
      firstName: 'Reception',
      lastName: 'User',
      dateOfBirth: new Date('1985-03-10'),
      phone: '1112223333',
      sexId: male.id,
      isVerified: true,
      role: 'RECEPTIONIST',
    },
  });

  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      dateOfBirth: new Date('1975-07-20'),
      phone: '4445556666',
      sexId: female.id,
      isVerified: true,
      role: 'ADMIN',
    },
  });
  console.log('Users seeded');

  // 6. Create role-specific records
  // Create a Patient record for the patient user
  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      medicalHistory: 'No significant medical history.',
    },
  });

  // Create a Doctor record for the doctor user
  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
    },
  });

  // Create a Receptionist record for the receptionist user
  const receptionist = await prisma.receptionist.create({
    data: {
      userId: receptionistUser.id,
    },
  });

  // Create an Admin record for the admin user
  const admin = await prisma.admin.create({
    data: {
      userId: adminUser.id,
    },
  });
  console.log('Role-specific records seeded');

  // 7. Create an Action for the patient
  const action = await prisma.action.create({
    data: {
      name: 'Initial Consultation',
      patientId: patient.userId, // Reference to the patient record
      description: 'Initial check-up and consultation.',
      totalPayment: 150.0,
      // startDate will default to now
    },
  });
  console.log('Action record seeded');

  // 8. Create an Appointment linking patient, doctor, type, action, and status
  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.userId,
      doctorId: doctor.userId,
      typeId: consultationType.id,
      actionId: action.id,
      statusId: upcomingStatus.id,
      date: new Date('2025-03-15'),
      time: new Date('2025-03-15T09:00:00'),
      additionalNotes: 'Patient to bring previous medical records.',
    },
  });
  console.log('Appointment record seeded');

  // 9. Create a Queue entry for the appointment
  const queueEntry = await prisma.queue.create({
    data: {
      patientId: patient.userId,
      appointmentId: appointment.id,
      estimatedWaitTime: 15,
      estimatedTimeToDoctor: 10,
      status: 'WAITING', // Uses QueueStatusEnum
    },
  });
  console.log('Queue entry seeded');

  // 10. Create a Payment for the action/appointment
  const payment = await prisma.payment.create({
    data: {
      patientId: patient.userId,
      doctorId: doctor.userId,
      statusId: pendingStatus.id,
      actionId: action.id,
      amount: 150.0,
      date: new Date('2025-03-15'),
      time: new Date('2025-03-15T09:30:00'),
      description: 'Consultation fee payment.',
    },
  });
  console.log('Payment record seeded');

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
