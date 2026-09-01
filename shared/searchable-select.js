/**
 * Searchable select (combobox) — type-to-filter dropdown for mobile forms.
 */
(function () {
  'use strict';

  var openInstances = [];
  var backdropEl = null;

  function normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  function closeAllExcept(current) {
    openInstances.slice().forEach(function (instance) {
      if (instance !== current) instance.close();
    });
  }

  function ensureBackdrop() {
    if (backdropEl) return backdropEl;
    backdropEl = document.createElement('div');
    backdropEl.className = 'searchable-select__backdrop';
    backdropEl.setAttribute('aria-hidden', 'true');
    return backdropEl;
  }

  function SearchableSelect(root) {
    this.root = root;
    root.classList.add('searchable-select');
    this.input = root.querySelector('.searchable-select__input');
    this.hidden = root.querySelector('.searchable-select__value');
    this.chevron = root.querySelector('.searchable-select__chevron');
    this.list = root.querySelector('.searchable-select__list');
    this.panel = this._ensurePanel();
    this.options = [];
    this.filtered = [];
    this.activeIndex = -1;
    this.isOpen = false;
    this.searchQuery = '';

    this._onReposition = this._positionPanel.bind(this);
    this._onDocKey = this._handleDocKey.bind(this);

    this._bind();
    this._loadOptions();
    this._renderList();
  }

  SearchableSelect.prototype._ensurePanel = function () {
    var existing = this.root.querySelector('.searchable-select__panel');
    if (existing) return existing;

    var panel = document.createElement('div');
    panel.className = 'searchable-select__panel';
    panel.setAttribute('role', 'presentation');
    panel.id = (this.root.id || 'select') + '-panel';

    var header = document.createElement('div');
    header.className = 'searchable-select__panel-header';
    header.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">search</span><span>Type to search</span>';

    this.list.parentNode.insertBefore(panel, this.list);
    panel.appendChild(header);
    panel.appendChild(this.list);
    return panel;
  };

  SearchableSelect.prototype._bind = function () {
    var self = this;

    this.input.addEventListener('focus', function () {
      self.open();
    });

    this.input.addEventListener('input', function () {
      self.searchQuery = self.input.value;
      self._filter(self.searchQuery);
      self._positionPanel();
      if (!self.isOpen) self.open();
    });

    this.input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!self.isOpen) self.open();
        self._moveActive(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!self.isOpen) self.open();
        self._moveActive(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (self.activeIndex >= 0 && self.filtered[self.activeIndex]) {
          self._select(self.filtered[self.activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        self.close();
        self.input.blur();
      } else if (e.key === 'Tab') {
        self.close();
      }
    });

    this.list.addEventListener('pointerdown', function (e) {
      self._pickFromEvent(e);
    });

    if (this.chevron) {
      this.chevron.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (self.isOpen) {
          self.close();
          self.input.blur();
        } else {
          self.input.focus();
          self.open();
        }
      });
    }
  };

  SearchableSelect.prototype._pickFromEvent = function (e) {
    var item = e.target.closest('[data-value]');
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    this._select({
      value: item.getAttribute('data-value'),
      label: item.getAttribute('data-label') || item.querySelector('.searchable-select__option-label').textContent.trim()
    });
  };

  SearchableSelect.prototype._handleDocKey = function (e) {
    if (e.key === 'Escape' && this.isOpen) {
      e.preventDefault();
      this.close();
      this.input.blur();
    }
  };

  SearchableSelect.prototype._isEventInside = function (e) {
    var target = e.target;
    return this.root.contains(target) || this.panel.contains(target);
  };

  SearchableSelect.prototype._loadOptions = function () {
    var self = this;
    this.options = [];
    this.root.querySelectorAll('option').forEach(function (opt) {
      if (!opt.value) return;
      self.options.push({ value: opt.value, label: opt.textContent.trim() });
    });
    this.filtered = this.options.slice();
  };

  SearchableSelect.prototype.setOptions = function (items, reset) {
    this.options = items.map(function (item) {
      return typeof item === 'string' ? { value: item, label: item } : item;
    });
    if (reset) this.clear();
    this._filter(this.isOpen ? this.searchQuery : '');
    this._renderList();
  };

  SearchableSelect.prototype._syncFilledState = function () {
    var filled = !!this.hidden.value;
    this.root.classList.toggle('searchable-select--filled', filled);
    this.input.classList.toggle('searchable-select__input--filled', filled);
  };

  SearchableSelect.prototype.clear = function () {
    this.hidden.value = '';
    this.input.value = '';
    this.searchQuery = '';
    this.activeIndex = -1;
    this._syncFilledState();
    this._renderList();
  };

  SearchableSelect.prototype.setValue = function (value, label) {
    if (!value) {
      this.clear();
      return;
    }
    var match = this.options.find(function (o) { return o.value === value; });
    this._select(match || { value: value, label: label || value });
  };

  SearchableSelect.prototype.getValue = function () {
    return this.hidden.value;
  };

  SearchableSelect.prototype._filter = function (query) {
    var q = normalize(query);
    if (!q) {
      this.filtered = this.options.slice();
    } else {
      this.filtered = this.options.filter(function (o) {
        return normalize(o.label).indexOf(q) !== -1;
      });
    }
    this.activeIndex = this.filtered.length ? 0 : -1;
    this._renderList();
  };

  SearchableSelect.prototype._renderList = function () {
    var self = this;
    this.list.innerHTML = '';

    if (!this.filtered.length) {
      var empty = document.createElement('li');
      empty.className = 'searchable-select__empty';
      empty.textContent = 'No matches found';
      empty.setAttribute('role', 'option');
      empty.setAttribute('aria-disabled', 'true');
      this.list.appendChild(empty);
      return;
    }

    this.filtered.forEach(function (opt, i) {
      var li = document.createElement('li');
      li.className = 'searchable-select__option';
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', opt.value);
      li.setAttribute('data-label', opt.label);
      if (opt.value === self.hidden.value) {
        li.classList.add('searchable-select__option--selected');
      }
      if (i === self.activeIndex) {
        li.classList.add('searchable-select__option--active');
        li.setAttribute('aria-selected', 'true');
      }

      var label = document.createElement('span');
      label.className = 'searchable-select__option-label';
      label.textContent = opt.label;

      var check = document.createElement('span');
      check.className = 'searchable-select__option-check material-symbols-outlined';
      check.setAttribute('aria-hidden', 'true');
      check.textContent = 'check_circle';

      li.appendChild(label);
      li.appendChild(check);
      self.list.appendChild(li);
    });
  };

  SearchableSelect.prototype._moveActive = function (dir) {
    if (!this.filtered.length) return;
    this.activeIndex = (this.activeIndex + dir + this.filtered.length) % this.filtered.length;
    this._renderList();
    var active = this.list.querySelector('.searchable-select__option--active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  };

  SearchableSelect.prototype._select = function (opt) {
    this.hidden.value = opt.value;
    this.input.value = opt.label;
    this.searchQuery = '';
    this._syncFilledState();
    this.close();
    this.root.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: opt.value, label: opt.label }
    }));
  };

  SearchableSelect.prototype._positionPanel = function () {
    if (!this.isOpen) return;
    var rect = this.input.getBoundingClientRect();
    var gap = 8;
    var viewportPad = 12;
    var spaceBelow = window.innerHeight - rect.bottom - viewportPad;
    var spaceAbove = rect.top - viewportPad;
    var openAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
    var maxHeight = Math.min(280, openAbove ? spaceAbove - gap : spaceBelow - gap);
    maxHeight = Math.max(140, maxHeight);

    this.panel.style.left = Math.max(viewportPad, rect.left) + 'px';
    this.panel.style.width = Math.min(rect.width, window.innerWidth - viewportPad * 2) + 'px';

    if (openAbove) {
      this.panel.style.top = 'auto';
      this.panel.style.bottom = (window.innerHeight - rect.top + gap) + 'px';
      this.panel.style.maxHeight = maxHeight + 'px';
      this.panel.classList.add('searchable-select__panel--above');
    } else {
      this.panel.style.top = (rect.bottom + gap) + 'px';
      this.panel.style.bottom = 'auto';
      this.panel.style.maxHeight = maxHeight + 'px';
      this.panel.classList.remove('searchable-select__panel--above');
    }
  };

  SearchableSelect.prototype._showBackdrop = function () {
    var backdrop = ensureBackdrop();
    if (!backdrop.parentNode) document.body.appendChild(backdrop);
    document.body.classList.add('searchable-select-open');
    requestAnimationFrame(function () {
      backdrop.classList.add('searchable-select__backdrop--visible');
    });
    backdrop.onclick = function () {
      if (openInstances.length) openInstances[openInstances.length - 1].close();
    };
  };

  SearchableSelect.prototype._hideBackdrop = function () {
    if (!backdropEl) return;
    backdropEl.classList.remove('searchable-select__backdrop--visible');
    backdropEl.onclick = null;
    if (!openInstances.length) {
      document.body.classList.remove('searchable-select-open');
    }
    setTimeout(function () {
      if (backdropEl && !backdropEl.classList.contains('searchable-select__backdrop--visible')) {
        backdropEl.remove();
      }
    }, 200);
  };

  SearchableSelect.prototype._attachPanel = function () {
    document.body.appendChild(this.panel);
    this.panel.classList.add('searchable-select__panel--open');
    this.input.setAttribute('aria-controls', this.panel.id);
  };

  SearchableSelect.prototype._detachPanel = function () {
    this.panel.classList.remove('searchable-select__panel--open', 'searchable-select__panel--above');
    this.panel.style.top = '';
    this.panel.style.bottom = '';
    this.panel.style.left = '';
    this.panel.style.width = '';
    this.panel.style.maxHeight = '';
    this.root.appendChild(this.panel);
  };

  SearchableSelect.prototype.open = function () {
    if (this.isOpen || this.input.disabled) return;

    closeAllExcept(this);
    this.isOpen = true;
    this.searchQuery = '';
    this.input.value = '';
    this.root.classList.add('searchable-select--open');
    this.input.setAttribute('aria-expanded', 'true');
    this._filter('');
    this._attachPanel();
    this._positionPanel();
    this._showBackdrop();

    if (openInstances.indexOf(this) === -1) openInstances.push(this);

    document.addEventListener('keydown', this._onDocKey);
    window.addEventListener('resize', this._onReposition);
    window.addEventListener('scroll', this._onReposition, true);
  };

  SearchableSelect.prototype.close = function () {
    if (!this.isOpen) {
      this._restoreDisplayValue();
      return;
    }

    this.isOpen = false;
    this.searchQuery = '';
    this.root.classList.remove('searchable-select--open');
    this.input.setAttribute('aria-expanded', 'false');
    this._restoreDisplayValue();
    this._detachPanel();

    var idx = openInstances.indexOf(this);
    if (idx !== -1) openInstances.splice(idx, 1);

    this._hideBackdrop();

    document.removeEventListener('keydown', this._onDocKey);
    window.removeEventListener('resize', this._onReposition);
    window.removeEventListener('scroll', this._onReposition, true);
  };

  SearchableSelect.prototype._restoreDisplayValue = function () {
    if (this.hidden.value) {
      var match = this.options.find(function (o) { return o.value === this.hidden.value; }.bind(this));
      this.input.value = match ? match.label : '';
    } else {
      this.input.value = '';
    }
    this._syncFilledState();
  };

  SearchableSelect.prototype.disable = function () {
    this.close();
    this.input.disabled = true;
    this.root.classList.add('searchable-select--disabled');
  };

  SearchableSelect.prototype.enable = function () {
    this.input.disabled = false;
    this.root.classList.remove('searchable-select--disabled');
  };

  function initAll() {
    var instances = new Map();
    document.querySelectorAll('[data-searchable-select]:not([data-searchable-initialized])').forEach(function (el) {
      el.setAttribute('data-searchable-initialized', '');
      var instance = new SearchableSelect(el);
      instances.set(el.id || el, instance);
    });
    return instances;
  }

  window.SearchableSelect = SearchableSelect;
  window.initSearchableSelects = initAll;
})();
