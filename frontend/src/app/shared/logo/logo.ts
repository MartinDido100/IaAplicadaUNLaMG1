import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Logo {
  width = input<number>(1.2);
  height = input<number>(1.2);
  color = input<string>('var(--primary-color)');
  backgroundColor = input<string>('transparent');
}
