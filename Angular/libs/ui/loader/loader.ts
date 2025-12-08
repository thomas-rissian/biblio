import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
})
export class Loader {
  isLoading: boolean = false;
  constructor(private cd: ChangeDetectorRef) {}
  
  show() {
    this.isLoading = true;
    try { this.cd.detectChanges(); } catch (e) {}

  }

  hide() {
    this.isLoading = false;
    try { this.cd.detectChanges(); } catch (e) {}
  }
}
