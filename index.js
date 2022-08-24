'use scrict';

import BareClient from './bareClient/BareClient.js';

const prefix = __uv$config.prefix;

const bareClient = new BareClient(location.origin + '/bare/');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {
    scope: __uv$config.prefix,
    // Don't cache http requests
    updateViaCache: 'none',
    type: 'classic'
  }).then(registration => {
    // Update service worker
    registration.update();
  });
}

function redirectTo(url) {
  location.href = location.origin + prefix + __uv$config.encodeUrl(url);
}

function formatQuery(query) {
  const api = 'https://www.google.com/search?q=';

  return api + query.replace(/ /g, '+');
}

window.addEventListener('load', () => {
  const omnibox = document.getElementById('omnibox');

  function go() {
    const url = omnibox.value;

    if (url !== '') {
      if (url.includes('.') && !url.includes(' '))
        redirectTo(url.substring(0, 4) === 'http' ? url : 'https://' + url);
      else
        redirectTo(formatQuery(url));
    }
  }

  const box = document.getElementById('inner');

  omnibox.addEventListener('keyup', async event => {
    if (event.key === 'Enter')
      go();
    /*
    else {
      // Search suggestions

      const query = event.target.value;

      const response = await bareClient.fetch(`https://search.brave.com/api/suggest?q=${query}&rich=false&source=web`);

      const data = await response.text();

      const entries = JSON.parse(data)[1];

      // Reset the previous suggestions
      box.innerHTML = "";
      box.hidden = entries.length === 0;

      for (const entry of entries) {
        // Create the link
        const link = document.createElement('a');
        link.href = location.origin + prefix + __uv$config.encodeUrl(formatQuery(entry));
        link.text = entry;

        const line = document.createElement('br');

        box.appendChild(link);
        box.appendChild(line);
      }
    }
    */
  });
});