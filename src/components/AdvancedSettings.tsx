export const AdvancedSettings: React.FC<{
    token: string;
    onTokenChange: (e: string) => void;
}> = ({ onTokenChange, token}) => {
    return (
         <details className="token-section">
                <summary>⚙️ Advanced Settings</summary>
                <div className="token-input">
                  <label htmlFor="github-token">
                    GitHub Personal Access Token (optional)
                  </label>
                  <input
                    id="github-token"
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxx"
                    value={token}
                    onChange={(e) => onTokenChange(e.target.value)}
                  />
                  <p className="token-help">
                    Adding a token increases your rate limits from 60 to 5,000 requests per hour.
                    <br />
                    <a 
                      href="https://github.com/settings/tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Create a token here
                    </a> (no scopes needed for public repositories).
                  </p>
                </div>
              </details>
    )
}