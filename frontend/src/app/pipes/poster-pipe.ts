import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'poster'
})
export class PosterPipe implements PipeTransform {

  transform(value: string | undefined): unknown {
    const imageBaseUrl = environment.imageBaseUrl;
    return value ? `${imageBaseUrl}${value}` : null;
  }

}
