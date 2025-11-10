import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild, computed } from '@angular/core';
import { MovieCard } from '../../shared/movie-card/movie-card';
import { SkeletonComponent } from '../../shared/skeleton/skeleton';
import { Movie } from '../../interfaces/Movie';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-catalog',
  imports: [MovieCard, SkeletonComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Catalog implements OnInit{
  @ViewChild('genreSelect') genreSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('yearSelect') yearSelect!: ElementRef<HTMLSelectElement>;
  mS = inject(MovieService);
  movies = signal<Movie[]>([]);
  currentPage = signal(1);
  totalResults = signal(0);
  isLoading = signal(false);
  totalPages = computed(() => Math.min(Math.ceil(this.totalResults() / 20), 500));

  hasActiveFilters = false;

  ngOnInit() {
    this.loadMovies(1);
  }

  loadMovies(page: number, genreId?: number, year?: number) {
    this.isLoading.set(true);
    this.mS.getMovieList(page, genreId, year).subscribe({
      next: (res) => {
        this.movies.set(res.results);
        this.totalResults.set(res.total_results);
        this.currentPage.set(res.page);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number | string) {
    if (typeof page === 'string') return;
    
    // Limitar la página máxima a 500 (límite de la API)
    const maxPage = Math.min(this.totalPages(), 500);
    
    if (page >= 1 && page <= maxPage) {
      this.loadMovies(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getVisiblePages(): (number | string)[] {
    const current = this.currentPage();
    const total = this.totalPages();
    
    if (total <= 7) {
      // Si hay 7 páginas o menos, mostrar todas
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    if (current <= 5) {
      // Mostrar páginas 1-5, puntos, última
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else {
      // Mostrar primera, puntos, últimas 5 páginas
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    }

    return pages;
  }

  applyFilters() {
    const genreValue = this.genreSelect.nativeElement.value;
    const yearValue = this.yearSelect.nativeElement.value;
    
    this.hasActiveFilters = !!(genreValue || yearValue);
    
    if (this.hasActiveFilters) {
      this.loadMovies(1, genreValue ? Number(genreValue) : undefined, yearValue ? Number(yearValue) : undefined);
    }
  }

  clearFilters() {
    this.genreSelect.nativeElement.value = '';
    this.yearSelect.nativeElement.value = '';
    
    this.hasActiveFilters = false;
    
    // Recargar películas sin filtros desde página 1
    this.loadMovies(1);
    console.log('Filtros limpiados');
  }
}
