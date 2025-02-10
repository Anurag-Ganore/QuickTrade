import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  firebaseService = inject(FirebaseService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage: string | null = null;
  registeredUser: { email: string; username: string } | null = null;  // Store user data

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
  
    this.authService.register(rawForm.email, rawForm.username, rawForm.password).subscribe({
      next: (userCredential) => {
        const uid = userCredential.user.uid;  // Fix: Extract UID from UserCredential
  
        // Save user details to Firebase
        this.firebaseService.saveUser(uid, rawForm.email, rawForm.username)
          .then(() => {
            console.log("User saved to Firebase");
  
            // Fetch user data after saving
            this.firebaseService.getUser(uid).subscribe((userData) => {
              if (userData) {
                this.registeredUser = userData;  // Store retrieved data
              }
            });
  
            this.router.navigateByUrl('/');
          })
          .catch((err) => console.error("Error saving user:", err));
      },
  
      error: (err) => {
        this.errorMessage = err.code;
      },
    });
  
    console.log("email:", rawForm.email);
    console.log("username:", rawForm.username);
  }
  navigateTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }
  
}
