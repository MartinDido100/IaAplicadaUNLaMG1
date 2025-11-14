import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Mood, Audience, Duration, Preference } from '../../interfaces/Recommendation';
import { TitleCasePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieService } from '../../services/movie-service';
import { RecommendationService } from '../../services/recommendation';
import { Spinner } from '../../shared/spinner/spinner';
import { RecommendationList } from '../recommendation-list/recommendation-list';
import { Dialog } from '@angular/cdk/dialog';
import { Movie } from '../../../../../api/src/models/movieInterfaces';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-recommendations',
  imports: [TitleCasePipe,ReactiveFormsModule,Spinner,TimeAgoPipe],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Recommendations implements OnInit{
  private readonly fb = inject(FormBuilder);
  readonly movieService = inject(MovieService);
  private readonly rS = inject(RecommendationService);
  private readonly dialog = inject(Dialog);
  private _snackBar = inject(MatSnackBar)
  loading = signal(false);
  showAdvancedSearch = signal(false);

  moods = Object.values(Mood);
  audiences = Object.values(Audience);
  durations = Object.values(Duration);
  iaForm: FormGroup;
  preferences = signal<Preference[]>([]);

  ngOnInit() {
    this.rS.getPreviousSelections().subscribe({
      next: (response) => {
        this.preferences.set(response[0].preferences);
      },
      error: (err) => {
        console.error('Error fetching previous selections:', err);
      }
    });
  }

  constructor() {
    this.iaForm = this.fb.group({
      textPrompt: ['', [Validators.required]],
      genres: this.fb.array([]),
      moods: this.fb.array([]),
      audiences: this.fb.array([]),
      durations: this.fb.array([]),
    });
  }

  onCheckboxChange(event: Event, controlName: string) {
    const checkbox = event.target as HTMLInputElement;
    const formArray = this.iaForm.get(controlName) as FormArray;
    if (checkbox.checked) {
      formArray.push(this.fb.control(checkbox.value));
    } else {
      const idx = formArray.controls.findIndex(x => x.value === checkbox.value);
      if (idx > -1) formArray.removeAt(idx);
    }
  }

  onSubmit() {
    if (this.iaForm.valid) {
      this.loading.set(true);
      this.rS.getRecommendations(this.iaForm.value).subscribe({
        next: (response) => {
        this.dialog.open(RecommendationList, {
          data: { recommendations: response.movies },
          width: '80%',
          maxWidth: '80rem',
        }).closed.subscribe(selectedMovie => {
          if (selectedMovie) {
            const movie = selectedMovie as Movie;
            this.rS.saveSelection(movie.id, movie.title).subscribe({
              next: () => {
                this._snackBar.open('¡Película guardada en tus selecciones!', 'Cerrar', {
                  duration: 4000,
                  panelClass: 'success-snackbar'
                });
              },
              error: (err) => {
                console.log('Error saving movie selection:', err);
                this._snackBar.open('Error al guardar la selección', '', {
                  duration: 4000,
                  panelClass: 'error-snackbar'
                });
              }
            });
          }
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error fetching recommendations:', err);
        this._snackBar.open('Error al obtener recomendaciones', 'Reintentar', {
          duration: 4000,
          panelClass: 'error-snackbar'
        });
      }
      });
    }
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch.set(!this.showAdvancedSearch());
  }
}
