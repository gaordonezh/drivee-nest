import { TemplateNamesEnum } from './template.enum';
import { TemplateFieldsDto } from './mail.dto';

export default {
  [TemplateNamesEnum.CREATE_PASSWORD](params: TemplateFieldsDto) {
    return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 50px auto; }
          h1 { color: #333; font-size: 24px; font-weight: 900; }
          h2 { color: #333; font-size: 20px; }
          p { color: #555; }
          .btn { display: inline-block; padding: 10px 20px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 2px; font-size: 14px; font-weight: 600; }
          .divider { height: 1px; background-color: #cccccc; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bienvenido a Drivee</h1>
          <h2>Creación de Contraseña</h2>
          <p>Hola ${params.name},</p>
          <p>Hemos recibido tu solicitud de creación de contraseña. Haz clic en el siguiente enlace para continuar con el proceso:</p>
          <a href="http://localhost:3000/auth/create-password?token=${params.token}&email=${params.email}" target="_blank" class="btn">Crear Contraseña</a>
          <p>Si no lo solicitaste, puedes ignorar este mensaje. El enlace caducará en 24 horas.</p>
          <div class="divider"></div>
          <p>Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
  [TemplateNamesEnum.SEND_PASSWORD_CREATED](params: TemplateFieldsDto) {
    return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 50px auto; }
          h1 { color: #333; font-size: 24px; font-weight: 900; }
          h2 { color: #333; font-size: 20px; }
          p { color: #555; }
          ul { list-style-type: square; }
          li { font-size: 14px; color: #555555 }
          .divider { height: 1px; background-color: #cccccc; }
          .mt-10 { margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bienvenido a Drivee</h1>
          <h2>Creación de Contraseña</h2>
          <p>Hola ${params.name},</p>
          <p>Hemos realizado la creación de tu cuenta mediante ${params.provider}</p>
          <p>Los acceso a tu cuenta son: </p>
          <ul>
            <li><b>Usuario:</b> ${params.email}</li>
            <li><b>Contraseña:</b> ${params.plainPassword}</li>
          </ul>
          <div class="divider"></div>
          <p class="mt-10">Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
};
