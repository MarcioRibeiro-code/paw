import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalUnitComponent } from './local-unit.component';

describe('LocalUnitComponent', () => {
  let component: LocalUnitComponent;
  let fixture: ComponentFixture<LocalUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalUnitComponent]
    });
    fixture = TestBed.createComponent(LocalUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
