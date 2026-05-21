export async function verifyTurnstileToken(
  token: string,
  secret: string,
  ip?: string,
): Promise<boolean> {
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();
  return Boolean(result.success);
}
