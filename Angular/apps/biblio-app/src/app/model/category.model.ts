export interface CategoryDto {
  id?: number;
  name: string;
}

export class CategoryModel {
  id: number | null;
  name: string;

  constructor(data?: Partial<CategoryDto>) {
    this.id = data && data.id !== undefined ? Number(data.id) : null;
    this.name = data?.name ?? '';
  }

  toDto(includeId = true): CategoryDto {
    const dto: CategoryDto = { name: this.name };
    if (includeId && this.id !== null) dto.id = this.id;
    return dto;
  }

  static fromDto(dto: CategoryDto): CategoryModel {
    return new CategoryModel(dto);
  }
}
