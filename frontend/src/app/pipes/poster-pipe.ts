import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'poster'
})
export class PosterPipe implements PipeTransform {

  transform(value: string | undefined): unknown {
    return value ? `https://image.tmdb.org/t/p/w500${value}` : null;
  }

}
