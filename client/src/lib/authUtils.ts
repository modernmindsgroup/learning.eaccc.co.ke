export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function redirectToLogin(returnUrl?: string) {
  const redirectUrl = returnUrl || window.location.pathname;
  localStorage.setItem('redirectAfterLogin', redirectUrl);
  window.location.href = "/api/login";
}