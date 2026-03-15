/**
 * Academic Halt — Cloudflare Pages Function
 * Handles GitHub OAuth for Decap CMS
 *
 * File location:  functions/api/auth.js
 * Triggered at:   https://www.academichalt.com/api/auth
 *
 * HOW IT WORKS:
 *  1. CMS redirects browser to /api/auth  (no ?code param)
 *  2. This function redirects to GitHub OAuth login
 *  3. GitHub redirects back to /api/auth?code=xxx
 *  4. This function exchanges code for access_token
 *  5. Sends token back to CMS via postMessage so the admin panel logs in
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // ── Step 1: No code yet → redirect to GitHub OAuth ──────────
  if (!code) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', 'Ov23li4HcwAjGLOlTYe8');
    githubAuthUrl.searchParams.set('scope', 'repo,user');
    githubAuthUrl.searchParams.set('redirect_uri', 'https://www.academichalt.com/api/auth');
    return Response.redirect(githubAuthUrl.toString(), 302);
  }

  // ── Step 2: GitHub returned ?code=xxx → exchange for token ──
  try {
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id:     'Ov23li4HcwAjGLOlTYe8',
          client_secret: 'dde485ae021727eec17a7ca7b25cf623acc460a1',
          code:          code,
          redirect_uri:  'https://www.academichalt.com/api/auth',
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      return new Response(
        `<html><body><p>OAuth error: ${tokenData.error_description || tokenData.error || 'Unknown error'}</p>
         <p>Please close this window and try again.</p></body></html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const token    = tokenData.access_token;
    const provider = 'github';

    // ── Step 3: Send token back to the CMS opener window ──────
    // Decap CMS listens for this exact postMessage format
    const html = `<!DOCTYPE html>
<html>
<head><title>Authenticating...</title></head>
<body>
<p>Authentication successful. This window will close automatically.</p>
<script>
  (function() {
    var msg = JSON.stringify({
      token:    "${token}",
      provider: "${provider}"
    });
    var targetMsg = "authorization:${provider}:success:" + msg;

    if (window.opener) {
      window.opener.postMessage(targetMsg, "*");
      setTimeout(function() { window.close(); }, 500);
    } else {
      // Fallback: redirect back to admin
      window.location.href = "/admin/";
    }
  })();
</script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (err) {
    return new Response(
      `<html><body><p>Server error during OAuth: ${err.message}</p></body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
