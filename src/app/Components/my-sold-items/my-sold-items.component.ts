import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Database, get, ref, remove } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { ProductService } from '../services/product.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-my-sold-items',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './my-sold-items.component.html',
  styleUrl: './my-sold-items.component.css',
})
export class MySoldItemsComponent {
  isLoading : boolean = true
  mySoldItems: any[] = [];
  userId: string | null = null; // Store current user ID
  
  constructor(
    private productService: ProductService,
    private db: Database,
    private auth: Auth
  ) {} // ✅ Inject Database & Auth

  async ngOnInit() {
    // this.products = await this.productService.getProducts(); // ✅ Load products

    const user = this.auth.currentUser;
    if (user) {
      this.isLoading = true
      this.userId = user.uid; // ✅ Store user ID
      this.mySoldItems = await this.productService.getMySoldItems(this.userId); // ✅ Fetch user's cart items
      this.isLoading = false
    }
  }
  async onRemoveFromCart(productId: string) {
    if (!this.userId) return;
  
    const cartItemPath = `mySoldList/${this.userId}/${productId}`; // User's sold items path
    const productPath = `products/${productId}`; // Global products path
  
    try {
      // ✅ Remove item from user's sold list
      await remove(ref(this.db, cartItemPath));
  
      // ✅ Check if product exists before trying to delete it
      const productRef = ref(this.db, productPath);
      const productSnapshot = await get(productRef);
  
      if (productSnapshot.exists()) {
        await remove(productRef); // Delete from "products"
        console.log(`Product ${productId} removed from 'products'.`);
      } else {
        console.warn(`Product ${productId} not found in 'products'.`);
      }
  
      // ✅ Update UI after deletion
      this.mySoldItems = this.mySoldItems.filter(item => item.id !== productId);
  
      // ❗️ Send an event or state update to `HomepageComponent` to remove from `products`
      this.productService.notifyProductDeletion(productId);
      
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
  
  }
