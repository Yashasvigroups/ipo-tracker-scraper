const { transporter } = require("./transporter");

async function sendMail(userEmail, userName, companyName) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: `New IPO for company ${companyName} listed`,
    text: `Dear ${userName},\nNew IPO for ${companyName} is listed check it out.`,
  };

  try {
    let res = await transporter.sendMail(mailOptions);
    console.log("sent mail", res);
  } catch (err) {
    console.log("Failed sending mail");
  }
}

module.exports = { sendMail };
