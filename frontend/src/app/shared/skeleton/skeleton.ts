import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div 
      class="skeleton" 
      [style.width]="width" 
      [style.height]="height"
      [style.border-radius]="borderRadius">
    </div>
  `,
  styleUrl: './skeleton.scss'
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() borderRadius: string = '4px';
}