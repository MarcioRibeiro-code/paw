import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgisterComponent } from './rgister.component';

describe('RgisterComponent', () => {
  let component: RgisterComponent;
  let fixture: ComponentFixture<RgisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgisterComponent]
    });
    fixture = TestBed.createComponent(RgisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
