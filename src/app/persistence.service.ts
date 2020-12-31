import {Injectable} from '@angular/core';

import firebase from "firebase/app";
import "firebase/firestore";
import {AuthService} from "./auth.service";
import {FirebaseService} from "./firebase.service";


const COLLECTION = 'notes';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private submitting = false;

  constructor(private firebaseService: FirebaseService, private authService: AuthService) {
  }

  writeNote(content: string) {
    if (this.submitting) return Promise.reject("Still submitting.");
    const db = firebase.firestore();

    this.submitting = true;
    return db.collection(COLLECTION).doc(this.authService.userSubject.getValue()?.uid).set({content})
      .finally(() => {
        this.submitting = false;
    });
  }

  getNote() {
    const db = firebase.firestore();
    return db.collection(COLLECTION).doc(this.authService.userSubject.getValue()?.uid).get();
  }
}
