import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private htttClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)


  ngOnInit(){
    this.isFetching.set(true);
    const subsciption = this.htttClient
    .get<{places: Place[]}>('http://localhost:3000/user-places')
    .pipe(
      map((resData) => resData.places), 
      catchError((error) => {
        console.log(error);
        return throwError(
          () => 
          new Error(
            'Something went wrong fetching the favorite places. Please try again later.'
          )
        );
      })
    )
    .subscribe({
      next: (places) => {            
        this.places.set(places)       
      },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() =>{
      subsciption.unsubscribe();
    });
  }
}
