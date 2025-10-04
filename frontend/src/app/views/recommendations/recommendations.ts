import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Mood, Audience, Duration } from '../../interfaces/Recommendation';
import { TitleCasePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieService } from '../../services/movie-service';
import { RecommendationService } from '../../services/recommendation';
import { Spinner } from '../../shared/spinner/spinner';
import { RecommendationList } from '../recommendation-list/recommendation-list';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-recommendations',
  imports: [TitleCasePipe,ReactiveFormsModule,Spinner],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Recommendations {
  private readonly fb = inject(FormBuilder);
  readonly movieService = inject(MovieService);
  private readonly rS = inject(RecommendationService);
  private readonly dialog = inject(Dialog);
  loading = signal(false);

  moods = Object.values(Mood);
  audiences = Object.values(Audience);
  durations = Object.values(Duration);
  iaForm: FormGroup;

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
        })
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error fetching recommendations:', err);
      }
      });
    }
  }
}
