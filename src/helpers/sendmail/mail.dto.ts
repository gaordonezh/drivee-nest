import { TemplateNamesEnum } from './template.enum';

export type TemplateFieldsDto = Record<string, string | number | Array<string>>;

export class CreateUserEmailTemplateDto {
  email: Array<string>;
  subject: string;
  template: TemplateNamesEnum;
  fields: TemplateFieldsDto;
}
