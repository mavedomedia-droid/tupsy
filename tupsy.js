/**
 * Tupsy — front-end API client
 * Talks to the Google Apps Script endpoint.
 */
(function (window) {
  'use strict';

  // === PASTE YOUR DEPLOYED GAS WEB APP URL HERE ===
  var ENDPOINT = https://script.google.com/macros/s/AKfycbwA3Y78d7w7NAZEx2KbDMyd6A1XsfneH2c2GXXHaU3VuDHCKBZt1RStFXDq1Dipvadf/exec';

  function post(body) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  function get(params) {
    var url = ENDPOINT + '?' + new URLSearchParams(
      Object.assign({}, params, { _: Date.now() })
    ).toString();
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  window.Tupsy = {
    endpoint: ENDPOINT,

    submitProject: function (data) {
      return post({ action: 'submitProject', data: data });
    },

    submitPartner: function (data) {
      return post({ action: 'submitPartner', data: data });
    },

    /* Single brand: partner info + their live items */
    getBrand: function (slug) {
      return get({ action: 'brand', slug: slug });
    },

    /* Featured items across all partners — homepage */
    getFeaturedItems: function (limit) {
      return get({ action: 'featuredItems', limit: limit || 8 });
    },

    /* Items for one partner only — brand page */
    getPartnerItems: function (slug) {
      return get({ action: 'partnerItems', slug: slug });
    }
  };
})(window);
