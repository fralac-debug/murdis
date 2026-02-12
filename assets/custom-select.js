(function () {
  function initCustomSelects() {
    var selects = document.querySelectorAll('.facet-filters .select');
    selects.forEach(function (wrapper) {
      if (wrapper.querySelector('.murdis-select')) return;

      var nativeSelect = wrapper.querySelector('select');
      if (!nativeSelect) return;

      var custom = document.createElement('div');
      custom.className = 'murdis-select';

      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'murdis-select__trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');

      var selectedOption = nativeSelect.options[nativeSelect.selectedIndex];
      var label = document.createElement('span');
      label.textContent = selectedOption ? selectedOption.textContent : '';

      var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('viewBox', '0 0 12 8');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M1 1l5 5 5-5');
      arrow.appendChild(path);

      trigger.appendChild(label);
      trigger.appendChild(arrow);

      var dropdown = document.createElement('div');
      dropdown.className = 'murdis-select__dropdown';
      dropdown.setAttribute('role', 'listbox');

      Array.from(nativeSelect.options).forEach(function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'murdis-select__option';
        btn.setAttribute('role', 'option');
        btn.setAttribute('data-value', opt.value);
        btn.textContent = opt.textContent;
        if (opt.selected) btn.classList.add('is-selected');

        btn.addEventListener('click', function () {
          nativeSelect.value = opt.value;
          nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
          label.textContent = opt.textContent;
          dropdown.querySelectorAll('.murdis-select__option').forEach(function (o) {
            o.classList.remove('is-selected');
          });
          btn.classList.add('is-selected');
          custom.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        });

        dropdown.appendChild(btn);
      });

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = custom.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      custom.appendChild(trigger);
      custom.appendChild(dropdown);
      wrapper.appendChild(custom);
    });
  }

  document.addEventListener('click', function (e) {
    document.querySelectorAll('.murdis-select.is-open').forEach(function (el) {
      if (!el.contains(e.target)) {
        el.classList.remove('is-open');
        el.querySelector('.murdis-select__trigger').setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('DOMContentLoaded', initCustomSelects);

  var observer = new MutationObserver(function () {
    initCustomSelects();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
