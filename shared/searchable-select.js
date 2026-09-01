/**
 * Searchable select (combobox) — type-to-filter dropdown for mobile forms.
 */
(function () {
  'use strict';

  function normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  function SearchableSelect(root) {
    this.root = root;
    root.classList.add('searchable-select');
    this.input = root.querySelector('.searchable-select__input');
    this.list = root.querySelector('.searchable-select__list');
    this.hidden = root.querySelector('.searchable-select__value');
    this.icon = root.querySelector('.searchable-select__chevron');
    this.options = [];
    this.filtered = [];
    this.activeIndex = -1;
    this.isOpen = false;
    this.placeholder = this.input.getAttribute('placeholder') || 'Select…';

    this._bind();
    this._loadOptions();
    this._renderList();
  }

  SearchableSelect.prototype._bind = function () {
    var self = this;

    this.input.addEventListener('focus', function () {
      self.open();
    });

    this.input.addEventListener('input', function () {
      self._filter(self.input.value);
      self.open();
    });

    this.input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        self.open();
        self._moveActive(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        self._moveActive(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (self.activeIndex >= 0 && self.filtered[self.activeIndex]) {
          self._select(self.filtered[self.activeIndex]);
        }
      } else if (e.key === 'Escape') {
        self.close();
        self.input.blur();
      } else if (e.key === 'Tab') {
        self.close();
      }
    });

    this.list.addEventListener('mousedown', function (e) {
      var item = e.target.closest('[data-value]');
      if (!item) return;
      e.preventDefault();
      var value = item.getAttribute('data-value');
      var label = item.textContent;
      self._select({ value: value, label: label });
    });

    document.addEventListener('click', function (e) {
      if (!self.root.contains(e.target)) self.close();
    });

    if (this.icon) {
      this.icon.addEventListener('click', function () {
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
    if (reset) {
      this.clear();
    }
    this._filter(this.input.value);
    this._renderList();
  };

  SearchableSelect.prototype.clear = function () {
    this.hidden.value = '';
    this.input.value = '';
    this.input.classList.remove('searchable-select__input--filled');
    this.root.classList.remove('searchable-select--filled');
    this.activeIndex = -1;
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
      li.textContent = opt.label;
      if (i === self.activeIndex) {
        li.classList.add('searchable-select__option--active');
        li.setAttribute('aria-selected', 'true');
      }
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
    this.input.classList.add('searchable-select__input--filled');
    this.root.classList.add('searchable-select--filled');
    this.close();
    this.root.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: opt.value, label: opt.label }
    }));
  };

  SearchableSelect.prototype.open = function () {
    if (this.isOpen) return;
    this.isOpen = true;
    this.root.classList.add('searchable-select--open');
    this.input.setAttribute('aria-expanded', 'true');
    this._filter(this.input.value);
  };

  SearchableSelect.prototype.close = function () {
    this.isOpen = false;
    this.root.classList.remove('searchable-select--open');
    this.input.setAttribute('aria-expanded', 'false');
    if (this.hidden.value) {
      var match = this.options.find(function (o) { return o.value === this.hidden.value; }.bind(this));
      if (match) this.input.value = match.label;
    } else {
      this.input.value = '';
    }
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
