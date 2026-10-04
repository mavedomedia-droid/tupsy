/**
 * Tupsy — front-end API client
 * Talks to the Google Apps Script endpoint.
 */
(function (window) {
  'use strict';

  // === PASTE YOUR DEPLOYED GAS WEB APP URL HERE ===
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwA3Y78d7w7NAZEx2KbDMyd6A1XsfneH2c2GXXHaU3VuDHCKBZt1RStFXDq1Dipvadf/exec';

  /* ------------------------------------------------------------
     POST — submit a project enquiry
     ------------------------------------------------------------ */
  function submitProject(data) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'submitProject', data: data })
    }).then(function (res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  /* ------------------------------------------------------------
     POST — submit a partner application
     ------------------------------------------------------------ */
  function submitPartner(data) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'submitPartner', data: data })
    }).then(function (res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  /* ------------------------------------------------------------
     GET — featured items for the homepage
     ------------------------------------------------------------ */
  function getFeaturedItems(limit) {
    var url = ENDPOINT + '?action=featuredItems&limit=' + (limit || 8) + '&_=' + Date.now();
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  /* ------------------------------------------------------------
     GET — items for a single partner's storefront
     ------------------------------------------------------------ */
  function getPartnerItems(slug) {
    var url = ENDPOINT + '?action=partnerItems&slug=' + encodeURIComponent(slug) + '&_=' + Date.now();
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  window.Tupsy = {
    endpoint: ENDPOINT,
    submitProject: submitProject,
    submitPartner: submitPartner,
    getFeaturedItems: getFeaturedItems,
    getPartnerItems: getPartnerItems
  };
})(window);
