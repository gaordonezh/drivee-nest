import { TemplateNamesEnum } from './template.enum';

export type TemplateFieldsDto = Record<string, string | number>;

export class CreateUserEmailTemplateDto {
  email: Array<string>;
  subject: string;
  template: TemplateNamesEnum;
  fields: TemplateFieldsDto;
}
