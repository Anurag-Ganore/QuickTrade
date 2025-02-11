import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject, map } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth); // Firebase's built-in user observable
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  private authState = new BehaviorSubject<User | null>(null); // Track user state
  authState$ = this.authState.asObservable(); // Expose as observable for components

  constructor() {
    this.user$.subscribe((user) => {
      this.authState.next(user); // Update user state when Firebase detects a change
    });
  }

  // Register new user
  register(email: string, username: string, password: string): Observable<UserCredential> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then((response) => {
      return updateProfile(response.user, { displayName: username }).then(() => {
        this.authState.next(response.user); // Update state on registration
        return response;
      });
    });

    return from(promise);
  }

  // Login existing user
  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then((response) => {
      this.authState.next(response.user); // Update state on login
      return response;
    });

    return from(promise);
  }

  // Logout user
  async logout(): Promise<void> {
    await signOut(this.firebaseAuth);
    this.authState.next(null); // Reset auth state on logout
  }

  // Check if user is logged in
  isLoggedIn(): Observable<boolean> {
    return this.authState$.pipe(map((user) => !!user));
  }
}
