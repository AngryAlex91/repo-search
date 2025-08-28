import type { Repo } from "../types";
import { formatNumber, formatTimeAgo } from "../utilities/formating";

export const RepoCard: React.FC<{ repo: Repo }> = ({ repo }) => {
  return (
    <article className="repo-card">
      <div className="repo-header">
        <img 
          src={repo.owner.avatar_url} 
          alt={`${repo.owner.login}'s avatar`}
          className="owner-avatar"
        />
        <div className="repo-info">
          <h3>
            <a 
              href={repo.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-name"
            >
              {repo.full_name}
            </a>
          </h3>
          <p className="repo-description">
            {repo.description || "No description provided"}
          </p>
        </div>
      </div>
      
      <div className="repo-stats">
        <span className="stat" title={`${repo.stargazers_count.toLocaleString()} stars`}>
          ⭐ {formatNumber(repo.stargazers_count)}
        </span>
        <span className="stat" title={`${repo.forks_count.toLocaleString()} forks`}>
          🍴 {formatNumber(repo.forks_count)}
        </span>
        {repo.language && (
          <span className="stat language" title={`Written in ${repo.language}`}>
            {repo.language}
          </span>
        )}
        <span className="stat" title={`${repo.open_issues_count} open issues`}>
          🐛 {repo.open_issues_count}
        </span>
        <span className="stat updated" title={`Last updated ${new Date(repo.updated_at).toLocaleDateString()}`}>
          {formatTimeAgo(repo.updated_at)}
        </span>
      </div>
    </article>
  );
};