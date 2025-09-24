import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { Movie } from '../../interfaces/Movie';

interface DialogData{
  recommendations: Movie[];
}

@Component({
  selector: 'app-recommendation-list',
  imports: [],
  templateUrl: './recommendation-list.html',
  styleUrl: './recommendation-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationList {
  constructor(@Inject(DIALOG_DATA) public data: DialogData) {}
}
