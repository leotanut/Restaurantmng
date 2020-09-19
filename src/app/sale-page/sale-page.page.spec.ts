import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalePagePage } from './sale-page.page';

describe('SalePagePage', () => {
  let component: SalePagePage;
  let fixture: ComponentFixture<SalePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
