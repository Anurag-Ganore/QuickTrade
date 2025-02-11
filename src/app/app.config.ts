import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getDatabase, provideDatabase } from "@angular/fire/database";  
import { routes } from './app.routes';  // ✅ Import `routes` correctly
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule


const firebaseConfig = {
  apiKey: "AIzaSyCZagEXao9eeQSR_sUy40MkaIrAjOV5D9M",
  authDomain: "angular-firebase-app-afdc8.firebaseapp.com",
  databaseURL: "https://angular-firebase-app-afdc8-default-rtdb.firebaseio.com/",
  projectId: "angular-firebase-app-afdc8",
  storageBucket: "angular-firebase-app-afdc8.firebasestorage.app",
  messagingSenderId: "849333378991",
  appId: "1:849333378991:web:d4df3ab9505422d33c195a",
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // ✅ Correct `routes` usage
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),  // ✅ Correct database service
    importProvidersFrom(FormsModule), // ✅ Add FormsModule here
    importProvidersFrom(RouterModule) // ✅ Ensure RouterModule is imported
  ],
};
