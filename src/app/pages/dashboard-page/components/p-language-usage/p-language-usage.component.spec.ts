import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLanguageUsageComponent } from './p-language-usage.component';

describe('PLanguageUsageComponent', () => {
  let component: PLanguageUsageComponent;
  let fixture: ComponentFixture<PLanguageUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PLanguageUsageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PLanguageUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
