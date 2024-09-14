import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<string> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info.response;
    } catch (error: any) {
      console.error("Error sending email:", error);

      if (error instanceof Error) {
        throw new Error(`Email could not be sent: ${error.message}`);
      } else {
        throw new Error("Email could not be sent due to an unknown error.");
      }
    }
  }
}

export default EmailService;
