import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {EditorComponent} from "./editor/editor.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: EditorComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
