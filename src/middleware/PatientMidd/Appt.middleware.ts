export const generateAppointmentNumber = (patientName: string) => {
  const appointmentDate = new Date()

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayIndex = appointmentDate.getDay()
  const dayName = weekDays[dayIndex].charAt(0)

  const day = String(appointmentDate.getDate()).padStart(2, "0")

  const year = String(appointmentDate.getFullYear()).slice(-2)

  const initials =
    patientName.charAt(0).toUpperCase() +
    patientName.charAt(patientName.length - 1).toUpperCase()

  const appointmentNumber = `APPT-${dayName}${day}${year}-${initials}`

  return appointmentNumber
}
