import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LogicComponent } from './login/login.component';
import { HomepageComponent } from '../app/Components/homepage/homepage.component';
import { SellItemComponent } from '../app/Components/sell-item/sell-item.component';
import { ItemsBoughtComponent } from './Components/items-bought/items-bought.component';
import { MyCartComponent } from './Components/my-cart/my-cart.component';
import { MySoldItemsComponent } from './Components/my-sold-items/my-sold-items.component';

// ✅ Declare routes inside the module, without exporting them separately
export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LogicComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'sell-item', component: SellItemComponent },
  { path: 'items-bought', component: ItemsBoughtComponent },
  { path: 'my-cart', component: MyCartComponent },
  { path: 'my-sold-items', component: MySoldItemsComponent },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: '**', redirectTo: '/homepage' },
];
