import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProductService } from '../../Components/services/product.service'; // ✅ Import ProductService
import { Database, ref, remove, push, set } from '@angular/fire/database'; // ✅ Import Firebase methods
import { Auth } from '@angular/fire/auth'; // ✅ Import Firebase Auth

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'] // ✅ Corrected styleUrls (array format)
})
export class HomepageComponent implements OnInit {

  isLoading : boolean = true;
  products: any[] = [];
  userId: string | null = null; // Store current user ID

  constructor(private productService: ProductService, private db: Database, private auth: Auth) {} // ✅ Inject Database & Auth

  async ngOnInit() {
    this.isLoading = true;
    this.products = await this.productService.getProducts();
    this.isLoading = false;
  
    const user = this.auth.currentUser;
    if (user) {
      this.userId = user.uid;
    }
  
    // ✅ Listen for product deletions from MySoldItemsComponent
    this.productService.productDeleted$.subscribe((deletedProductId) => {
      this.products = this.products.filter(item => item.id !== deletedProductId);
    });
  }
  
  

  async onDelete(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      await remove(ref(this.db, `products/${productId}`)); // ✅ Remove from Firebase
      this.products = await this.productService.getProducts(); // ✅ Refresh product list
    }
  }

  async addToCart(product: any) {
    if (!this.userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const cartPath = `buyList${this.userId}`; // ✅ Unique cart path for each user
    const cartRef = push(ref(this.db, cartPath)); // ✅ Push to Firebase

    await set(cartRef, product);
    alert("Product added to cart!");
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
