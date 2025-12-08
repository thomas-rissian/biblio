import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: "./footer.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer { 
  @Input() projectName: string = 'MyProject';
  currentYear: number = new Date().getFullYear();
}
