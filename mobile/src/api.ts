export async function getHealth(apiBaseUrl: string): Promise<string> {
  const url = `${apiBaseUrl.replace(/\/$/, '')}/health`;
  const response = await fetch(url);
  if (!response.ok) {
    return `Backend responded with ${response.status}`;
  }
  return (await response.text()) || 'Backend is reachable.';
}
