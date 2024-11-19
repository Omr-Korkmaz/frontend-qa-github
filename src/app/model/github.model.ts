export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string;
  bio: string;
  blog: string | null;
  company: string;
  created_at: string;
  disk_usage: number;
  email: string | null;
  events_url: string;
  followers: number;
  followers_url: string;
  following: number;
  following_url: string;
  gists_url: string;
  hireable: boolean | null;
  html_url: string;
  location: string;
  name: string;
  node_id: string;
  notification_email: string | null;
  organizations_url: string;
  owned_private_repos: number;
  plan: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
  private_gists: number;
  public_gists: number;
  public_repos: number;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  total_private_repos: number;
  twitter_username: string | null;
  two_factor_authentication: boolean;
  type: string;
  updated_at: string;
  url: string;
  user_view_type: string;
}

export interface GithubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    html_url: string;
  };
  description: string | null;
  fork: boolean;
  forks_count: number;
  stargazers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  homepage: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  svn_url: string;
  topics: string[];
  visibility: string;
  isEmpty?: boolean; //extra

}



export interface Commit {
  sha: string;
  html_url: string;
  committer: {
    name: string;
    avatar_url: string;
    html_url: string;
  };
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  repository: string; //for filtering
  timeAgo: string;
}




export interface Committer {
  name: string;
  avatar_url: string;
  html_url: string;
}

export interface CommitDetails {
  message: string;
  date: string; 
}
