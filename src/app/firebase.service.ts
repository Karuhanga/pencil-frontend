import {Injectable} from '@angular/core';

import firebase from "firebase/app";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBmnirWvenJRjjPqwc2gUy8NzuYrpJVT-E",
  authDomain: "lk-pencil-frontend.firebaseapp.com",
  projectId: "lk-pencil-frontend",
  storageBucket: "lk-pencil-frontend.appspot.com",
  messagingSenderId: "1032853986588",
  appId: "1:1032853986588:web:4bd758747b4ed5d25aaed9",
  // measurementId: "G-WSR161WWJF"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}
