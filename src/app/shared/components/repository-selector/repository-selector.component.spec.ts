import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositorySelectorComponent } from './repository-selector.component'; // Adjust the path as necessary
import { GithubRepository } from '../../../model/github.model';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RepositorySelectorComponent', () => {
  let component: RepositorySelectorComponent;
  let fixture: ComponentFixture<RepositorySelectorComponent>;

  // Define the mock data for repositories
  const mockRepositories: GithubRepository[] = [
    {
        name: 'Repo 1',
        owner: {
            login: 'user1',
            id: 1,
            node_id: 'MDQ6VXNlcjE=',
            avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
            html_url: 'https://github.com/user1',
        },
        description: 'Test repo 1',
        id: 0,
        node_id: '',
        full_name: '',
        private: false,
        fork: false,
        forks_count: 0,
        stargazers_count: 0,
        language: '',
        created_at: '',
        updated_at: '',
        pushed_at: '',
        size: 0,
        default_branch: '',
        homepage: null,
        html_url: '',
        clone_url: '',
        ssh_url: '',
        svn_url: '',
        topics: [],
        visibility: ''
    },
    {
        name: 'Repo 2',
        owner: {
            login: 'user2',
            id: 2,
            node_id: 'MDQ6VXNlcjI=',
            avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
            html_url: 'https://github.com/user2',
        },
        description: 'Test repo 2',
        id: 0,
        node_id: '',
        full_name: '',
        private: false,
        fork: false,
        forks_count: 0,
        stargazers_count: 0,
        language: '',
        created_at: '',
        updated_at: '',
        pushed_at: '',
        size: 0,
        default_branch: '',
        homepage: null,
        html_url: '',
        clone_url: '',
        ssh_url: '',
        svn_url: '',
        topics: [],
        visibility: ''
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepositorySelectorComponent], // Declare the component you're testing
      schemas: [NO_ERRORS_SCHEMA], // This will avoid errors from unknown components
    }).compileComponents();

    fixture = TestBed.createComponent(RepositorySelectorComponent);
    component = fixture.componentInstance;

    // Provide mock repositories to the component
    component.repositories = mockRepositories;
    fixture.detectChanges(); // Trigger change detection to update the view
  });

  it('should display repository options', () => {
    const selectElement = fixture.debugElement.query(By.css('select#repo-select')).nativeElement;
    const options = selectElement.options;

    expect(options.length).toBe(mockRepositories.length + 1); // Includes "All Repositories" option
    expect(options[1].text).toBe('Repo 1');
    expect(options[2].text).toBe('Repo 2');
  });

  it('should emit selected repository when change is made', () => {
    spyOn(component.repositorySelected, 'emit'); // Spy on the repositorySelected emitter

    const selectElement = fixture.debugElement.query(By.css('select#repo-select')).nativeElement;
    selectElement.value = selectElement.options[1].value; // Simulate selecting "Repo 1"
    selectElement.dispatchEvent(new Event('change'));

    expect(component.repositorySelected.emit).toHaveBeenCalledWith('Repo 1'); // Ensure the emit is called with the correct value
  });
});
