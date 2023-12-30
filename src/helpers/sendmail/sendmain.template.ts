import { TemplateNamesEnum } from './template.enum';
import { TemplateFieldsDto } from './mail.dto';

export default {
  [TemplateNamesEnum.CREATE_PASSWORD](params: TemplateFieldsDto) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recuperación de Contraseña</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #ffffff; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important; border-radius: 5px; }
          h1 { color: #333; font-size: 24px; font-weight: 900; }
          h2 { color: #333; font-size: 20px; }
          p { color: #555; }
          .btn { display: inline-block; padding: 10px 20px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 2px; font-size: 14px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bienvenido a Drivee</h1>
          <h2>Creación de Contraseña</h2>
          <p>Hola ${params.name},</p>
          <p>Hemos recibido tu solicitud de creación de contraseña. Haz clic en el siguiente enlace para continuar con el proceso:</p>
          <a href="http://localhost:3000/auth/create-password?token=${params.token}&email=${params.email}" target="_blank" class="btn">Crear Contraseña</a>
          <p>Si no has solicitado este cambio, puedes ignorar este mensaje. El enlace caducará en 24 horas.</p>
          <p>Gracias,<br />Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
};
