export interface AppErrorDto {
  message: string;
  statusCode?: number;
  errors?: Record<string, string> | string[];
}

export class AppErrorModel implements AppErrorDto {
  message: string;
  statusCode?: number;
  errors?: Record<string, string> | string[];

  constructor(data?: Partial<AppErrorDto>) {
    this.message = data?.message ?? 'Error';
    this.statusCode = data?.statusCode;
    this.errors = data?.errors;
  }

  static fromDto(dto: AppErrorDto): AppErrorModel {
    return new AppErrorModel(dto);
  }
}
