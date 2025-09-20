import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Movie } from '../../interfaces/Movie';
import { DatePipe } from '@angular/common';

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
  genres = ["Action", "Drama", "Comedy"];
}
