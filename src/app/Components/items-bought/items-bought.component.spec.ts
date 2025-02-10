import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBoughtComponent } from './items-bought.component';

describe('ItemsBoughtComponent', () => {
  let component: ItemsBoughtComponent;
  let fixture: ComponentFixture<ItemsBoughtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsBoughtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemsBoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
