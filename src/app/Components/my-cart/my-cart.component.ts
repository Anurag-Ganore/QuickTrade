import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Database, ref, remove } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { push, set } from '@angular/fire/database'; // ✅ Import Firebase methods

@Component({
  selector: 'app-my-cart',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css'] // ✅ Fixed styleUrls array
})
export class MyCartComponent {
  isLoading : boolean = true;

    cartItems: any[] = [];
    userId: string | null = null; // Store current user ID

    constructor(private productService: ProductService, private db: Database, private auth: Auth) {}

    async ngOnInit() {
      const user = this.auth.currentUser;
      if (user) {
        this.isLoading = true; 
        this.userId = user.uid; // ✅ Store user ID
        this.cartItems = await this.productService.getMyCart(this.userId); // ✅ Fetch user's cart items
        this.isLoading = false; // Hide loader after fetching
      }
    }

    // ✅ Function to remove item from cart
    async onRemoveFromCart(productId: string) {
      if (!this.userId) return;

      const cartItemPath = `buyList/${this.userId}/${productId}`; // ✅ Correct user-specific path
      await remove(ref(this.db, cartItemPath)); // ✅ Remove item from Firebase

      // ✅ Update UI after deletion
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
    }

    async buyList(product: any) {
        if (!this.userId) {
          alert("Please log in to buy items.");
          return;
        }
    
        const cartPath = `itemsBought${this.userId}`; // ✅ Unique cart path for each user
        const cartRef = push(ref(this.db, cartPath)); // ✅ Push to Firebase
    
        await set(cartRef, product);
        alert("Product Bought");
      }
}
