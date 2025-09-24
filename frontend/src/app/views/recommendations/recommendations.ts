import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
export class Recommendations  implements OnInit{
  private readonly fb = inject(FormBuilder);
  readonly movieService = inject(MovieService);
  private readonly rS = inject(RecommendationService);
  private readonly dialog = inject(Dialog);
  loading = signal(false);

  moods = Object.values(Mood);
  audiences = Object.values(Audience);
  durations = Object.values(Duration);
  iaForm: FormGroup;

  ngOnInit(): void {
    this.dialog.open(RecommendationList,{
      data: { recommendations: [{
            "adult": false,
            "backdrop_path": "/dMZxEdrWIzUmUoOz2zvmFuutbj7.jpg",
            "belongs_to_collection": null,
            "budget": 0,
            "genres": [],
            "homepage": "",
            "id": 1891,
            "imdb_id": "",
            "origin_country": [],
            "original_language": "en",
            "original_title": "The Empire Strikes Back",
            "overview": "The epic saga continues as Luke Skywalker, in hopes of defeating the evil Galactic Empire, learns the ways of the Jedi from aging master Yoda. But Darth Vader is more determined than ever to capture Luke. Meanwhile, rebel leader Princess Leia, cocky Han Solo, Chewbacca, and droids C-3PO and R2-D2 are thrown into various stages of capture, betrayal and despair.",
            "popularity": 6.6001,
            "poster_path": "/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg",
            "production_companies": [],
            "production_countries": [],
            "release_date": "1980-05-20",
            "revenue": 0,
            "runtime": 0,
            "spoken_languages": [],
            "status": "",
            "tagline": "",
            "title": "The Empire Strikes Back",
            "video": false,
            "vote_average": 8.395,
            "vote_count": 17694
        },
        {
            "adult": false,
            "backdrop_path": "/2w4xG178RpB4MDAIfTkqAuSJzec.jpg",
            "belongs_to_collection": null,
            "budget": 0,
            "genres": [],
            "homepage": "",
            "id": 11,
            "imdb_id": "",
            "origin_country": [],
            "original_language": "en",
            "original_title": "Star Wars",
            "overview": "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
            "popularity": 16.0366,
            "poster_path": "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
            "production_companies": [],
            "production_countries": [],
            "release_date": "1977-05-25",
            "revenue": 0,
            "runtime": 0,
            "spoken_languages": [],
            "status": "",
            "tagline": "",
            "title": "Star Wars",
            "video": false,
            "vote_average": 8.2,
            "vote_count": 21501
        },
        {
            "adult": false,
            "backdrop_path": "/r2IOBOeg5wLfLtyOnT5Pur6Tl4q.jpg",
            "belongs_to_collection": null,
            "budget": 0,
            "genres": [],
            "homepage": "",
            "id": 1892,
            "imdb_id": "",
            "origin_country": [],
            "original_language": "en",
            "original_title": "Return of the Jedi",
            "overview": "Luke Skywalker leads a mission to rescue his friend Han Solo from the clutches of Jabba the Hutt, while the Emperor seeks to destroy the Rebellion once and for all with a second dreaded Death Star.",
            "popularity": 6.6086,
            "poster_path": "/jQYlydvHm3kUix1f8prMucrplhm.jpg",
            "production_companies": [],
            "production_countries": [],
            "release_date": "1983-05-25",
            "revenue": 0,
            "runtime": 0,
            "spoken_languages": [],
            "status": "",
            "tagline": "",
            "title": "Return of the Jedi",
            "video": false,
            "vote_average": 7.904,
            "vote_count": 16320
        },
        {
            "adult": false,
            "backdrop_path": "/8BTsTfln4jlQrLXUBquXJ0ASQy9.jpg",
            "belongs_to_collection": null,
            "budget": 0,
            "genres": [],
            "homepage": "",
            "id": 140607,
            "imdb_id": "",
            "origin_country": [],
            "original_language": "en",
            "original_title": "Star Wars: The Force Awakens",
            "overview": "Thirty years after defeating the Galactic Empire, Han Solo and his allies face a new threat from the evil Kylo Ren and his army of Stormtroopers.",
            "popularity": 10.6318,
            "poster_path": "/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg",
            "production_companies": [],
            "production_countries": [],
            "release_date": "2015-12-15",
            "revenue": 0,
            "runtime": 0,
            "spoken_languages": [],
            "status": "",
            "tagline": "",
            "title": "Star Wars: The Force Awakens",
            "video": false,
            "vote_average": 7.3,
            "vote_count": 19969
        },
        {
            "adult": false,
            "backdrop_path": "/6t8ES1d12OzWyCGxBeDYLHoaDrT.jpg",
            "belongs_to_collection": null,
            "budget": 0,
            "genres": [],
            "homepage": "",
            "id": 330459,
            "imdb_id": "",
            "origin_country": [],
            "original_language": "en",
            "original_title": "Rogue One: A Star Wars Story",
            "overview": "A rogue band of resistance fighters unite for a mission to steal the Death Star plans and bring a new hope to the galaxy.",
            "popularity": 6.8324,
            "poster_path": "/i0yw1mFbB7sNGHCs7EXZPzFkdA1.jpg",
            "production_companies": [],
            "production_countries": [],
            "release_date": "2016-12-14",
            "revenue": 0,
            "runtime": 0,
            "spoken_languages": [],
            "status": "",
            "tagline": "",
            "title": "Rogue One: A Star Wars Story",
            "video": false,
            "vote_average": 7.501,
            "vote_count": 15871
        }],
      },
      width: '80%',
      maxWidth: '60rem',
      height: 'auto',
    })
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
          maxWidth: '50rem',
          height: 'auto',
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
