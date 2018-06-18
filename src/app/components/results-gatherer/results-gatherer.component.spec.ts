import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsGathererComponent } from './results-gatherer.component';

describe('ResultsGathererComponent', () => {
  let component: ResultsGathererComponent;
  let fixture: ComponentFixture<ResultsGathererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsGathererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsGathererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
