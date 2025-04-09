export async function fetchWithCsrf(input: RequestInfo, init?: RequestInit) {
  // Fetch the CSRF token
  const csrfResponse = await fetch('/api/csrf-token', {
    credentials: 'include',
  });

  if (!csrfResponse.ok) {
    throw new Error('Failed to fetch CSRF token');
  }

  const {csrfToken} = await csrfResponse.json();

  // Attach the CSRF token to headers
  const headers = new Headers(init?.headers || {});
  headers.set('x-csrf-token', csrfToken);

  // Proceed with the original request
  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });
}
