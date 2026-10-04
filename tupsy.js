/**
 * Tupsy — front-end API client
 * Holds the Google Apps Script endpoint and submits project enquiries.
 */
(function (window) {
  'use strict';

  // === PASTE YOUR DEPLOYED GAS WEB APP URL HERE ===
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwA3Y78d7w7NAZEx2KbDMyd6A1XsfneH2c2GXXHaU3VuDHCKBZt1RStFXDq1Dipvadf/exec';

  /**
   * Submit a project enquiry.
   * @param {Object} data — the form payload
   * @returns {Promise<{ok:boolean, leadId?:string, error?:string}>}
   */
  function submitProject(data) {
    // text/plain avoids the CORS preflight that GAS can't answer
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json();
    });
  }

  window.Tupsy = {
    endpoint: ENDPOINT,
    submitProject: submitProject
  };
})(window);
