import { Injectable } from '@angular/core';

import firebase from "firebase/app";
import "firebase/firestore";
import {AuthService} from "./auth.service";
import {FirebaseService} from "./firebase.service";


const COLLECTION = 'notes';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }

  writeNote(content: string) {
    const db = firebase.firestore();
    return db.collection(COLLECTION).doc(this.authService.userSubject.getValue()?.uid).set({
      content,
    });
  }

  getNote() {
    const db = firebase.firestore();
    return db.collection(COLLECTION).doc(this.authService.userSubject.getValue()?.uid).get();
  }
}
