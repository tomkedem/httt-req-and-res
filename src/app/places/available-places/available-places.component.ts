import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private htttClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)


  // constructor(){}
  ngOnInit(){
    this.isFetching.set(true);
    const subsciption = this.htttClient
    .get<{places: Place[]}>('http://localhost:3000/places')
    .pipe(
      map((resData) => resData.places), 
      catchError((error) => {
        console.log(error);
        return throwError(
          () => 
          new Error(
            'Something went wrong fetching the available places. Please try again later.'
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

  onSelectPlace(selectedPlace: Place){
    this.htttClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id
    }).subscribe({
      next: (resData) => console.log(resData),
    });
  }
}
