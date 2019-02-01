// import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
// import {Injectable} from '@angular/core';
// import {Router} from '@angular/router';
// import 'rxjs/add/observable/throw';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/do';
// import {Observable} from 'rxjs/Observable';
// import {InteractionsService} from './interactions.service';
//
// @Injectable()
// export class ErroeResponseInterceptor implements HttpInterceptor {
//
//   constructor(private router: Router, private serviceInt: InteractionsService) {
//   }
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req)
//       .catch((err: any, caught) => {
//         if (err instanceof HttpErrorResponse) {
//           if (err.status === 401) {
//             localStorage.removeItem('token');
//             localStorage.removeItem('role');
//             this.router.navigate(['/login']);
//           } else {
//             this.serviceInt.alert.next(err.error.errorCode);
//           }
//           return Observable.throw(err);
//         }
//       });
//   }
// }
