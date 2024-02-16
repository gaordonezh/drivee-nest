import { TemplateNamesEnum } from './template.enum';
import { TemplateFieldsDto } from './mail.dto';
import { DOCUMENT_TYPES_TRANSLATE, DocumentStatusEnum, DocumentTypesEnum } from 'src/documents/documents.enum';
import { getDateString } from 'src/utils/functions';

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
          <a href="https://drivee.aldo.codes/auth/create-password?token=${params.token}&email=${params.email}&action=${params.action}" target="_blank" class="btn">Crear Contraseña</a>
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
  [TemplateNamesEnum.REVIEW_DOCUMENT](params: TemplateFieldsDto) {
    const texts = {
      [DocumentStatusEnum.PENDING]: {
        title: 'Documento pendiente',
        subtitle: 'Documento pendiente',
      },
      [DocumentStatusEnum.REVIEW]: {
        title: '¡Tus documento esta siendo revisado!',
        subtitle: `Recibimos tu solicitud de revisón de documentos y te volveremos a informar cuando tu documento finalice el proceso. 🚀`,
      },
      [DocumentStatusEnum.APPROVED]: {
        title: '¡Tu documento fue APROBADO!',
        subtitle: `Ahora podrás continuar con el proceso de publicación de tu vehículo.`,
      },
      [DocumentStatusEnum.REJECTED]: {
        title: '¡Tu documento fue RECHAZADO!',
        subtitle: `Lamentablemente no cumple con los requisitos establecidos. Puedes volver a adjuntar tu documento para volver a iniciar el proceso de revisión.`,
      },
    };

    const document = Array.isArray(params.documents)
      ? params.documents.map((item) => DOCUMENT_TYPES_TRANSLATE[item]).join(' - ')
      : DOCUMENT_TYPES_TRANSLATE[params.type as DocumentTypesEnum];

    const newParams = {
      ...texts[params.status as DocumentStatusEnum],
      name: params.name,
      document,
      comment: params.comment,
    };

    return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <style>
          * { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 50px auto; }
          h1 { color: #333; font-size: 24px; font-weight: 900; }
          h2 { color: #333; font-size: 20px; }
          p { color: #555; }
          .divider { height: 1px; background-color: #dddddd; }
          .mx-10 { margin-top: 10px; margin-bottom: 10px; }
          .comment { margin-top: 10px; border-left: 5px solid #dddddd; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-style: italic; font-size: 14px; color: #757575 }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Revisión de documentos</h1>
          <h2 class="mx-10">Hola ${newParams.name}</h2>
          <p class="mx-10">Documento(s): <b>${newParams.document}</b></p>
          <p>${newParams.title}</p>
          <p>${newParams.subtitle}</p>

          <p class="comment">${newParams.comment}</p>
          <div class="divider"></div>
          <p class="mx-10">Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
  [TemplateNamesEnum.PAYMENT_RENT_CAR](params: TemplateFieldsDto) {
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
          .divider { height: 1px; background-color: #cccccc; }
          .mt-10 { margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>¡ES HOY!</h1>
          <h2>Tienes una reservación de ${params.vehicle}</h2>
          <p>Hola ${params.name},</p>
          <p>Recuerda que tienes que coordinar el pago del alquiler con el dueño del vehículo antes de iniciar. El pago puedes realizarlo directamente con el dueño o mediante nuestro sistema de pago ingresando a <a href="https://drivee.aldo.codes/dashboard/orders">tus rentas</a>.</p>
          <p>Puedes obtener mas detalles de la reserva ingresando a los detalles de la reservación.</p>
          <div class="divider"></div>
          <p class="mt-10">Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
  [TemplateNamesEnum.PENDING_RENT_CAR](params: TemplateFieldsDto) {
    const startDate = getDateString(String(params.from));
    const endDate = getDateString(String(params.to));

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
          <h1>Tienes una reservación de ${params.vehicle}</h1>
          <p>Hemos realizado la solicitud de la reservación del vehículo ${params.vehicle}</p>
          <ul>
            <li><b>Inicio:</b> ${startDate}</li>
            <li><b>Fin:</b> ${endDate}</li>
            <li><b>Horas:</b> ${params.hours} hrs.</li>
            <li><b>Total:</b> S/ ${params.total}</li>
          </ul>
          <p>Puedes realizar la gestión de la reserva en tu <a href="https://drivee.aldo.codes/dashboard">panel de control</a>.</p>
          <div class="divider"></div>
          <p class="mt-10">Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
  [TemplateNamesEnum.REJECTED_RENT_CAR](params: TemplateFieldsDto) {
    return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <style>
          * { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 50px auto; }
          h1 { color: #333; font-size: 24px; font-weight: 900; }
          h2 { color: #333; font-size: 20px; }
          p { color: #555; }
          .divider { height: 1px; background-color: #dddddd; }
          .mx-10 { margin-top: 10px; margin-bottom: 10px; }
          .comment { margin-top: 10px; border-left: 5px solid #dddddd; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-style: italic; font-size: 14px; color: #757575 }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>La solicitud fue rechazada.</h1>
          <h2 class="mx-10">Hola ${params.name},</h2>
          <p class="mx-10">Lamentamos informar que tu solicitud de reserva para ${params.vehicle} fue rechazada.</p>
          <p class="comment">${params.comment}</p>
          <div class="divider"></div>
          <p class="mx-10">Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
  [TemplateNamesEnum.APPROVED_RENT_CAR](params: TemplateFieldsDto) {
    const startDate = getDateString(String(params.from));
    const endDate = getDateString(String(params.to));

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
          .divider { height: 1px; background-color: #dddddd; }
          .mx-10 { margin-top: 10px; margin-bottom: 10px; }
          .comment { margin-top: 10px; border-left: 5px solid #dddddd; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-style: italic; font-size: 14px; color: #757575 }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>La solicitud fue aprobada y confirmada</h1>
          <h2 class="mx-10">Hola ${params.name},</h2>
          <p class="mx-10">Tu solicitud de reserva para ${params.vehicle} fue aprovada.</p>
          <p class="mx-10">Recuerda que la renta comienza el <b>${startDate}</b> hasta <b>${endDate}</b>.</p>
          <p class="comment">${params.comment}</p>
          <div class="divider"></div>
          <p class="mx-10">Equipo de <b>Drivee</b> ❤️</p>
        </div>
      </body>
    </html>
    `;
  },
};
