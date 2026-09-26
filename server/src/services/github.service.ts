import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

export const fetchUserReposAndReadmes = async (username: string) => {
  try {
    // Fetch public repos
    const reposResponse = await axios.get(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=5`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': `token ${accessToken}` // If we add token storage later
      }
    });

    const repos = reposResponse.data;
    const repoData = [];

    for (const repo of repos) {
      // Fetch README for each repo
      let readmeText = '';
      try {
        const readmeResponse = await axios.get(`${GITHUB_API_BASE}/repos/${username}/${repo.name}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        });
        readmeText = readmeResponse.data;
      } catch (err) {
        // No README found, ignore
      }

      repoData.push({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        topics: repo.topics,
        readme: readmeText.substring(0, 5000) // Truncate to save tokens
      });
    }

    return repoData;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw new Error('Failed to fetch GitHub repositories');
  }
};
