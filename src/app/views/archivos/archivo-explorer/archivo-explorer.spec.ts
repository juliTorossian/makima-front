import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoExplorer } from './archivo-explorer';

describe('ArchivoExplorer', () => {
  let component: ArchivoExplorer;
  let fixture: ComponentFixture<ArchivoExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivoExplorer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivoExplorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
