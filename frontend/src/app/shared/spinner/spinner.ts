import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Spinner {
 width = input<number>(120);
 height = input<number>(120);
}
