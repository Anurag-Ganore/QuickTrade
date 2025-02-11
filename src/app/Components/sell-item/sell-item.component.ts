import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common'; // Required for Angular directives
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { Database, ref, set, push, get, remove } from '@angular/fire/database';
import { ProductService } from '../../Components/services/product.service'; // ✅ Corrected import path
import { Auth } from '@angular/fire/auth'; // ✅ Import Auth

@Component({
  selector: 'app-sell-item',
  standalone: true,
  templateUrl: './sell-item.component.html',
  styleUrls: ['./sell-item.component.css'],
  imports: [NgIf, NgFor, NgClass, FormsModule], // Import FormsModule
  providers: [ProductService] // ✅ Explicitly include ProductService in providers
})
export class SellItemComponent implements OnInit {
  product = {
    title: '',
    description: '',
    price: 0, // ✅ Initialize price properly
    image: ''
  };
  previewImage: string | ArrayBuffer | null = null;
  products: any[] = [];
  isLoading : boolean = false;

  constructor(private db: Database,private auth: Auth, private productService: ProductService) {} // ✅ Inject ProductService

  // ✅ Fetch products from Firebase when the component initializes
  async ngOnInit() {
    this.products = await this.productService.getProducts();
  }

  // ✅ Handle file selection and convert to Base64
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.product.image = reader.result as string; // ✅ Store Base64 image
      };
      reader.readAsDataURL(file);
    }
  }

  // ✅ Prevent form submission default behavior & Save Product

  async onSell(event: Event) {
    event.preventDefault(); // Prevent page reload
    this.isLoading = true;
  
    // ✅ Form validation
    if (!this.product.title || !this.product.description || this.product.price <= 0 || !this.product.image) {
      alert('Please fill in all fields and add an image.');
      this.isLoading = false; // ❗ Stop loader
      return;
    }
  
    const user = this.auth.currentUser; // ✅ Get logged-in user
    if (!user) {
      alert('You must be logged in to sell a product.');
      this.isLoading = false; // ❗ Stop loader
      return;
    }
  
    try {
      const userId = user.uid; // ✅ Get User ID
  
      const newProductRef = push(ref(this.db, 'products')); // ✅ Public product list
      const soldProductRef = push(ref(this.db, `mySoldList/${userId}`)); // ✅ Store under seller's UID
  
      // ✅ Store in both places
      await set(newProductRef, this.product);
      await set(soldProductRef, this.product);
  
      alert('Product added successfully!');
  
      // ✅ Fetch updated products after adding a new one
      this.products = await this.productService.getProducts();
      
      // ✅ Reset form
      this.product = { title: '', description: '', price: 0, image: '' };
      this.previewImage = null;
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      this.isLoading = false; // ✅ Stop loader in all cases
    }
  }
  
  

  // ✅ Delete product from Firebase & UI
  async onDelete(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      await remove(ref(this.db, `products/${productId}`));
      this.products = await this.productService.getProducts(); // ✅ Refresh product list after deletion
    }
  }
}
