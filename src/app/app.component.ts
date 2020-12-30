import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pencil-frontend';
  userSubjectSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userSubjectSubscription = this.authService.userSubject.subscribe(user => {
      if (user) this.router.navigate(['']);
      else this.router.navigate(['login']);
    })
  }

  ngOnDestroy() {
    this.userSubjectSubscription && this.userSubjectSubscription.unsubscribe();
  }
}
