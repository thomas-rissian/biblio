import { CategoryDto, CategoryModel } from './category.model';
import { AuthorDto, AuthorModel } from './author.model';

export interface BookDto {
  id?: number;
  title: string;
  authorId: number;
  publicationDate?: string | null;
  description?: string;
  categoryIds?: number[];
}

export class BookModel {
  id: number | null;
  title: string;
  authorId: number | null;
  publicationDate: Date | null;
  description: string;
  categoryIds: number[];
  // optional relational fields
  categories?: CategoryModel[];
  author?: AuthorModel | null;

  constructor(data?: Partial<BookDto> & { categories?: CategoryDto[]; author?: AuthorDto }) {
    this.id = data && data.id !== undefined ? Number(data.id) : null;
    this.title = data?.title ?? '';
    this.authorId = data && data.authorId !== undefined ? Number(data.authorId) : null;
    const p = (data as any)?.publicationDate;
    this.publicationDate = p ? (p instanceof Date ? p : new Date(p)) : null;
    this.description = data?.description ?? '';
    if (Array.isArray(data?.categoryIds)) {
      this.categoryIds = data!.categoryIds!.map(id => Number(id));
    } else if (Array.isArray((data as any)?.categories)) {
      this.categoryIds = (data as any).categories.map((c: any) => Number(c.id));
    } else {
      this.categoryIds = [];
    }

    if ((data as any)?.categories) {
      this.categories = (data as any).categories.map((c: CategoryDto) => new CategoryModel(c));
    }

    if ((data as any)?.author) {
      this.author = new AuthorModel((data as any).author);
    }
  }

  toDto(includeId = true): BookDto {
    const dto: BookDto = {
      title: this.title,
      authorId: this.authorId ?? 0,
      publicationDate: this.publicationDate ? this.publicationDate.toISOString() : null,
      description: this.description,
      categoryIds: this.categoryIds,
    };
    if (includeId && this.id !== null) dto.id = this.id;
    return dto;
  }

  static fromDto(dto: BookDto & { categories?: CategoryDto[]; author?: AuthorDto }): BookModel {
    return new BookModel(dto);
  }
}
