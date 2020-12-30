import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EditorComponent } from './editor/editor.component';
import {FirebaseService} from "./firebase.service";
import {AuthService} from "./auth.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [FirebaseService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
