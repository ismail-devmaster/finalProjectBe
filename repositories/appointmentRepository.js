const prisma = require("../config/database");

const createAppointment = async (data) => {
  if (data.date && data.time) {
    const appointmentDate = new Date(data.date);
    appointmentDate.setHours(0, 0, 0, 0); // Reset the time to midnight

    let appointmentTime = new Date(appointmentDate);
    const [hours, minutes] = data.time.split(":"); // Assuming time is in "HH:mm" format
    appointmentTime.setHours(hours, minutes, 0, 0);

    data.date = appointmentDate;
    data.time = appointmentTime;
  }
  return await prisma.appointment.create({ data });
};

const updateAppointment = async (id, updateData) => {
  if (updateData.date && updateData.time) {
    const appointmentDate = new Date(updateData.date);
    appointmentDate.setHours(0, 0, 0, 0); // Reset the time to midnight

    let appointmentTime = new Date(appointmentDate);
    const [hours, minutes] = updateData.time.split(":"); // Assuming time is in "HH:mm" format
    appointmentTime.setHours(hours, minutes, 0, 0);

    updateData.date = appointmentDate;
    updateData.time = appointmentTime;
  }
  return await prisma.appointment.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteAppointment = async (id) => {
  return await prisma.appointment.delete({
    where: { id: Number(id) },
  });
};

const getAllAppointments = async () => {
  return await prisma.appointment.findMany({
    include: {
      status: true,
      queueEntries: true,
      action: {
        select: {
          totalPayment: true,
          appointmentType: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      },
      patient: {
        select: {
          medicalHistory: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phone: true,
              email: true,
              sex: {
                select: {
                  gender: { select: { gender: true } },
                },
              },
            },
          },
        },
      },
      doctor: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

const getAppointmentById = async (id) => {
  return await prisma.appointment.findUnique({
    where: { id: Number(id) },
    include: {
      status: true,
      queueEntries: true,
      action: {
        select: {
          totalPayment: true,
          appointmentType: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      },
      patient: {
        select: {
          medicalHistory: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phone: true,
              email: true,
              sex: {
                select: {
                  gender: { select: { gender: true } },
                },
              },
            },
          },
        },
      },
      doctor: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

const getAppointmentsByPatientId = async (patientId) => {
  return await prisma.appointment.findMany({
    where: { patientId: Number(patientId) },
    include: {
      status: true,
      queueEntries: true,
      action: {
        totalPayment: true,
        select: {
          appointmentType: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      },
      patient: {
        select: {
          medicalHistory: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phone: true,
              email: true,
              sex: {
                select: {
                  gender: { select: { gender: true } },
                },
              },
            },
          },
        },
      },
      doctor: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

const getAppointmentsByActionId = async (actionId) => {
  return await prisma.appointment.findMany({
    where: { actionId: Number(actionId) },
    include: {
      status: true,
      queueEntries: true,
      action: {
        totalPayment: true,
        select: {
          appointmentType: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      },
      patient: {
        select: {
          medicalHistory: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phone: true,
              email: true,
              sex: {
                select: {
                  gender: { select: { gender: true } },
                },
              },
            },
          },
        },
      },
      doctor: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

const getAppointmentsWithWaitingStatus = async () => {
  return await prisma.appointment.findMany({
    where: {
      status: {
        status: "WAITING", // This filters appointments where the status field (a relation) has a status value of "WAITING"
      },
    },
    include: {
      status: true,
      queueEntries: true,
      action: {
        totalPayment: true,
        select: {
          appointmentType: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      },
      patient: {
        select: {
          medicalHistory: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phone: true,
              email: true,
              sex: {
                select: {
                  gender: { select: { gender: true } },
                },
              },
            },
          },
        },
      },
      doctor: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

const getAppointmentsWithUpcomingStatus = async () => {
  return await prisma.appointment.findMany({
    where: {
      status: {
        status: "UPCOMING",
      },
    },
    include: {
      status: true,
      queueEntries: true,
      action: {
        totalPayment: true,
        select: {
          appointmentType: {
            select: { id: true, type: true },
          },
        },
      },
      patient: {
        select: {
          medicalHistory: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phone: true,
              email: true,
              sex: {
                select: {
                  gender: { select: { gender: true } },
                },
              },
            },
          },
        },
      },
      doctor: {
        select: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });
};

const getAppointmentsByDoctorId = async (doctorId) => {
  return await prisma.appointment.findMany({
    where: { doctorId: Number(doctorId) },
    include: {
      status: true,
      queueEntries: true,
      action: {
        totalPayment: true,
        select: {
          appointmentType: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      },
      patient: {
        select: {
          medicalHistory: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phone: true,
              email: true,
              sex: {
                select: {
                  gender: { select: { gender: true } },
                },
              },
            },
          },
        },
      },
      doctor: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

module.exports = {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  getAppointmentsByActionId,
  getAppointmentsWithWaitingStatus,
  getAppointmentsByDoctorId,
  getAppointmentsWithUpcomingStatus,
};
