import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { By } from '@angular/platform-browser';
import { GithubUser } from '../../../model/github.model';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); 
  });

  it('should display user info when userInfo is provided', () => {

    const mockUser: GithubUser = {
      followers: 42,
      following: 10,
      location: 'Stockholm',
    } as GithubUser;

    component.userInfo = mockUser;
    fixture.detectChanges(); 

    const heading = fixture.debugElement.query(By.css('h3')).nativeElement;
    const followers = fixture.debugElement.query(By.css('p:nth-child(2)')).nativeElement;
    const following = fixture.debugElement.query(By.css('p:nth-child(3)')).nativeElement;
    const location = fixture.debugElement.query(By.css('p:nth-child(4)')).nativeElement;

    expect(heading.textContent).toContain('User Info');
    expect(followers.textContent).toContain('Followers: 42');
    expect(following.textContent).toContain('Following: 10');
    expect(location.textContent).toContain('Location: Stockholm');
  });

  it('should display "Not provided" if location is not set', () => {

    const mockUser: GithubUser = {
      followers: 50,
      following: 20,
      location: '', 
    } as GithubUser;

    component.userInfo = mockUser;
    fixture.detectChanges();


    const location = fixture.debugElement.query(By.css('p:nth-child(4)')).nativeElement;

    expect(location.textContent).toContain('Location: Not provided');
  });

  it('should not render user info section if userInfo is undefined', () => {
    component.userInfo = undefined as any; 
    fixture.detectChanges();

    const userInfoSection = fixture.debugElement.query(By.css('h3'));

    expect(userInfoSection).toBeNull(); 
  });
});
