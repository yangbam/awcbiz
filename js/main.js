/* ==========================================================================
   IPA site — shared behaviour (icons, nav, members filter, activities,
   join form). Pure vanilla JS, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Inline icon library (feather-style, 24x24, stroke currentColor) --- */
  var ICONS = {
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    "chevron-down": '<polyline points="6 9 12 15 18 9"/>',
    "chevron-left": '<polyline points="15 18 9 12 15 6"/>',
    "chevron-right": '<polyline points="9 18 15 12 9 6"/>',
    "arrow-right": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "map-pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    "upload-cloud": '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/>',
    "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .8 1.7V17h6.4v-.6c0-.7.3-1.3.8-1.7A7 7 0 0 0 12 2z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13V7a1 1 0 0 1 1-1h6a7 7 0 0 1 7 7 7 7 0 0 1-7 7z"/><path d="M4 13c0-4.5 3-8 8-8"/>'
  };

  function injectIcons(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-icon]");
    nodes.forEach(function (node) {
      var name = node.getAttribute("data-icon");
      var body = ICONS[name];
      if (!body) return;
      var svgNS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("class", "icon" + (node.getAttribute("data-icon-class") ? " " + node.getAttribute("data-icon-class") : ""));
      svg.innerHTML = body;
      node.innerHTML = "";
      node.appendChild(svg);
    });
  }

  /* ---- Mobile nav toggle ---- */
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector(".navbar__mobile-menu");
    var iconHolder = toggle ? toggle.querySelector("[data-icon]") : null;
    if (!toggle || !menu || !iconHolder) return;
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      iconHolder.setAttribute("data-icon", isOpen ? "close" : "menu");
      injectIcons(toggle);
    });
  }

  /* ---- Members page: search + category filter ---- */
  function initMembers() {
    var grid = document.querySelector("[data-member-grid]");
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-member-card]"));
    var searchInput = document.querySelector("[data-member-search]");
    var categorySelect = document.querySelector("[data-member-category]");
    var tagButtons = Array.prototype.slice.call(document.querySelectorAll("[data-member-tag]"));
    var applyBtn = document.querySelector("[data-member-apply]");
    var emptyState = document.querySelector("[data-member-empty]");
    var countEl = document.querySelector("[data-member-count]");
    var totalCountEl = document.querySelector("[data-member-total]");

    if (totalCountEl) totalCountEl.textContent = cards.length;

    function currentCategory() {
      var activeTag = tagButtons.filter(function (b) { return b.classList.contains("is-active"); })[0];
      if (activeTag && activeTag.getAttribute("data-member-tag") !== "all") {
        return activeTag.getAttribute("data-member-tag");
      }
      return categorySelect ? categorySelect.value : "all";
    }

    function applyFilter() {
      var term = (searchInput && searchInput.value || "").trim().toLowerCase();
      var category = currentCategory();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesCategory = category === "all" || card.getAttribute("data-category") === category;
        var haystack = card.getAttribute("data-search") || "";
        var matchesTerm = term === "" || haystack.toLowerCase().indexOf(term) !== -1;
        var visible = matchesCategory && matchesTerm;
        card.classList.toggle("is-hidden", !visible);
        if (visible) visibleCount++;
      });

      if (emptyState) emptyState.classList.toggle("is-visible", visibleCount === 0);
      if (countEl) countEl.textContent = visibleCount;
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilter);
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); applyFilter(); }
      });
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", function () {
        tagButtons.forEach(function (b) { b.classList.remove("is-active"); });
        var matchingTag = tagButtons.filter(function (b) { return b.getAttribute("data-member-tag") === categorySelect.value; })[0];
        if (matchingTag) matchingTag.classList.add("is-active");
        else {
          var allTag = tagButtons.filter(function (b) { return b.getAttribute("data-member-tag") === "all"; })[0];
          if (categorySelect.value === "all" && allTag) allTag.classList.add("is-active");
        }
        applyFilter();
      });
    }
    if (applyBtn) applyBtn.addEventListener("click", applyFilter);

    tagButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tagButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        if (categorySelect) categorySelect.value = btn.getAttribute("data-member-tag");
        applyFilter();
      });
    });

    applyFilter();
  }

  /* ---- Activities page: load more ---- */
  function initActivities() {
    var loadMoreBtn = document.querySelector("[data-load-more]");
    if (!loadMoreBtn) return;
    loadMoreBtn.addEventListener("click", function () {
      var hidden = document.querySelectorAll(".activity-card.is-hidden");
      hidden.forEach(function (card) { card.classList.remove("is-hidden"); });
      loadMoreBtn.setAttribute("disabled", "disabled");
      loadMoreBtn.textContent = "모든 활동을 확인했습니다";
    });
  }

  /* ---- Join page: file upload + validation + success modal ---- */
  function initJoinForm() {
    var form = document.querySelector("[data-join-form]");
    if (!form) return;

    var uploadZone = document.querySelector("[data-upload-zone]");
    var fileInput = document.querySelector("[data-upload-input]");
    var filenameLabel = document.querySelector("[data-upload-filename]");

    if (uploadZone && fileInput) {
      uploadZone.addEventListener("click", function () { fileInput.click(); });
      uploadZone.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
      });
      ["dragover", "dragenter"].forEach(function (evt) {
        uploadZone.addEventListener(evt, function (e) {
          e.preventDefault();
          uploadZone.classList.add("is-dragover");
        });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        uploadZone.addEventListener(evt, function (e) {
          e.preventDefault();
          uploadZone.classList.remove("is-dragover");
        });
      });
      uploadZone.addEventListener("drop", function (e) {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          updateFilename();
        }
      });
      fileInput.addEventListener("change", updateFilename);
    }

    function updateFilename() {
      if (!filenameLabel) return;
      if (fileInput.files && fileInput.files.length) {
        filenameLabel.textContent = "선택된 파일: " + fileInput.files[0].name;
        filenameLabel.style.display = "block";
      } else {
        filenameLabel.style.display = "none";
      }
    }

    function showFieldError(field, message) {
      var wrap = field.closest("[data-form-field]");
      if (!wrap) return;
      wrap.classList.add("has-error");
      var msg = wrap.querySelector(".error-msg");
      if (msg && message) msg.textContent = message;
    }
    function clearFieldError(field) {
      var wrap = field.closest("[data-form-field]");
      if (wrap) wrap.classList.remove("has-error");
    }

    form.addEventListener("input", function (e) {
      if (e.target.matches("input, select")) clearFieldError(e.target);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var requiredFields = form.querySelectorAll("[required]");
      requiredFields.forEach(function (field) {
        var ok = true;
        if (field.type === "checkbox") ok = field.checked;
        else if (field.type === "file") ok = field.files && field.files.length > 0;
        else ok = field.value.trim() !== "";

        if (!ok) {
          valid = false;
          showFieldError(field);
        } else {
          clearFieldError(field);
        }
      });

      if (!valid) {
        var firstError = form.querySelector(".has-error");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      openModal();
      form.reset();
      updateFilename();
    });

    var modal = document.querySelector("[data-success-modal]");
    function openModal() {
      if (modal) modal.classList.add("is-open");
    }
    function closeModal() {
      if (modal) modal.classList.remove("is-open");
    }
    document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectIcons();
    initNav();
    initMembers();
    initActivities();
    initJoinForm();
  });
})();
