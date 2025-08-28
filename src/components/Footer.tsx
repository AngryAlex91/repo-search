export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>
        Powered by the{" "}
        <a
          href="https://docs.github.com/en/rest/search"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Search API
        </a>
        . Rate limits apply for unauthenticated requests.
      </p>
    </footer>
  );
};
