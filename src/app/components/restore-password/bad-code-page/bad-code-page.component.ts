import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bad-code-page',
  templateUrl: './bad-code-page.component.html',
  styleUrls: ['./bad-code-page.component.css']
})
export class BadCodePageComponent{
  constructor(private router: Router) {}

  toLoginPage() {
    this.router.navigate(['/login']);
  }
  toForgotPage() {
    this.router.navigate(['/login']);
  }
}
