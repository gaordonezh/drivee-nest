export enum DocumentTypesEnum {
  IDENTIFICATION_CARD = 'IDENTIFICATION_CARD',
  SOAT = 'SOAT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  OWNERSHIP_CARD = 'OWNERSHIP_CARD',
  POLARIZED_GLASS = 'POLARIZED_GLASS',
  TECHNICAL_INSPECTION = 'TECHNICAL_INSPECTION',
}

export enum DocumentStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVIEW = 'review',
}

export enum DocumentPopulateEnum {
  USER = 'user',
  VEHICLE = 'vehicle',
}

export const DOCUMENT_TYPES_TRANSLATE = {
  [DocumentTypesEnum.IDENTIFICATION_CARD]: 'Documento de identificación',
  [DocumentTypesEnum.SOAT]: 'SOAT',
  [DocumentTypesEnum.DRIVER_LICENSE]: 'Licencia de conducir',
  [DocumentTypesEnum.OWNERSHIP_CARD]: 'Tarjeta de propiedad',
  [DocumentTypesEnum.TECHNICAL_INSPECTION]: 'Inspección técnica',
  [DocumentTypesEnum.POLARIZED_GLASS]: 'Autorización para vidrio polarizado',
};
