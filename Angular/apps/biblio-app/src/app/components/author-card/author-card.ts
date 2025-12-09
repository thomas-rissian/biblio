import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-author-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './author-card.html',
})


export class AuthorCard {
  @Input() name: string | undefined;
  @Input() birthDate: string | Date | null | undefined;
  @Input() deathDate: string | Date | null | undefined;
  @Input() id?: number | null;

}