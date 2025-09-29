# Angular CSP Demo

An Angular demo showing a strict Content Security Policy (CSP) using nonce.
You can see what is blocked and what is allowed:
- inline styles/events vs Angular handlers,
- dynamic style/script tags with nonce,
- loading external scripts.

## Why this matters

The project illustrates practical enforcement of CSP in an SPA without relying on 'unsafe-inline', reducing DOM‑XSS risk.
It shows nonce propagation server → HTML → Angular runtime and makes CSP behavior observable via the UI.

## Quick start

### Development

```bash
    docker compose watch angular-dev
```

Service runs on http://localhost:4200.

### Production

```bash
    docker compose up angular-prod --build
```

Service runs on http://localhost:8080.

## What to expect in the UI (production)
- Inline attribute style `style="color:red"` is blocked by CSP without `'unsafe-inline'`.
- `ngStyle` works because Angular sets properties via the CSS Object Model `(element.style)`, which CSP does not block.
- Inline event handlers `(onclick)` are blocked, however Angular `(click)` handlers work.
- Dynamically injected `<style>` and `<script>` require the correct nonce to pass CSP.
- Loading external scripts from non-allowlisted origins is blocked.

## How it works

### Nginx CSP header and nonce
Nginx replaces the `NGINX_CSP_NONCE` placeholder in the HTML using `sub_filter` and the per-request nonce (`$request_id` used for demo).

Nginx sets the `Content-Security-Policy` header using `add_header`. Remember to place the `always` flag outside the header value.

`add_header Content-Security-Policy "..." always;`

Policy used in this demo:
- `default-src 'self'` allows same-origin as a default source for all resource types if not overridden
- `script-src 'self' 'nonce-$cspNonce'` allows scripts from same-origin and scripts with matching nonce
- `style-src 'self' 'nonce-$cspNonce'` allows styles from same-origin and styles with the matching nonce
- `base-uri 'none'` disallows setting or using the `<base>` element
- `object-src 'none'` disables the <object> and <embed> elements
- `img-src 'self' data:` allows images from same-origin and `data:` URLs
- `connect-src 'self'` restricts XHR/fetch/WebSocket/EventSource to same-origin

### Passing the nonce to Angular
index.html includes:
- `<meta name="CSP_NONCE" content="NGINX_CSP_NONCE">`
- `<app-root ngCspNonce="NGINX_CSP_NONCE"></app-root>`

Angular runtime reads ngCspNonce and applies the nonce to framework-injected `<style>` tags.  
App code reading the meta can set `element.nonce` on dynamically created `<style>`/`<script>` for CSP compliance.
