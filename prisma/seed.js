const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create enum records first
  await prisma.sex.createMany({
    data: [
      { gender: 'MALE' },
      { gender: 'FEMALE' }
    ]
  });

  await prisma.appointmentStatus.createMany({
    data: [
      { status: 'WAITING' },
      { status: 'UPCOMING' },
      { status: 'COMPLETED' }
    ]
  });

  await prisma.appointmentType.createMany({
    data: [
      { type: 'GENERAL' },
      { type: 'SPECIALIST' },
      { type: 'FOLLOW_UP' },
      { type: 'EMERGENCY' }
    ]
  });

  await prisma.paymentStatus.createMany({
    data: [
      { status: 'PENDING' },
      { status: 'PAID' },
      { status: 'CANCELLED' }
    ]
  });

  // Create users with related records
  const male = await prisma.sex.findUnique({ where: { gender: 'MALE' } });
  const female = await prisma.sex.findUnique({ where: { gender: 'FEMALE' } });

  // Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@clinic.com',
      password: '$2b$10$examplehashedpassword',
      firstName: 'Admin',
      lastName: 'User',
      dateOfBirth: new Date('1980-01-01'),
      phone: '1234567890',
      sexId: male.id,
      isVerified: true,
      role: 'ADMIN',
      admin: {
        create: {}
      }
    }
  });

  // Doctor users
  const doctor1 = await prisma.user.create({
    data: {
      email: 'doctor1@clinic.com',
      password: '$2b$10$examplehashedpassword',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new Date('1975-05-15'),
      phone: '1234567891',
      sexId: male.id,
      isVerified: true,
      role: 'DOCTOR',
      doctor: {
        create: {}
      }
    }
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: 'doctor2@clinic.com',
      password: '$2b$10$examplehashedpassword',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1982-08-20'),
      phone: '1234567892',
      sexId: female.id,
      isVerified: true,
      role: 'DOCTOR',
      doctor: {
        create: {}
      }
    }
  });

  // Receptionist user
  const receptionist = await prisma.user.create({
    data: {
      email: 'reception@clinic.com',
      password: '$2b$10$examplehashedpassword',
      firstName: 'Emily',
      lastName: 'Davis',
      dateOfBirth: new Date('1990-03-10'),
      phone: '1234567893',
      sexId: female.id,
      isVerified: true,
      role: 'RECEPTIONIST',
      receptionist: {
        create: {}
      }
    }
  });

  // Patient users
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@example.com',
      password: '$2b$10$examplehashedpassword',
      firstName: 'Michael',
      lastName: 'Brown',
      dateOfBirth: new Date('1995-07-22'),
      phone: '1234567894',
      sexId: male.id,
      isVerified: true,
      role: 'PATIENT',
      patient: {
        create: {
          medicalHistory: 'No significant medical history'
        }
      }
    }
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'patient2@example.com',
      password: '$2b$10$examplehashedpassword',
      firstName: 'Jessica',
      lastName: 'Wilson',
      dateOfBirth: new Date('1988-11-30'),
      phone: '1234567895',
      sexId: female.id,
      isVerified: true,
      role: 'PATIENT',
      patient: {
        create: {
          medicalHistory: 'Allergic to penicillin'
        }
      }
    }
  });

  // Get appointment types and statuses
  const generalAppt = await prisma.appointmentType.findUnique({ where: { type: 'GENERAL' } });
  const specialistAppt = await prisma.appointmentType.findUnique({ where: { type: 'SPECIALIST' } });
  const waitingStatus = await prisma.appointmentStatus.findUnique({ where: { status: 'WAITING' } });
  const upcomingStatus = await prisma.appointmentStatus.findUnique({ where: { status: 'UPCOMING' } });

  // Create actions
  const action1 = await prisma.action.create({
    data: {
      appointmentTypeId: generalAppt.id,
      patientId: patient1.id,
      description: 'Annual checkup',
      totalPayment: 100.00
    }
  });

  const action2 = await prisma.action.create({
    data: {
      appointmentTypeId: specialistAppt.id,
      patientId: patient2.id,
      description: 'Cardiology consultation',
      totalPayment: 200.00
    }
  });

  // Create appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      actionId: action1.id,
      statusId: waitingStatus.id,
      date: today,
      time: today,
      additionalNotes: 'Patient has high blood pressure'
    }
  });

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      actionId: action2.id,
      statusId: upcomingStatus.id,
      date: tomorrow,
      time: tomorrow,
      additionalNotes: 'Follow up from previous visit'
    }
  });

  // Create queue entries
  await prisma.queue.create({
    data: {
      patientId: patient1.id,
      appointmentId: 1,
      estimatedWaitTime: 15,
      estimatedTimeToDoctor: 30,
      status: 'WAITING'
    }
  });

  // Get payment statuses
  const pendingPayment = await prisma.paymentStatus.findUnique({ where: { status: 'PENDING' } });
  const paidPayment = await prisma.paymentStatus.findUnique({ where: { status: 'PAID' } });

  // Create payments
  await prisma.payment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      statusId: pendingPayment.id,
      actionId: action1.id,
      amount: 50.00,
      date: today,
      time: today,
      description: 'Initial deposit'
    }
  });

  await prisma.payment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      statusId: paidPayment.id,
      actionId: action2.id,
      amount: 200.00,
      date: today,
      time: today,
      description: 'Full payment'
    }
  });

  // Create inventory items
  await prisma.inventory.createMany({
    data: [
      {
        name: 'Paracetamol',
        category: 'MEDICATIONS',
        quantity: 100,
        unit: 'PACKS',
        status: 'IN_STOCK',
        expiryDate: new Date('2026-12-31')
      },
      {
        name: 'Bandages',
        category: 'MEDICAL_SUPPLIES',
        quantity: 50,
        unit: 'BOXES',
        status: 'IN_STOCK'
      },
      {
        name: 'Stethoscope',
        category: 'EQUIPMENT',
        quantity: 10,
        unit: 'PCS',
        status: 'LOW_STOCK'
      }
    ]
  });

  // Create tasks
  await prisma.task.create({
    data: {
      title: 'Review patient files',
      description: 'Review files for upcoming appointments',
      assignorId: adminUser.id,
      assignees: {
        connect: [{ id: receptionist.id }]
      },
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: tomorrow
    }
  });

  await prisma.task.create({
    data: {
      title: 'Order medical supplies',
      description: 'Order more bandages and gloves',
      assignorId: adminUser.id,
      assignees: {
        connect: [{ id: receptionist.id }]
      },
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    }
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
