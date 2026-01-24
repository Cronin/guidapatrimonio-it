import { NextRequest, NextResponse } from 'next/server';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.bord.dev';
const ADMIN_EMAIL = 'info@guidapatrimonio.it';
const COPY_EMAIL = '24prontocom@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, telefono, patrimonio, messaggio } = body;

    // Validate required fields
    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e email sono obbligatori' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato email non valido' },
        { status: 400 }
      );
    }

    if (!MAILGUN_API_KEY) {
      console.error('MAILGUN_API_KEY not configured');
      return NextResponse.json(
        { error: 'Errore di configurazione server' },
        { status: 500 }
      );
    }

    // Prepare email content
    const emailSubject = `Nuova richiesta consulenza da ${nome} - Guida Patrimonio`;
    const emailBody = `
NUOVA RICHIESTA CONSULENZA PATRIMONIALE

Da: ${nome}
Email: ${email}
Telefono: ${telefono || 'Non fornito'}
Patrimonio: ${patrimonio || 'Non specificato'}

Messaggio:
${messaggio || 'Nessun messaggio aggiuntivo'}

---
Inviato dal form di contatto su guidapatrimonio.it
    `.trim();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a3c34; color: #fff; padding: 20px; text-align: center; }
    .header h2 { margin: 0; color: #c9a227; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #1a3c34; }
    .value { margin-top: 5px; }
    .message { background: #fff; padding: 15px; border-left: 3px solid #c9a227; }
    .patrimonio { background: #c9a227; color: #1a3c34; padding: 8px 15px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .footer { padding: 15px; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Nuova Richiesta Consulenza</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Nome:</div>
        <div class="value">${nome}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">Telefono:</div>
        <div class="value">${telefono ? `<a href="tel:${telefono}">${telefono}</a>` : 'Non fornito'}</div>
      </div>
      <div class="field">
        <div class="label">Patrimonio da gestire:</div>
        <div class="value">${patrimonio ? `<span class="patrimonio">${patrimonio}</span>` : 'Non specificato'}</div>
      </div>
      ${messaggio ? `
      <div class="field">
        <div class="label">Messaggio:</div>
        <div class="message">${messaggio.replace(/\n/g, '<br>')}</div>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      Inviato dal form di contatto su guidapatrimonio.it
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send via Mailgun API
    const formData = new FormData();
    formData.append('from', `Guida Patrimonio <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', ADMIN_EMAIL);
    formData.append('cc', COPY_EMAIL);
    formData.append('subject', emailSubject);
    formData.append('text', emailBody);
    formData.append('html', htmlBody);
    formData.append('h:Reply-To', email);

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mailgun error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Errore invio email. Riprova o contattaci.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Richiesta inviata con successo. Ti contatteremo entro 24 ore.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Errore del server. Riprova o contattaci.' },
      { status: 500 }
    );
  }
}
