import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
  signOut,
  user
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth); // Firebase's built-in user observable
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  // Register new user
  register(email: string, username: string, password: string): Observable<UserCredential> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then((response) => {
      return updateProfile(response.user, { displayName: username }).then(() => response);
    });

    return from(promise);
  }

  // Login existing user
  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password);
    return from(promise);
  }

  // Logout user
  async logout(): Promise<void> {
    await signOut(this.firebaseAuth);
  }
}
