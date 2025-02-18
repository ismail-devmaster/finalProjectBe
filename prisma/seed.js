const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Seed enum-like tables with upsert operations

  // Seed Sex table
  const maleSex = await prisma.sex.upsert({
    where: { gender: 'MALE' },
    update: {},
    create: { gender: 'MALE' }
  })

  const femaleSex = await prisma.sex.upsert({
    where: { gender: 'FEMALE' },
    update: {},
    create: { gender: 'FEMALE' }
  })

  // Seed AppointmentStatus table
  const waitingStatus = await prisma.appointmentStatus.upsert({
    where: { status: 'WAITING' },
    update: {},
    create: { status: 'WAITING' }
  })

  const upcomingStatus = await prisma.appointmentStatus.upsert({
    where: { status: 'UPCOMING' },
    update: {},
    create: { status: 'UPCOMING' }
  })

  const completedStatus = await prisma.appointmentStatus.upsert({
    where: { status: 'COMPLETED' },
    update: {},
    create: { status: 'COMPLETED' }
  })

  // Seed AppointmentType table
  const consultationType = await prisma.appointmentType.upsert({
    where: { type: 'Consultation' },
    update: {},
    create: { type: 'Consultation' }
  })

  // Seed PaymentStatus table
  const pendingPaymentStatus = await prisma.paymentStatus.upsert({
    where: { status: 'PENDING' },
    update: {},
    create: { status: 'PENDING' }
  })

  const paidPaymentStatus = await prisma.paymentStatus.upsert({
    where: { status: 'PAID' },
    update: {},
    create: { status: 'PAID' }
  })

  const cancelledPaymentStatus = await prisma.paymentStatus.upsert({
    where: { status: 'CANCELLED' },
    update: {},
    create: { status: 'CANCELLED' }
  })

  // Create a sample Patient user
  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@example.com',
      password: 'password', // Remember: hash passwords in production
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phone: '1234567890',
      sexId: maleSex.id,
      isVerified: true,
      role: 'PATIENT'
    }
  })

  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      medicalHistory: 'No significant medical history'
    }
  })

  // Create a sample Doctor user
  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@example.com',
      password: 'password',
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: new Date('1985-05-05'),
      phone: '0987654321',
      sexId: femaleSex.id,
      isVerified: true,
      role: 'DOCTOR'
    }
  })

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id
    }
  })

  // Create a sample Receptionist user
  const receptionistUser = await prisma.user.create({
    data: {
      email: 'receptionist@example.com',
      password: 'password',
      firstName: 'Bob',
      lastName: 'Brown',
      dateOfBirth: new Date('1992-03-03'),
      phone: '1112223333',
      sexId: maleSex.id,
      isVerified: true,
      role: 'RECEPTIONIST'
    }
  })

  const receptionist = await prisma.receptionist.create({
    data: {
      userId: receptionistUser.id
    }
  })

  // Create a sample Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'password',
      firstName: 'Eve',
      lastName: 'White',
      dateOfBirth: new Date('1980-07-07'),
      phone: '4445556666',
      sexId: femaleSex.id,
      isVerified: true,
      role: 'ADMIN'
    }
  })

  const admin = await prisma.admin.create({
    data: {
      userId: adminUser.id
    }
  })

  // Create a sample Action associated with the Patient
  const action = await prisma.action.create({
    data: {
      name: 'Initial Checkup',
      patientId: patientUser.id,
      description: 'Regular checkup',
      totalPayment: 100.0
    }
  })

  // Create a sample Appointment between the Patient and Doctor
  const appointment = await prisma.appointment.create({
    data: {
      patientId: patientUser.id,
      doctorId: doctorUser.id,
      typeId: consultationType.id,
      actionId: action.id,
      statusId: waitingStatus.id,
      date: new Date(),
      time: new Date(),
      additionalNotes: 'Bring previous records'
    }
  })

  // Create a sample Queue entry for the Appointment
  const queueEntry = await prisma.queue.create({
    data: {
      patientId: patientUser.id,
      appointmentId: appointment.id,
      estimatedWaitTime: 15,
      estimatedTimeToDoctor: 10,
      status: 'WAITING'
    }
  })

  // Create a sample Payment associated with the Action
  const payment = await prisma.payment.create({
    data: {
      patientId: patientUser.id,
      doctorId: doctorUser.id,
      statusId: pendingPaymentStatus.id,
      actionId: action.id,
      amount: 100.0,
      date: new Date(),
      time: new Date(),
      description: 'Consultation fee'
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
