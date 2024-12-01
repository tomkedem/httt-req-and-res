import { Component, input, OnInit, output } from '@angular/core';

import { Place } from './place.model';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent implements OnInit {
  places = input.required<Place[]>();
  selectPlace = output<Place>();
  ngOnInit(): void {
    console.log('Hi Tomer',this.places.length);
  }


  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }
}
