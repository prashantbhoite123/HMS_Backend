import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { errorHandler } from "../../utils/error.handler"
import { send } from "process"
import { sendMail } from "../../utils/mailer"
import { User } from "../../model/common_Model/user.model"

const approvelHospitals = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hospitals = await Hospital.find()
    if (!hospitals) {
      return next(errorHandler(404, " Hospitals not found"))
    }

    const pendingHospital = hospitals.filter(
      (hospital) => hospital.status === "Pending"
    )

    if (!pendingHospital) {
      return next(errorHandler(404, "pending hospitals not found"))
    }

    return res.status(200).json(pendingHospital)
  } catch (error: any) {
    return next(error)
  }
}

const rejectHospitalApi = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hospitalId } = req.params
    const { reson } = req.body
    if (!hospitalId) {
      return next(errorHandler(404, "HospitalId is required"))
    }
    if (!reson) {
      return next(errorHandler(404, "reson is required"))
    }
    // console.log(hospitalId)
    if (reson === process.env.VITE_APPROVE) {
      const approvedHos = await Hospital.findByIdAndUpdate(
        hospitalId,
        {
          $set: {
            status: "Approved",
          },
        },
        { new: true }
      )

      const hospitalOwner = await User.findOne({ _id: approvedHos?.owner })
      if (!hospitalOwner) {
        return next(errorHandler(404, "Hospital owner not found"))
      }
      sendMail(
        // hospitalOwner?.email,
        "pbhoite985@gmail.com",
        // hospitalOwner?.email,
        "bhoitep326@gmail.com",
        "Congratulations! Your Hospital is Approved",
        `Dear ${hospitalOwner?.username}, \n\n
       We are thrilled to share the fantastic news that your hospital, **${approvedHos?.hospitalName}**, has been successfully approved by our administration team!

This milestone reflects your dedication and commitment to providing quality healthcare services. We are excited to have you as part of our esteemed network of hospitals. 

We look forward to supporting you in delivering outstanding medical care to those in need. Should you have any questions or require assistance, please feel free to reach out to us.

Once again, congratulations on this remarkable achievement!
!. \n\n
       
       ${approvedHos?.hospitalName}
      `,
        "",
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
      )
      console.log("hospital updated==>", approvedHos)
      return res
        .status(200)
        .json({ success: true, message: "Hospital Request Approved " })
    } else {
      const updatedhos = await Hospital.findByIdAndUpdate(
        hospitalId,
        {
          $set: {
            status: "Rejected",
          },
        },
        { new: true }
      )

      const hospitalOwner = await User.findOne({ _id: updatedhos?.owner })
      if (!hospitalOwner) {
        return next(errorHandler(404, "Hospital owner not found"))
      }
      sendMail(
        // hospitalOwner?.email,
        "pbhoite985@gmail.com",
        // hospitalOwner?.email,
        "bhoitep326@gmail.com",
        "Hospital Registration Application Status",

        `
      Dear ${hospitalOwner?.username}, 

       Thank you for your interest in registering your hospital with us. After careful review, we regret to inform you that your application for **${updatedhos?.hospitalName}** has not been approved at this time.

Reason for rejection:  
${reson}

We understand this may be disappointing news, and we encourage you to address the mentioned concerns or make any necessary improvements. You are welcome to reapply in the future once the changes have been made.

If you have any questions or require further clarification, please do not hesitate to reach out to us.

We value your efforts and look forward to the possibility of working with you in the future.
      `,
        "",
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
      )
      console.log("hospital updated==>", updatedhos)
      return res
        .status(200)
        .json({ success: true, message: "Hospital rejected !" })
    }
  } catch (error) {
    return next(error)
  }
}

export default {
  approvelHospitals,
  rejectHospitalApi,
}
