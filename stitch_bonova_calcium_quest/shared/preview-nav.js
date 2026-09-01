/**
 * Static client preview — wires HTML screens together for clickable walkthrough.
 * Flow: Sign Up → Login → Home → Gameplay → Level Up → Session Summary → Home
 */
(function () {
  var ROUTES = {
    signup: '../sign_up/code.html',
    login: '../login/code.html',
    home: '../home_start/code.html',
    gameplay: '../main_gameplay_screen/code.html',
    levelUp: '../level_up_celebration/code.html',
    summary: '../session_summary/code.html'
  };

  function go(routeKey) {
    var href = ROUTES[routeKey];
    if (href) window.location.href = href;
  }

  function injectHint() {
    if (document.querySelector('.preview-hint')) return;
    var hint = document.createElement('div');
    hint.className = 'preview-hint';
    hint.setAttribute('role', 'status');
    hint.textContent = 'Client preview — tap empty area to skip to level up';
    document.body.appendChild(hint);
  }

  function bindNavLinks() {
    document.querySelectorAll('[data-preview-nav]').forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        go(el.getAttribute('data-preview-nav'));
      });
    });
  }

  function bindForms() {
    document.querySelectorAll('form[data-preview-nav]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        go(form.getAttribute('data-preview-nav'));
      });
    });
  }

  function bindGameplayTap() {
    var shell = document.querySelector('.app-shell');
    if (!shell) return;
    injectHint();
    shell.addEventListener('click', function (event) {
      if (event.target.closest('[data-preview-nav]')) return;
      if (event.target.closest('.food-token')) return;
      if (event.target.closest('.mascot-zone')) return;
      go('levelUp');
    });
  }

  function init() {
    bindNavLinks();
    bindForms();
    var screen = document.body.getAttribute('data-preview-screen');
    if (screen === 'gameplay') bindGameplayTap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
