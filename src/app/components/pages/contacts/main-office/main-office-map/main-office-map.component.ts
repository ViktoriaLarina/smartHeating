import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-office-map',
  templateUrl: './main-office-map.component.html',
  styleUrls: ['./main-office-map.component.css']
})
export class MainOfficeMapComponent {

  @Input() lat: any;
  @Input() lng: any;
  @Input() card: boolean;

  constructor() {
  }
}
