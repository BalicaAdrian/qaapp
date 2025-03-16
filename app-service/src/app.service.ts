import { HttpStatus, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';

@Injectable()
export class AppService {
  public  handleMicroserviceRequest<T>(observable: Observable<T>, errorMessage: string): Promise<T | any> {
    return firstValueFrom(observable.pipe(
      catchError(err => {
        console.log("erroare", err, err.response)
        return of({
          status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message || 'Internal Server Error',
          error: err.error || 'Internal Server Error',
        })
      }) 
    ));
  }
}
