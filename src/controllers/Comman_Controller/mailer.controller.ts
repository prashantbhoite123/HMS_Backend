import { Request, Response } from "express"
import { sendMail } from "../../utils/mailer"

export const sendDynamicEmail = async (req: Request, res: Response) => {
  const { from, to, subject, text, html, user, pass } = req.body

  try {
    const emailResponse = await sendMail(
      from,
      to,
      subject,
      text,
      html,
      user,
      pass
    )

    res
      .status(200)
      .json({ message: "Email sent successfully", info: emailResponse })
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error })
  }
}
