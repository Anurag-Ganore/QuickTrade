import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Database } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-items-bought',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './items-bought.component.html',
  styleUrl: './items-bought.component.css'
})
export class ItemsBoughtComponent {
  isLoading : boolean = true;

  itemsBought: any[] = [];
      userId: string | null = null; // Store current user ID
      constructor(private productService: ProductService, private db: Database, private auth: Auth) {} // ✅ Inject Database & Auth
    
      async ngOnInit() {
        // this.products = await this.productService.getProducts(); // ✅ Load products
        
        const user = this.auth.currentUser;
        if (user) {
          this.isLoading = true; 
          this.userId = user.uid; // ✅ Store user ID
          this.itemsBought = await this.productService.getMyItemsBought(this.userId); // ✅ Fetch user's cart items
          this.isLoading = false;
        }
      }

}
