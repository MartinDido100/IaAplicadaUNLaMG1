import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'poster',
  standalone: true
})
export class PosterPipe implements PipeTransform {

  transform(value: string | undefined): string {
    const imageBaseUrl = environment.imageBaseUrl;
    const defaultImage = '/assets/images/no-poster.svg'; // Imagen por defecto
    return value ? `${imageBaseUrl}${value}` : defaultImage;
  }

}
