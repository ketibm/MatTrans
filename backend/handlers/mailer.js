const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject(error);
      else resolve(info);
    });
  });
};

const receiveEmail = async (req, res) => {
  console.log("Received request:", req.body);
  const { name, email, message } = req.body;

  if (!name || !email) {
    console.error("Missing fields in request body");
    return res.status(400).json({ message: "Missing fields" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    // replyTo: email,
    replyTo: `${name} <${email}>`,
    subject: `Барање за резервација од ${name}`,
    text: message,
    html: `
    <h2>Барање за резервација</h2>
    <p><strong>Име:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Порака:</strong><br/>${message}</p>
  `,
  };

  try {
    console.log("Sending email with options:", mailOptions);
    await sendEmail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email: ", error.message);
    res.status(500).json({ message: "Failed to send email." });
  }
};

const sendForgotPasswordEmail = async (to, link) => {
  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <h2>Промена на лозинка</h2>
      <p>Кликни на следниот линк за да ја промениш лозинката:</p>
      <a href="${link}">${link}</a>
      <p>Ако не си побарал промена, игнорирај го овој email.</p>
    `,
  };

  return sendEmail(mailOptions);
};

module.exports = {
  transporter,
  sendEmail,
  receiveEmail,
  sendForgotPasswordEmail,
};
