/**
 * Tupsy — front-end API client
 * Talks to the Google Apps Script endpoint.
 *
 * Every page uses this. Nothing else should build endpoint URLs by hand.
 */
(function (window) {
  'use strict';

  // === PASTE YOUR DEPLOYED GAS WEB APP URL HERE ===
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyQtNcN5TIn1YJCRLNUOVSzsleIdPiA3-eY_xypDkClXedAGf--TbrWbcYD3FZchF5U/exec';

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

    /* ---------- forms ---------- */

    submitProject: function (data) {
      return post({ action: 'submitProject', data: data });
    },

    submitPartner: function (data) {
      return post({ action: 'submitPartner', data: data });
    },

    /* Is this storefront URL free? Used by the partners form. */
    checkSlug: function (slug) {
      return get({ action: 'checkSlug', slug: slug });
    },

    /* ---------- catalogue ---------- */

    /* Single brand: partner info + their live items */
    getBrand: function (slug) {
      return get({ action: 'brand', slug: slug });
    },

    /* Featured items across all partners — homepage */
    getFeaturedItems: function (limit) {
      return get({ action: 'featuredItems', limit: limit || 8 });
    },

    /* Items for one partner only — brand page and /shop */
    getPartnerItems: function (slug) {
      return get({ action: 'partnerItems', slug: slug });
    },

    /* ---------- checkout ---------- */

    /**
     * Prices the cart against the sheet, writes a Pending order, and
     * returns a Paystack link.
     *
     * The server recomputes every price from the Items tab, so whatever
     * the cart claims a piece costs is ignored. Only id, variant,
     * colour, size, measurements, fitNote and qty are read from here.
     *
     * cart: { brandSlug, items: [...] }
     * customer: { name, email, phone, address, city, state, country, notes }
     *
     * Resolves { ok, orderId, leadTime, authorization_url }
     */
    createOrder: function (cart, customer) {
      return post({
        action: 'createOrder',
        data: {
          brandSlug: cart.brandSlug,
          items: (cart.items || []).map(function (it) {
            return {
              id: it.id,
              slug: it.slug || '',
              name: it.name || '',
              variant: it.variant || '',
              colour: it.colour || '',
              size: it.size || '',
              measurements: it.measurements || '',
              fitNote: it.fitNote || '',
              qty: it.qty
            };
          }),
          customer: customer
        }
      });
    },

    /* Ask the backend to confirm payment with Paystack and mark it Paid. */
    verifyOrder: function (ref) {
      return get({ action: 'verifyOrder', ref: ref });
    },

    /* Read an order back for the confirmation page. */
    getOrder: function (ref) {
      return get({ action: 'order', ref: ref });
    },

    /* ---------- shared cart ----------
       One cart across /shop and every partner storefront. A cart can
       only hold one brand at a time, because each order settles with
       one seller. */

    CART_KEY: 'tupsy_cart_v1',

    getCart: function () {
      try {
        var raw = JSON.parse(localStorage.getItem(this.CART_KEY));
        if (raw && raw.items && raw.items.length) return raw;
      } catch (e) {}
      return { brand: '', brandSlug: '', items: [] };
    },

    saveCart: function (cart) {
      try { localStorage.setItem(this.CART_KEY, JSON.stringify(cart)); } catch (e) {}
      return cart;
    },

    clearCart: function () {
      try { localStorage.removeItem(this.CART_KEY); } catch (e) {}
    },

    cartCount: function (cart) {
      cart = cart || this.getCart();
      var n = 0;
      for (var i = 0; i < cart.items.length; i++) n += cart.items[i].qty;
      return n;
    },

    cartSubtotal: function (cart) {
      cart = cart || this.getCart();
      var n = 0;
      for (var i = 0; i < cart.items.length; i++) {
        n += (cart.items[i].price || 0) * cart.items[i].qty;
      }
      return n;
    },

    /* ---------- formatting ---------- */

    money: function (n, currency) {
      var sym = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' }[currency || 'NGN'] || '';
      return sym + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 });
    }
  };
})(window);
