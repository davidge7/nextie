import { NextResponse } from 'next/server';

async function fetchCodeFromGitHub(
  repoUrl: string,
  filePath: string,
  token?: string
): Promise<string> {
  const urlMatch = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
  if (!urlMatch) {
    throw new Error('Invalid GitHub repository URL. Expected format: https://github.com/owner/repo');
  }
  const repoPath = urlMatch[1].replace(/\.git$/, '');

  const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${filePath}`;

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(apiUrl, { headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    const errorMessage = errorData.message || `Failed to fetch file. Status: ${response.status}`;
    
    if (response.status === 404) {
      throw new Error(`File not found. Please check the repository URL and file path. (${errorMessage})`);
    }
    if (response.status === 401) {
      throw new Error(`Bad credentials. Please check your Personal Access Token. (${errorMessage})`);
    }
    if (response.status === 403) {
      throw new Error(`API rate limit exceeded or private repo access denied. Please add a Personal Access Token with repo access. (${errorMessage})`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (data.content) {
    try {
      // FIX: Replaced Buffer with atob to resolve "Cannot find name 'Buffer'" TypeScript error.
      return atob(data.content);
    } catch (e) {
      throw new Error("Failed to decode file content from Base64.");
    }
  } else {
    throw new Error('The fetched path appears to be a directory or does not contain content.');
  }
};


export async function POST(request: Request) {
  try {
    const { repoUrl, filePath, token } = await request.json();

    if (!repoUrl || !filePath) {
      return NextResponse.json({ error: 'Repository URL and File Path are required.' }, { status: 400 });
    }

    const code = await fetchCodeFromGitHub(repoUrl, filePath, token);
    return NextResponse.json({ code });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}