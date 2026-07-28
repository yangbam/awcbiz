/* ==========================================================================
   AWC기업인연합회 site — activity-detail.html rendering.
   Reads ?id=... from the URL and looks the activity up in the published data.
   ========================================================================== */

(function () {
  "use strict";

  var ALT_BADGE_CATEGORIES = ["연구보고", "프로젝트"];

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-activity-detail]");
    if (!root || !window.DataStore || !window.IPA) return;

    var ready = window.DataStore.ready || Promise.resolve();
    ready.then(renderDetail);

    function renderDetail() {
      var esc = window.IPA.escapeHtml;
      var formatDate = window.IPA.formatDate;

      var params = new URLSearchParams(window.location.search);
      var id = params.get("id");
      var item = id ? window.DataStore.getPublishedActivities().filter(function (a) { return a.id === id; })[0] : null;

      if (!item) {
        root.innerHTML =
          '<div class="text-center" style="padding: 64px 0;">' +
          '<h1 class="headline-lg" style="margin-bottom: var(--stack-md);">활동을 찾을 수 없습니다</h1>' +
          '<p class="body-md" style="color: var(--on-surface-variant); margin-bottom: 32px;">삭제되었거나 잘못된 주소일 수 있습니다.</p>' +
          '<a href="activities.html" class="btn btn-primary">활동이력으로 돌아가기</a>' +
          "</div>";
        return;
      }

      document.title = item.title + " | AWC기업인연합회";

      var badgeClass = ALT_BADGE_CATEGORIES.indexOf(item.category) !== -1 ? "badge badge--alt" : "badge";
      /* No forced height here — the photo is never cropped, it's simply
         scaled down (preserving its own ratio) if it would exceed max-height. */
      var mediaHtml = item.thumbnail
        ? '<img src="' + item.thumbnail + '" alt="" style="display:block; width:100%; max-height:560px; object-fit:contain; border-radius: var(--radius-md); margin:0 auto var(--section-gap); background: var(--surface-container-low);">'
        : "";
      var detailHtml = item.detail
        ? '<div class="body-lg" style="white-space: pre-wrap; color: var(--on-surface); margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--outline-variant);">' + esc(item.detail) + "</div>"
        : "";
      var attachmentHtml = item.attachmentDataUrl
        ? '<div style="margin-top: 32px;"><a href="' + item.attachmentDataUrl + '" download="' + esc(item.attachmentName || "attachment") + '" class="btn btn-secondary"><span data-icon="download"></span> ' + esc(item.attachmentName || "첨부파일") + " 다운로드</a></div>"
        : "";

      root.innerHTML =
        '<a href="activities.html" class="link-inline" style="margin-bottom: var(--section-gap);"><span data-icon="chevron-left"></span> 활동이력으로</a>' +
        '<div style="max-width: 760px; margin: 0 auto;">' +
        '<span class="' + badgeClass + '" style="position:static; display:inline-block; margin-bottom:16px;">' + esc(item.category) + "</span>" +
        '<h1 class="headline-xl" style="margin-bottom: var(--stack-sm);">' + esc(item.title) + "</h1>" +
        '<p class="label-md" style="color: var(--secondary); margin-bottom: var(--section-gap);">' + esc(formatDate(item.date)) + "</p>" +
        mediaHtml +
        '<p class="body-lg" style="color: var(--on-surface-variant);">' + esc(item.description) + "</p>" +
        detailHtml +
        attachmentHtml +
        "</div>";

      window.IPA.injectIcons(root);
    }
  });
})();
