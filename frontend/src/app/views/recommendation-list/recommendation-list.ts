import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { Movie } from '../../interfaces/Movie';
import { PosterPipe } from '../../pipes/poster-pipe';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MovieService } from '../../services/movie-service';

interface DialogData{
  recommendations: Movie[];
}

@Component({
  selector: 'app-recommendation-list',
  imports: [PosterPipe,DatePipe,TitleCasePipe],
  templateUrl: './recommendation-list.html',
  styleUrl: './recommendation-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationList {
  readonly movieService = inject(MovieService);

  constructor(@Inject(DIALOG_DATA) public data: DialogData) {
    console.log(data);
  }

  getGenres(genreIds: number[] | undefined) {
    if (!genreIds) return [];
    return this.movieService.genres().filter(genre => genreIds.includes(genre.id));
  }
}
