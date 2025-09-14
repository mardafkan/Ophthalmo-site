
const nodemailer = require('nodemailer');

// Expect env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ORDER_TO
// Fallback TO so site works out of the box (replace later in dashboard)
const ORDER_TO = process.env.ORDER_TO || 'sales@example.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { product, name, contact, message } = req.body || {};
  if (!name || !contact) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `OphthalmoTrade <${process.env.SMTP_USER}>`,
      to: ORDER_TO,
      subject: 'Новая заявка с сайта',
      text: `Товар: ${product || '-'}\nИмя: ${name}\nКонтакт: ${contact}\нСообщение: ${message || '-'}`,
      html: `<b>Товар:</b> ${product || '-'}<br>
             <b>Имя:</b> ${name}<br>
             <b>Контакт:</b> ${contact}<br>
             <b>Сообщение:</b> ${message || '-'}`
    });

    return res.status(200).json({ ok: true, id: info.messageId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
