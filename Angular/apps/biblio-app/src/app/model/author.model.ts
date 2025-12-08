export interface AuthorDto {
  id?: number;
  name: string;
  birthDate?: string | null;
  deathDate?: string | null;
  biography?: string;
}

export class AuthorModel {
  id: number | null;
  name: string;
  birthDate: Date | null;
  deathDate: Date | null;
  biography: string;

  constructor(data?: Partial<AuthorDto> | Partial<AuthorModel>) {
    this.id = data && data.id !== undefined ? Number(data.id) : null;
    this.name = (data as any)?.name ?? '';
    const b = (data as any)?.birthDate;
    const d = (data as any)?.deathDate;
    this.birthDate = b ? (b instanceof Date ? b : new Date(b)) : null;
    this.deathDate = d ? (d instanceof Date ? d : new Date(d)) : null;
    this.biography = (data as any)?.biography ?? '';
  }

  toDto(includeId = true): AuthorDto {
    const dto: AuthorDto = {
      name: this.name,
      birthDate: this.birthDate ? this.birthDate.toISOString() : null,
      deathDate: this.deathDate ? this.deathDate.toISOString() : null,
      biography: this.biography,
    };
    if (includeId && this.id !== null) dto.id = this.id;
    return dto;
  }

  static fromDto(dto: AuthorDto): AuthorModel {
    return new AuthorModel(dto);
  }
}
