import { DepartmentDto } from './departmentDto.model';

export class OfficeDto {
  dayOffs: string;
  departments: DepartmentDto[];
  id: number;
  latitude: number;
  longitude: number;
  main: boolean;
  title: string;
  workingHours: string;
}
