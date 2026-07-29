/* ==========================================================================
   AWC기업인연합회 site — shared behaviour (icons, nav, members list, activities list,
   join form). Pure vanilla JS, no dependencies. Data comes from DataStore
   (js/data.js), which must be loaded before this file.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Inline icon library (feather-style, 24x24, stroke currentColor) --- */
  var ICON_PATHS = {
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
    leaf: '<path d="M11 20A7 7 0 0 1 4 13V7a1 1 0 0 1 1-1h6a7 7 0 0 1 7 7 7 7 0 0 1-7 7z"/><path d="M4 13c0-4.5 3-8 8-8"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    "refresh-cw": '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'
  };

  function iconMarkup(name, extraClass) {
    var body = ICON_PATHS[name];
    if (!body) return "";
    return '<svg viewBox="0 0 24 24" class="icon' + (extraClass ? " " + extraClass : "") + '">' + body + "</svg>";
  }

  function injectIcons(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-icon]");
    nodes.forEach(function (node) {
      var markup = iconMarkup(node.getAttribute("data-icon"), node.getAttribute("data-icon-class"));
      if (markup) node.innerHTML = markup;
    });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return parts[0] + ". " + parts[1] + ". " + parts[2];
  }

  /* Resize + compress an image File to a data URL, so uploaded photos stay
     small enough to live in localStorage (no backend/file storage). Defaults
     to JPEG; pass mimeType "image/png" for logos etc. that need transparency. */
  function resizeImageFile(file, maxWidth, quality, mimeType) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("read failed")); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error("decode failed")); };
        img.onload = function () {
          var scale = Math.min(1, (maxWidth || 960) / img.width);
          var w = Math.max(1, Math.round(img.width * scale));
          var h = Math.max(1, Math.round(img.height * scale));
          var canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL(mimeType || "image/jpeg", quality || 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* Read any file (PDF, doc, image, ...) as a data URL, unmodified — used for
     attachments/certificates where we can't safely re-compress the content. */
  function readFileAsDataUrl(file, maxBytes) {
    return new Promise(function (resolve, reject) {
      if (maxBytes && file.size > maxBytes) {
        reject(new Error("file too large"));
        return;
      }
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("read failed")); };
      reader.onload = function () { resolve(reader.result); };
      reader.readAsDataURL(file);
    });
  }

  /* Normalize a user-entered URL: add https:// if missing, and refuse
     dangerous schemes (javascript:, data:, ...) so it's safe to use as href. */
  function normalizeUrl(value) {
    var v = (value || "").trim();
    if (!v) return "";
    if (/^(javascript|data|vbscript):/i.test(v)) return "";
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    return v;
  }

  /* Category fields used to be a single string; they're now multi-select
     arrays. This keeps older localStorage data (single string) working. */
  function toArray(v) {
    if (Array.isArray(v)) return v;
    return v ? [v] : [];
  }

  /* Items with a 순번(displayOrder) show first, ascending by that number;
     items without one keep their default order (fallbackComparator, if
     given — otherwise their existing relative order), listed after. */
  function sortByDisplayOrder(list, fallbackComparator) {
    var withOrder = [];
    var withoutOrder = [];
    list.forEach(function (item) {
      if (item.displayOrder !== undefined && item.displayOrder !== null && item.displayOrder !== "") withOrder.push(item);
      else withoutOrder.push(item);
    });
    withOrder.sort(function (a, b) { return Number(a.displayOrder) - Number(b.displayOrder); });
    if (fallbackComparator) withoutOrder.sort(fallbackComparator);
    return withOrder.concat(withoutOrder);
  }

  function sortMembersForDisplay(list) {
    return sortByDisplayOrder(list);
  }

  function byDateDesc(a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  }

  /* Counts a number element up from 0 to `target` — used once on page load
     for stat/total displays so the number feels alive rather than static. */
  function animateCount(el, target, duration) {
    if (!el) return;
    if (!target) { el.textContent = "0"; return; }
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / (duration || 800), 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Expose a small namespace so other scripts (management.js, activity-detail.js) can reuse icons/helpers */
  window.IPA = {
    icons: ICON_PATHS,
    iconMarkup: iconMarkup,
    injectIcons: injectIcons,
    escapeHtml: escapeHtml,
    formatDate: formatDate,
    resizeImageFile: resizeImageFile,
    readFileAsDataUrl: readFileAsDataUrl,
    normalizeUrl: normalizeUrl,
    toArray: toArray,
    sortByDisplayOrder: sortByDisplayOrder,
    sortMembersForDisplay: sortMembersForDisplay,
    byDateDesc: byDateDesc,
    animateCount: animateCount
  };

  /* ---- Scroll reveal: fades/slides [data-reveal] elements in once they enter
     the viewport. Dynamic grids (member/activity cards) animate on their own
     via the CSS `card-in` keyframe instead, since they re-render on every
     search/filter keystroke and re-observing them would replay awkwardly. */
  function initScrollReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { observer.observe(el); });
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

  /* ---- Members page: render from DataStore + search/filter/paginate ---- */
  var MEMBER_CATEGORY_LABEL = {
    engineering: "엔지니어링",
    solution: "솔루션",
    operations: "운영관리"
  };
  var MEMBER_CATEGORY_ICON = { engineering: "tool", solution: "monitor", operations: "users" };
  var MEMBER_PAGE_SIZE = 9;

  function memberCardHtml(m) {
    var categories = toArray(m.category);
    var mediaIcon = MEMBER_CATEGORY_ICON[categories[0]] || "tool";
    var mediaInner = m.logo
      ? '<img src="' + m.logo + '" alt="' + escapeHtml(m.name) + ' 로고">'
      : '<span data-icon="' + mediaIcon + '"></span>';
    var tags = categories.map(function (cat) {
      return '<span class="member-card__tag member-card__tag--' + escapeHtml(cat) + ' label-md">' + (MEMBER_CATEGORY_LABEL[cat] || escapeHtml(cat)) + "</span>";
    }).join("");
    return (
      '<article class="card member-card" data-category="' + escapeHtml(categories.join(",")) + '">' +
      '<div class="member-card__media">' + mediaInner + "</div>" +
      '<div class="member-card__body">' +
      '<div class="member-card__tags">' + tags + "</div>" +
      '<h3 class="headline-md member-card__name">' + escapeHtml(m.name) + "</h3>" +
      '<ul class="member-card__meta body-md">' +
      '<li><span data-icon="user"></span>대표: ' + escapeHtml(m.rep) + "</li>" +
      '<li><span data-icon="tool"></span>주요분야: ' + escapeHtml(m.field) + "</li>" +
      '<li><span data-icon="map-pin"></span>' + escapeHtml(m.location) + "</li>" +
      "</ul>" +
      (m.website
        ? '<a href="' + escapeHtml(m.website) + '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-block">홈페이지 방문 <span data-icon="arrow-right"></span></a>'
        : '<span class="btn btn-secondary btn-block" style="opacity:0.5; cursor:not-allowed;" aria-disabled="true">등록된 홈페이지 없음</span>') +
      "</div></article>"
    );
  }

  function initMembers() {
    var grid = document.querySelector("[data-member-grid]");
    if (!grid || !window.DataStore) return;

    var searchInput = document.querySelector("[data-member-search]");
    var categorySelect = document.querySelector("[data-member-category]");
    var tagButtons = Array.prototype.slice.call(document.querySelectorAll("[data-member-tag]"));
    var applyBtn = document.querySelector("[data-member-apply]");
    var emptyState = document.querySelector("[data-member-empty]");
    var totalCountEl = document.querySelector("[data-member-total]");
    var paginationEl = document.querySelector("[data-pagination]");
    var currentPage = 1;

    function currentCategory() {
      var activeTag = tagButtons.filter(function (b) { return b.classList.contains("is-active"); })[0];
      if (activeTag && activeTag.getAttribute("data-member-tag") !== "all") {
        return activeTag.getAttribute("data-member-tag");
      }
      return categorySelect ? categorySelect.value : "all";
    }

    function getFiltered() {
      var term = (searchInput && searchInput.value || "").trim().toLowerCase();
      var category = currentCategory();
      var all = window.DataStore.getPublishedMembers();
      var filtered = all.filter(function (m) {
        var matchesCategory = category === "all" || toArray(m.category).indexOf(category) !== -1;
        var haystack = (m.name + " " + m.rep + " " + m.field + " " + m.location).toLowerCase();
        var matchesTerm = term === "" || haystack.indexOf(term) !== -1;
        return matchesCategory && matchesTerm;
      });
      return sortMembersForDisplay(filtered);
    }

    function renderPagination(totalItems) {
      if (!paginationEl) return;
      var totalPages = Math.max(1, Math.ceil(totalItems / MEMBER_PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      var html = '<button type="button" data-page="prev" ' + (currentPage <= 1 ? "disabled" : "") + '><span data-icon="chevron-left"></span></button>';
      for (var p = 1; p <= totalPages; p++) {
        html += '<button type="button" data-page="' + p + '" class="' + (p === currentPage ? "is-active" : "") + '">' + p + "</button>";
      }
      html += '<button type="button" data-page="next" ' + (currentPage >= totalPages ? "disabled" : "") + '><span data-icon="chevron-right"></span></button>';
      paginationEl.innerHTML = html;
      injectIcons(paginationEl);

      paginationEl.querySelectorAll("[data-page]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var val = btn.getAttribute("data-page");
          if (val === "prev") currentPage = Math.max(1, currentPage - 1);
          else if (val === "next") currentPage = Math.min(totalPages, currentPage + 1);
          else currentPage = parseInt(val, 10);
          render();
        });
      });
    }

    function render() {
      var filtered = getFiltered();
      var totalPages = Math.max(1, Math.ceil(filtered.length / MEMBER_PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      var start = (currentPage - 1) * MEMBER_PAGE_SIZE;
      var pageItems = filtered.slice(start, start + MEMBER_PAGE_SIZE);

      grid.innerHTML = pageItems.map(memberCardHtml).join("");
      injectIcons(grid);

      if (emptyState) emptyState.classList.toggle("is-visible", filtered.length === 0);
      renderPagination(filtered.length);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () { currentPage = 1; render(); });
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); currentPage = 1; render(); }
      });
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", function () {
        tagButtons.forEach(function (b) { b.classList.remove("is-active"); });
        var matchingTag = tagButtons.filter(function (b) { return b.getAttribute("data-member-tag") === categorySelect.value; })[0];
        if (matchingTag) matchingTag.classList.add("is-active");
        currentPage = 1;
        render();
      });
    }
    if (applyBtn) applyBtn.addEventListener("click", function () { currentPage = 1; render(); });
    tagButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tagButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        if (categorySelect) categorySelect.value = btn.getAttribute("data-member-tag");
        currentPage = 1;
        render();
      });
    });

    if (totalCountEl) animateCount(totalCountEl, window.DataStore.getPublishedMembers().length, 900);
    render();
  }

  /* ---- Activities page: render bento grid from DataStore ---- */
  var ACTIVITY_INITIAL_COUNT = 5;
  var ACTIVITY_TEXT_CATEGORIES = ["총회"];
  var ACTIVITY_ALT_BADGE_CATEGORIES = ["연구보고", "프로젝트"];

  function activityMediaSvg() {
    return (
      '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<polyline points="0,180 60,130 130,160 200,80 270,140 330,60 400,110" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.45"/>' +
      '<line x1="0" y1="40" x2="400" y2="40" stroke="#ffffff" stroke-width="1" opacity="0.2"/>' +
      "</svg>"
    );
  }

  function activityCardHtml(item, isWide, isHidden) {
    var classes = "bento-item card activity-card" + (isWide ? " bento-item--wide" : " bento-item--narrow") + (isHidden ? " is-hidden" : "");
    var dateHtml = '<p class="label-md activity-card__date">' + formatDate(item.date) + "</p>";
    var titleTag = isWide ? "headline-lg" : "headline-md";
    var detailHref = "activity-detail.html?id=" + encodeURIComponent(item.id);
    var detailLink = '<a href="' + detailHref + '" class="link-inline">상세보기 <span data-icon="arrow-right"></span></a>';

    /* A thumbnail always wins over the text-only layout, since a photo is worth showing. */
    var useTextStyle = !item.thumbnail && ACTIVITY_TEXT_CATEGORIES.indexOf(item.category) !== -1;

    if (useTextStyle) {
      return (
        '<article class="' + classes + ' activity-card--text">' +
        '<span data-icon="compass"></span>' +
        dateHtml +
        '<h2 class="' + titleTag + '" style="margin-bottom: var(--stack-sm);">' + escapeHtml(item.title) + "</h2>" +
        '<p class="body-md activity-card__desc">' + escapeHtml(item.description) + "</p>" +
        detailLink +
        "</article>"
      );
    }

    var badgeClass = ACTIVITY_ALT_BADGE_CATEGORIES.indexOf(item.category) !== -1 ? "badge badge--alt" : "badge";
    var mediaInner = item.thumbnail
      ? '<img src="' + item.thumbnail + '" alt="">'
      : activityMediaSvg();

    return (
      '<article class="' + classes + '">' +
      '<a href="' + detailHref + '" class="activity-card__media">' + mediaInner + '<span class="' + badgeClass + '">' + escapeHtml(item.category) + "</span></a>" +
      '<div class="activity-card__body">' +
      dateHtml +
      '<h2 class="' + titleTag + '" style="margin-bottom: var(--stack-md);">' + escapeHtml(item.title) + "</h2>" +
      '<p class="body-md activity-card__desc">' + escapeHtml(item.description) + "</p>" +
      detailLink +
      "</div></article>"
    );
  }

  function initActivities() {
    var container = document.querySelector("[data-activity-grid]");
    var loadMoreBtn = document.querySelector("[data-load-more]");
    if (!container || !window.DataStore) return;

    var items = sortByDisplayOrder(window.DataStore.getPublishedActivities().slice(), byDateDesc);

    var html = items.map(function (item, idx) {
      return activityCardHtml(item, idx === 0, idx >= ACTIVITY_INITIAL_COUNT);
    }).join("");
    container.innerHTML = html;
    injectIcons(container);

    if (loadMoreBtn) {
      if (items.length <= ACTIVITY_INITIAL_COUNT) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.addEventListener("click", function () {
          container.querySelectorAll(".activity-card.is-hidden").forEach(function (card) { card.classList.remove("is-hidden"); });
          loadMoreBtn.setAttribute("disabled", "disabled");
          loadMoreBtn.innerHTML = "모든 활동을 확인했습니다 <span data-icon=\"check-circle\"></span>";
          injectIcons(loadMoreBtn);
        });
      }
    }
  }

  /* ---- Join page: validation + Formspree email + success modal + persist ---- */
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/meeynakl";
  var FORMSPREE_INTEREST_LABEL = { engineering: "엔지니어링 부문", solution: "솔루션 부문", operations: "운영관리 부문" };

  function isFormspreeConfigured() {
    return FORMSPREE_ENDPOINT.indexOf("YOUR_FORM_ID") === -1;
  }

  function submitToFormspree(form, checkedInterests) {
    if (!isFormspreeConfigured()) {
      console.warn("AWC기업인연합회: Formspree Form ID가 설정되지 않아 이메일 전송 없이 로컬에만 저장합니다. (js/main.js의 FORMSPREE_ENDPOINT를 확인하세요)");
      return Promise.resolve({ skipped: true });
    }
    var fd = new FormData();
    fd.append("기업명", form.companyName.value.trim());
    fd.append("대표자명", form.representative.value.trim());
    fd.append("회사 홈페이지", window.IPA.normalizeUrl(form.website.value));
    fd.append("담당자 성명", form.contactName.value.trim());
    fd.append("이메일", form.contactEmail.value.trim());
    fd.append("연락처", form.contactPhone.value.trim());
    fd.append("전문분야", checkedInterests.map(function (v) { return FORMSPREE_INTEREST_LABEL[v] || v; }).join(", "));
    fd.append("주요분야", form.mainField.value.trim());
    fd.append("_subject", "[AWC기업인연합회] 새 회원신청 - " + form.companyName.value.trim());

    return fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: fd,
      headers: { "Accept": "application/json" }
    }).then(function (res) {
      if (!res.ok) throw new Error("Formspree submit failed: " + res.status);
      return res.json();
    });
  }

  function initJoinForm() {
    var form = document.querySelector("[data-join-form]");
    if (!form) return;

    function showFieldError(field) {
      var wrap = field.closest("[data-form-field]");
      if (wrap) wrap.classList.add("has-error");
    }
    function clearFieldError(field) {
      var wrap = field.closest("[data-form-field]");
      if (wrap) wrap.classList.remove("has-error");
    }

    form.addEventListener("input", function (e) {
      if (e.target.matches("input, select")) clearFieldError(e.target);
    });

    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var requiredFields = form.querySelectorAll("[required]");
      requiredFields.forEach(function (field) {
        var ok = true;
        if (field.type === "checkbox") ok = field.checked;
        else ok = field.value.trim() !== "";

        if (!ok) { valid = false; showFieldError(field); }
        else { clearFieldError(field); }
      });

      var interestCheckboxes = Array.prototype.slice.call(form.querySelectorAll('input[name="interestField"]'));
      var checkedInterests = interestCheckboxes.filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
      if (interestCheckboxes.length && checkedInterests.length === 0) {
        valid = false;
        showFieldError(interestCheckboxes[0]);
      }

      if (!valid) {
        var firstError = form.querySelector(".has-error");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      var finish = function () {
        if (window.DataStore) {
          try {
            window.DataStore.addApplication({
              companyName: form.companyName.value.trim(),
              representative: form.representative.value.trim(),
              website: window.IPA.normalizeUrl(form.website.value),
              contactName: form.contactName.value.trim(),
              contactEmail: form.contactEmail.value.trim(),
              contactPhone: form.contactPhone.value.trim(),
              interestField: checkedInterests,
              mainField: form.mainField.value.trim()
            });
          } catch (err) {
            console.error("AWC기업인연합회: failed to save application", err);
          }
        }
        openModal();
        form.reset();
        if (submitBtn) submitBtn.disabled = false;
      };

      if (submitBtn) submitBtn.disabled = true;

      submitToFormspree(form, checkedInterests)
        .then(finish)
        .catch(function (err) {
          console.error("AWC기업인연합회: Formspree 제출 실패", err);
          alert("신청서 전송에 실패했습니다. 인터넷 연결을 확인하시고 다시 시도해주세요.");
          if (submitBtn) submitBtn.disabled = false;
        });
    });

    var modal = document.querySelector("[data-success-modal]");
    function openModal() { if (modal) modal.classList.add("is-open"); }
    function closeModal() { if (modal) modal.classList.remove("is-open"); }
    document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });
    if (modal) {
      modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectIcons();
    initNav();
    initJoinForm();
    initScrollReveal();
    var ready = (window.DataStore && window.DataStore.ready) || Promise.resolve();
    ready.then(function () {
      initMembers();
      initActivities();
    });
  });
})();
