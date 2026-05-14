const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
   const sendEmail = async (to, subject, text, html) => {
    try {
      const info = await transporter.sendMail({
        from: `" Backend Ledger " <${process.env.EMAIL_USER}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
    }
    };


//   async function sendRegistrationEmail( userEmail, name ) {
//       const subject = 'Welcome to Backend Ledger!';
//       const text = `Hello ${name},\n\nThank you for registering at Backend Ledger.
//       We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;

//       const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend 
//       Ledger. We're excited to have you on board!</p><p>Best regards, <br>The Backend Ledger Team</p>`;

//       await sendEmail(userEmail, subject, text, html);
//   }

async function sendRegistrationEmail(userEmail, name) {
    const subject = '🎉 Welcome to Backend Ledger – You\'re In!';
    const text = `Hey ${name}!\n\nWelcome aboard Backend Ledger! 🚀\n\nYou've just taken the first step toward mastering your finances like a pro.\n\nHere's what you can do now:\n✅ Track your income & expenses\n✅ Visualize your spending habits\n✅ Stay on top of your financial goals\n\nWe're thrilled to have you with us. If you ever need help, we're just an email away.\n\nCheers,\nThe Backend Ledger Team 💸`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background-color:#f0f4f8;">

      <!-- Wrapper -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; border-radius:16px; overflow:hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.12);">

              <!-- Hero Banner with gradient background -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1f2e 0%, #2d3561 50%, #c84b31 100%); padding: 50px 40px; text-align:center;">
                  <div style="font-size:48px; margin-bottom:16px;">💸</div>
                  <h1 style="color:#ffffff; font-size:32px; font-weight:800; margin:0 0 8px 0; letter-spacing:-0.5px;">
                    Welcome to Backend Ledger!
                  </h1>
                  <p style="color:rgba(255,255,255,0.75); font-size:16px; margin:0;">
                    Your financial journey starts here 🚀
                  </p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="background:#ffffff; padding: 40px;">

                  <!-- Greeting -->
                  <p style="font-size:20px; font-weight:700; color:#1a1f2e; margin:0 0 8px 0;">
                    Hey ${name}! 👋
                  </p>
                  <p style="font-size:15px; color:#555; line-height:1.7; margin:0 0 28px 0;">
                    We're absolutely thrilled to have you on board. You've just joined a community of people who take their finances seriously — and we're here to make that journey as smooth as possible.
                  </p>

                  <!-- Divider -->
                  <hr style="border:none; border-top:1px solid #eee; margin: 0 0 28px 0;">

                  <!-- Features -->
                  <p style="font-size:16px; font-weight:700; color:#1a1f2e; margin:0 0 16px 0;">
                    Here's what you can do now:
                  </p>

                  <!-- Feature Item 1 -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                    <tr>
                      <td width="40" style="vertical-align:top;">
                        <div style="width:32px; height:32px; background:linear-gradient(135deg, #2d3561, #c84b31); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; text-align:center; line-height:32px;">✅</div>
                      </td>
                      <td style="padding-left:12px; vertical-align:middle;">
                        <p style="margin:0; font-size:14px; color:#333;"><strong>Track income & expenses</strong> — Know exactly where every rupee goes</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Feature Item 2 -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                    <tr>
                      <td width="40" style="vertical-align:top;">
                        <div style="width:32px; height:32px; background:linear-gradient(135deg, #2d3561, #c84b31); border-radius:8px; font-size:16px; text-align:center; line-height:32px;">📊</div>
                      </td>
                      <td style="padding-left:12px; vertical-align:middle;">
                        <p style="margin:0; font-size:14px; color:#333;"><strong>Visualize spending habits</strong> — Beautiful charts to understand your patterns</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Feature Item 3 -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td width="40" style="vertical-align:top;">
                        <div style="width:32px; height:32px; background:linear-gradient(135deg, #2d3561, #c84b31); border-radius:8px; font-size:16px; text-align:center; line-height:32px;">🎯</div>
                      </td>
                      <td style="padding-left:12px; vertical-align:middle;">
                        <p style="margin:0; font-size:14px; color:#333;"><strong>Hit your financial goals</strong> — Set targets and crush them one step at a time</p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td align="center">
                        <a href="#" style="display:inline-block; background:linear-gradient(135deg, #2d3561, #c84b31); color:#ffffff; font-size:16px; font-weight:700; text-decoration:none; padding:14px 36px; border-radius:8px; letter-spacing:0.3px;">
                          🚀 Get Started Now
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <hr style="border:none; border-top:1px solid #eee; margin: 0 0 20px 0;">

                  <p style="font-size:13px; color:#888; line-height:1.6; margin:0;">
                    If you have any questions, feel free to reply to this email. We're always happy to help! 😊
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#1a1f2e; padding:24px 40px; text-align:center;">
                  <p style="color:rgba(255,255,255,0.5); font-size:12px; margin:0 0 4px 0;">
                    © 2025 Backend Ledger. All rights reserved.
                  </p>
                  <p style="color:rgba(255,255,255,0.3); font-size:11px; margin:0;">
                    You received this email because you signed up at Backend Ledger.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}
  
async function sendTransactionEmail(userEmail, userName, amount, toAccount){
    const subject = `Transaction Completed 🎉`;
    const text = `Hey ${userName}!\n\nYour transaction of ${amount} has been completed. 
    You can view your transaction details here:\n\n${process.env.FRONTEND_URL}/transactions/$
    {toAccount}\n\nIf you have any questions, feel free to reply to this email. 
    We're always happy to help! 😊`;
    const html = `<p>Hey ${userName},</p><p>Your transaction of ${amount} has been completed. 
    You can view your transaction details here:</p><p><a href="${process.env.FRONTEND_URL}/
    transactions/${toAccount}">${process.env.FRONTEND_URL}/transactions/${toAccount}</a></p><p>
    If you have any questions, feel free to reply to this email. We're always happy to help! 
    😊</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailedEmail(userEmail, userName, amount, toAccount){
    const subject = `Transaction Failed 😔`;
    const text = ` Hey ${userName}!\n\nYour transaction of ${amount} has failed.
    You can view your transaction details here:\n\n${process.env.FRONTEND_URL}/transactions/$
    {toAccount}\n\n If you have any questions, feel free to reply to this email.
    We're always happy to help! 😊`;
    const html = `<p>Hey ${userName},</p><p>Your transaction of ${amount} has failed.
    You can view your transaction details here:</p><p><a href="${process.env.FRONTEND_URL}/
    transactions/${toAccount}">${process.env.FRONTEND_URL}/transactions/${toAccount}</a></p><p>
    If you have any questions, feel free to reply to this email. We're always happy to help! 
    😊</p>`;

    await sendEmail(userEmail, subject, text, html);
}

  module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailedEmail,
  };