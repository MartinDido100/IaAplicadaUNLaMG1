import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Mood, Audience, Duration } from '../../interfaces/Recommendation';
import { TitleCasePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-recommendations',
  imports: [TitleCasePipe,ReactiveFormsModule],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Recommendations {
  private readonly fb = inject(FormBuilder);
  readonly movieService = inject(MovieService);

  moods = Object.values(Mood);
  audiences = Object.values(Audience);
  durations = Object.values(Duration);
  iaForm: FormGroup;

  constructor() {
    this.iaForm = this.fb.group({
      textPrompt: [''],
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
      console.log(this.iaForm.value);
    }
  }
}
