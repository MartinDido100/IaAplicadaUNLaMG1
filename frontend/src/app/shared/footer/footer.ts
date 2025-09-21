import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-footer',
  imports: [Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {

}
