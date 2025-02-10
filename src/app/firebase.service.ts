import { Injectable } from '@angular/core';
import { Database, ref, set, get, child } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private db: Database) {}

  // Save user data
  saveUser(uid: string, email: string, username: string): Promise<void> {
    return set(ref(this.db, `users/${uid}`), { email, username });
  }

  // Get user data
  getUser(uid: string): Observable<any> {
    const userRef = ref(this.db, `users/${uid}`);
    return from(get(userRef).then((snapshot) => snapshot.val())); // Convert to observable
  }
}
