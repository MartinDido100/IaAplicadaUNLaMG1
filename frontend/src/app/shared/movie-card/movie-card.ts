import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Genre, Movie } from '../../interfaces/Movie';
import { DatePipe } from '@angular/common';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-movie-card',
  imports: [DatePipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MovieCard {
  movie = input<Movie>();
  private readonly movieService = inject(MovieService);

  getGenres(genreIds: number[] | undefined) {
    if (!genreIds) return [];
    return this.movieService.genres().filter(genre => genreIds.includes(genre.id));
  }

}
