import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-items',
  templateUrl: './admin-items.component.html',
})
export class AdminItemsComponent implements OnInit {

  constructor(public rout: Router) {
  }

  ngOnInit() {
  }

}
