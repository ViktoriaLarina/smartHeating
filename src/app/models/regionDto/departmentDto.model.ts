import { ContactDto } from './contactDto.model';

export class DepartmentDto {
  contacts: ContactDto[];
  id: number;
  title: string;
}
