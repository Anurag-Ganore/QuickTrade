import { Injectable } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root' // This makes the service available throughout the app
})
export class ProductService {

  private productDeletedSource = new Subject<string>();
  productDeleted$ = this.productDeletedSource.asObservable();

  notifyProductDeletion(productId: string) {
    this.productDeletedSource.next(productId);
  }
  constructor(private db: Database) {}

  async getProducts() {
    const productsRef = ref(this.db, 'products');
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]: any) => ({
        id,
        ...data
      }));
    }
    return [];
  }
  async getMyCart(userId: string | null) {
    if (!userId) return []; // Ensure user is logged in
  
    const cartPath = `buyList${userId}`; // ✅ User-specific cart path
    const cartRef = ref(this.db, cartPath);
    const snapshot = await get(cartRef);
  
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]: any) => ({
        id,
        ...data
      }));
    }
  
    return []; // Return empty array if no cart items
  }  
  async getMyItemsBought(userId: string | null) {
    if (!userId) return []; // Ensure user is logged in
  
    const cartPath = `itemsBought${userId}`; // ✅ User-specific cart path
    const cartRef = ref(this.db, cartPath);
    const snapshot = await get(cartRef);
  
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]: any) => ({
        id,
        ...data
      }));
    }
  
    return []; // Return empty array if no cart items
  }  
  async getMySoldItems(userId: string | null) {
    if (!userId) return []; // Ensure user is logged in
  
    const cartPath = `mySoldList/${userId}`; // ✅ Corrected user-specific path
    const cartRef = ref(this.db, cartPath);
    const snapshot = await get(cartRef);
  
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]: any) => ({
        id,
        ...data
      }));
    }
  
    return []; // Return empty array if no sold items
  }
  
}
