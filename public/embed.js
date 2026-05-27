/**
 * SayGday AI – single-line widget loader
 *
 * Usage (customers paste exactly ONE line into their site):
 *   <script src="https://[YOUR_NETLIFY_URL]/embed.js?clientId=CUSTOMER_ID_123" defer></script>
 *
 * What this script does:
 *  1. Parses its own <script> src URL to extract the clientId parameter.
 *  2. Builds the absolute base URL so it works on any domain.
 *  3. Creates a floating container div in the bottom-right corner.
 *  4. Injects an <iframe> pointing to /widget.html?clientId=...
 *  5. Listens to postMessage events from the iframe to toggle open/closed state.
 */
(function () {
  'use strict';

  // ── 1. Extract clientId from this script's own src URL ─────────────────────
  var currentScript = document.currentScript;
  if (!currentScript) {
    // Fallback for async-loaded scripts (currentScript is null after load)
    currentScript = document.querySelector('script[src*="embed.js"]');
  }

  if (!currentScript) {
    console.warn('[SayGday] Could not locate embed.js <script> tag.');
    return;
  }

  var scriptSrc = new URL(currentScript.src);
  var clientId = scriptSrc.searchParams.get('clientId');

  if (!clientId) {
    console.warn('[SayGday] No clientId found in embed.js URL. Add ?clientId=YOUR_ID to the src.');
    return;
  }

  // ── 2. Derive the base origin so the widget URL is always absolute ──────────
  var baseUrl = scriptSrc.origin; // e.g. "https://amazing-app.netlify.app"

  // ── 3. Styles ────────────────────────────────────────────────────────────────
  var COLLAPSED_SIZE = { width: '64px', height: '64px' };
  var EXPANDED_SIZE  = { width: '380px', height: '600px' };

  var containerStyle = [
    'position: fixed',
    'bottom: 24px',
    'right: 24px',
    'z-index: 2147483647',       // max z-index so it floats above everything
    'transition: width 0.3s ease, height 0.3s ease',
    'border-radius: 16px',
    'overflow: hidden',
    'box-shadow: 0 8px 32px rgba(0,0,0,0.25)',
    'border: none',
    'background: transparent',
    'width: ' + COLLAPSED_SIZE.width,
    'height: ' + COLLAPSED_SIZE.height,
  ].join('; ');

  var iframeStyle = [
    'width: 100%',
    'height: 100%',
    'border: none',
    'border-radius: 16px',
    'background: transparent',
  ].join('; ');

  // ── 4. Build the DOM ─────────────────────────────────────────────────────────
  var container = document.createElement('div');
  container.id = 'saygday-widget-container';
  container.setAttribute('style', containerStyle);

  var iframe = document.createElement('iframe');
  iframe.id  = 'saygday-widget-iframe';
  iframe.src = baseUrl + '/widget.html?clientId=' + encodeURIComponent(clientId);
  iframe.setAttribute('title', 'SayGday AI Chat');
  iframe.setAttribute('style', iframeStyle);
  iframe.setAttribute('allow', 'clipboard-write');

  container.appendChild(iframe);

  // Wait until the DOM is ready before injecting
  function inject() {
    document.body.appendChild(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // ── 5. postMessage bridge: listen for toggle events from the iframe ─────────
  var isOpen = false;

  window.addEventListener('message', function (event) {
    // Security: only trust messages from our own iframe's origin
    if (event.origin !== baseUrl && event.origin !== window.location.origin) return;

    var data = event.data;
    if (!data || data.source !== 'saygday-widget') return;

    if (data.type === 'TOGGLE') {
      isOpen = !isOpen;
      if (isOpen) {
        container.style.width  = EXPANDED_SIZE.width;
        container.style.height = EXPANDED_SIZE.height;
        // Also set border-radius back so the chat window looks clean
        container.style.borderRadius = '16px';
      } else {
        container.style.width  = COLLAPSED_SIZE.width;
        container.style.height = COLLAPSED_SIZE.height;
      }
    }

    if (data.type === 'OPEN') {
      isOpen = true;
      container.style.width  = EXPANDED_SIZE.width;
      container.style.height = EXPANDED_SIZE.height;
    }

    if (data.type === 'CLOSE') {
      isOpen = false;
      container.style.width  = COLLAPSED_SIZE.width;
      container.style.height = COLLAPSED_SIZE.height;
    }
  });
})();
