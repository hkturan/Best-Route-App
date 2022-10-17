import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinateSearchComponent } from './coordinate-search.component';

describe('CoordinateSearchComponent', () => {
  let component: CoordinateSearchComponent;
  let fixture: ComponentFixture<CoordinateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinateSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
