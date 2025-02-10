import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySoldItemsComponent } from './my-sold-items.component';

describe('MySoldItemsComponent', () => {
  let component: MySoldItemsComponent;
  let fixture: ComponentFixture<MySoldItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySoldItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MySoldItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
