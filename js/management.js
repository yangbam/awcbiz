/* ==========================================================================
   AWC기업인연합회 site — management.html admin logic.
   Requires js/data.js (DataStore) and js/main.js (window.IPA helpers)
   to be loaded first. Client-side only: all data lives in this browser's
   localStorage, there is no server/auth behind this page.
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.DataStore || !window.IPA) return;

    var esc = window.IPA.escapeHtml;
    var injectIcons = window.IPA.injectIcons;
    var toArray = window.IPA.toArray;
    var sortMembersForDisplay = window.IPA.sortMembersForDisplay;
    var sortByDisplayOrder = window.IPA.sortByDisplayOrder;
    var byDateDesc = window.IPA.byDateDesc;

    /* 회원신청의 관심 분야는 회원사 부문과 동일한 분류(엔지니어링/솔루션/운영관리)를 사용합니다. */
    var MEMBER_CATEGORY_LABEL = { engineering: "엔지니어링", solution: "솔루션", operations: "운영관리" };

    /* ---------------- Tabs ---------------- */
    var tabButtons = Array.prototype.slice.call(document.querySelectorAll("[data-admin-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-admin-panel]"));
    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-admin-tab");
        tabButtons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-admin-panel") === target); });
      });
    });

    /* ---------------- Stats ---------------- */
    function renderStats() {
      var members = window.DataStore.getMembers();
      var activities = window.DataStore.getActivities();
      var applications = window.DataStore.getApplications();
      var pending = applications.filter(function (a) { return a.status !== "done"; }).length;

      setStat("members", members.length);
      setStat("activities", activities.length);
      setStat("applications", applications.length);
      setStat("pending", pending);
    }
    function setStat(key, value) {
      var el = document.querySelector('[data-stat="' + key + '"]');
      if (el) el.textContent = value;
    }

    /* ================= 회원사 관리 ================= */
    var memberForm = document.querySelector("[data-member-form]");
    var memberFormTitle = document.querySelector("[data-member-form-title]");
    var memberTableBody = document.querySelector("[data-member-table-body]");
    var memberTableEmpty = document.querySelector("[data-member-table-empty]");
    var memberAddToggle = document.querySelector("[data-member-add-toggle]");
    var memberFormCancel = document.querySelector("[data-member-form-cancel]");
    var memberLogoZone = document.querySelector("[data-member-logo-zone]");
    var memberLogoInput = document.querySelector("[data-member-logo-input]");
    var memberLogoPreviewWrap = document.querySelector("[data-member-logo-preview-wrap]");
    var memberLogoPreview = document.querySelector("[data-member-logo-preview]");
    var memberLogoRemove = document.querySelector("[data-member-logo-remove]");

    function setLogoPreview(dataUrl) {
      memberForm.elements.logo.value = dataUrl || "";
      if (dataUrl) {
        memberLogoPreview.src = dataUrl;
        memberLogoPreviewWrap.style.display = "flex";
      } else {
        memberLogoPreview.src = "";
        memberLogoPreviewWrap.style.display = "none";
      }
    }

    if (memberLogoZone && memberLogoInput) {
      memberLogoZone.addEventListener("click", function () { memberLogoInput.click(); });
      memberLogoZone.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); memberLogoInput.click(); }
      });
      ["dragover", "dragenter"].forEach(function (evt) {
        memberLogoZone.addEventListener(evt, function (e) { e.preventDefault(); memberLogoZone.classList.add("is-dragover"); });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        memberLogoZone.addEventListener(evt, function (e) { e.preventDefault(); memberLogoZone.classList.remove("is-dragover"); });
      });
      memberLogoZone.addEventListener("drop", function (e) {
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleLogoFile(file);
      });
      memberLogoInput.addEventListener("change", function () {
        var file = memberLogoInput.files && memberLogoInput.files[0];
        if (file) handleLogoFile(file);
        memberLogoInput.value = "";
      });
    }
    if (memberLogoRemove) {
      memberLogoRemove.addEventListener("click", function () { setLogoPreview(""); });
    }

    function handleLogoFile(file) {
      if (!file.type || file.type.indexOf("image/") !== 0) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
      window.IPA.resizeImageFile(file, 400, 0.9, "image/png")
        .then(function (dataUrl) { setLogoPreview(dataUrl); })
        .catch(function () { alert("로고 이미지를 불러오지 못했습니다. 다른 파일을 시도해주세요."); });
    }

    function openMemberForm(member) {
      memberForm.reset();
      memberForm.elements.id.value = member ? member.id : "";
      var checkedCategories = toArray(member ? member.category : []);
      Array.prototype.slice.call(memberForm.querySelectorAll('input[name="category"]')).forEach(function (cb) {
        cb.checked = checkedCategories.indexOf(cb.value) !== -1;
      });
      if (member) {
        memberFormTitle.textContent = "회원사 수정";
        memberForm.elements.name.value = member.name;
        memberForm.elements.rep.value = member.rep;
        memberForm.elements.location.value = member.location;
        memberForm.elements.field.value = member.field;
        memberForm.elements.website.value = member.website || "";
        memberForm.elements.displayOrder.value = (member.displayOrder === undefined || member.displayOrder === null) ? "" : member.displayOrder;
        setLogoPreview(member.logo || "");
      } else {
        memberFormTitle.textContent = "회원사 추가";
        setLogoPreview("");
      }
      memberForm.classList.add("is-open");
      memberForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    function closeMemberForm() {
      memberForm.classList.remove("is-open");
      memberForm.reset();
      setLogoPreview("");
    }

    function renderMembers() {
      var members = sortMembersForDisplay(window.DataStore.getMembers());
      memberTableEmpty.style.display = members.length === 0 ? "block" : "none";
      memberTableBody.innerHTML = members.map(function (m) {
        var websiteCell = m.website
          ? '<a href="' + esc(m.website) + '" target="_blank" rel="noopener noreferrer">방문</a>'
          : '<span style="color:var(--on-surface-variant);">-</span>';
        var categoryLabel = toArray(m.category).map(function (c) { return MEMBER_CATEGORY_LABEL[c] || c; }).join(", ");
        var orderCell = (m.displayOrder === undefined || m.displayOrder === null || m.displayOrder === "")
          ? '<span style="color:var(--on-surface-variant);">-</span>'
          : esc(m.displayOrder);
        var logoCell = m.logo
          ? '<img src="' + m.logo + '" alt="" style="width:40px;height:40px;object-fit:contain;background:var(--surface-container-low);border-radius:var(--radius);border:1px solid var(--outline-variant);padding:4px;box-sizing:border-box;display:block;">'
          : '<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:var(--surface-container-low);border-radius:var(--radius);border:1px solid var(--outline-variant);color:var(--on-surface-variant);box-sizing:border-box;">-</div>';
        return (
          "<tr>" +
          '<td class="nowrap">' + orderCell + "</td>" +
          "<td>" + logoCell + "</td>" +
          "<td>" + esc(m.name) + "</td>" +
          "<td>" + esc(categoryLabel) + "</td>" +
          "<td>" + esc(m.rep) + "</td>" +
          "<td>" + esc(m.field) + "</td>" +
          "<td>" + esc(m.location) + "</td>" +
          "<td>" + websiteCell + "</td>" +
          "<td><div class=\"admin-table__actions\">" +
          '<button type="button" class="icon-btn" data-member-edit="' + m.id + '" aria-label="수정"><span data-icon="edit"></span></button>' +
          '<button type="button" class="icon-btn icon-btn--danger" data-member-delete="' + m.id + '" aria-label="삭제"><span data-icon="trash"></span></button>' +
          "</div></td></tr>"
        );
      }).join("");
      injectIcons(memberTableBody);
    }

    if (memberAddToggle) memberAddToggle.addEventListener("click", function () { openMemberForm(null); });
    if (memberFormCancel) memberFormCancel.addEventListener("click", closeMemberForm);
    if (memberForm) {
      memberForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var id = memberForm.elements.id.value;
        var category = Array.prototype.slice.call(memberForm.querySelectorAll('input[name="category"]:checked')).map(function (cb) { return cb.value; });
        var orderRaw = memberForm.elements.displayOrder.value.trim();
        var data = {
          name: memberForm.elements.name.value.trim(),
          rep: memberForm.elements.rep.value.trim(),
          category: category,
          location: memberForm.elements.location.value.trim(),
          field: memberForm.elements.field.value.trim(),
          website: window.IPA.normalizeUrl(memberForm.elements.website.value),
          displayOrder: orderRaw === "" ? null : Number(orderRaw),
          logo: memberForm.elements.logo.value || ""
        };
        if (!data.name || !data.rep || !data.location || !data.field) return;
        if (data.category.length === 0) {
          alert("전문분야를 한 개 이상 선택해주세요.");
          return;
        }
        try {
          if (id) window.DataStore.updateMember(id, data);
          else window.DataStore.addMember(data);
        } catch (err) {
          alert("저장하지 못했습니다. 로고 이미지 용량이 너무 클 수 있으니 더 작은 이미지로 다시 시도해주세요.");
          return;
        }
        closeMemberForm();
        renderMembers();
        renderStats();
      });
    }
    if (memberTableBody) {
      memberTableBody.addEventListener("click", function (e) {
        var editBtn = e.target.closest("[data-member-edit]");
        var delBtn = e.target.closest("[data-member-delete]");
        if (editBtn) {
          var id = editBtn.getAttribute("data-member-edit");
          var member = window.DataStore.getMembers().filter(function (m) { return m.id === id; })[0];
          if (member) openMemberForm(member);
        } else if (delBtn) {
          var delId = delBtn.getAttribute("data-member-delete");
          if (confirm("이 회원사를 삭제하시겠습니까?")) {
            window.DataStore.deleteMember(delId);
            renderMembers();
            renderStats();
          }
        }
      });
    }

    /* ================= 활동이력 관리 ================= */
    var activityForm = document.querySelector("[data-activity-form]");
    var activityFormTitle = document.querySelector("[data-activity-form-title]");
    var activityTableBody = document.querySelector("[data-activity-table-body]");
    var activityTableEmpty = document.querySelector("[data-activity-table-empty]");
    var activityAddToggle = document.querySelector("[data-activity-add-toggle]");
    var activityFormCancel = document.querySelector("[data-activity-form-cancel]");
    var activityThumbZone = document.querySelector("[data-activity-thumb-zone]");
    var activityThumbInput = document.querySelector("[data-activity-thumb-input]");
    var activityThumbPreviewWrap = document.querySelector("[data-activity-thumb-preview-wrap]");
    var activityThumbPreview = document.querySelector("[data-activity-thumb-preview]");
    var activityThumbRemove = document.querySelector("[data-activity-thumb-remove]");
    var activityAttachmentZone = document.querySelector("[data-activity-attachment-zone]");
    var activityAttachmentInput = document.querySelector("[data-activity-attachment-input]");
    var activityAttachmentPreviewWrap = document.querySelector("[data-activity-attachment-preview-wrap]");
    var activityAttachmentName = document.querySelector("[data-activity-attachment-name]");
    var activityAttachmentRemove = document.querySelector("[data-activity-attachment-remove]");
    var ACTIVITY_ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024; /* 2MB */

    function setThumbnailPreview(dataUrl) {
      activityForm.elements.thumbnail.value = dataUrl || "";
      if (dataUrl) {
        activityThumbPreview.src = dataUrl;
        activityThumbPreviewWrap.style.display = "flex";
      } else {
        activityThumbPreview.src = "";
        activityThumbPreviewWrap.style.display = "none";
      }
    }

    if (activityThumbZone && activityThumbInput) {
      activityThumbZone.addEventListener("click", function () { activityThumbInput.click(); });
      activityThumbZone.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activityThumbInput.click(); }
      });
      ["dragover", "dragenter"].forEach(function (evt) {
        activityThumbZone.addEventListener(evt, function (e) { e.preventDefault(); activityThumbZone.classList.add("is-dragover"); });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        activityThumbZone.addEventListener(evt, function (e) { e.preventDefault(); activityThumbZone.classList.remove("is-dragover"); });
      });
      activityThumbZone.addEventListener("drop", function (e) {
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleThumbnailFile(file);
      });
      activityThumbInput.addEventListener("change", function () {
        var file = activityThumbInput.files && activityThumbInput.files[0];
        if (file) handleThumbnailFile(file);
        activityThumbInput.value = "";
      });
    }
    if (activityThumbRemove) {
      activityThumbRemove.addEventListener("click", function () { setThumbnailPreview(""); });
    }

    function handleThumbnailFile(file) {
      if (!file.type || file.type.indexOf("image/") !== 0) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
      window.IPA.resizeImageFile(file, 960, 0.82)
        .then(function (dataUrl) { setThumbnailPreview(dataUrl); })
        .catch(function () { alert("이미지를 불러오지 못했습니다. 다른 파일을 시도해주세요."); });
    }

    function setAttachmentPreview(name, dataUrl) {
      activityForm.elements.attachmentName.value = name || "";
      activityForm.elements.attachmentDataUrl.value = dataUrl || "";
      if (name && dataUrl) {
        activityAttachmentName.textContent = name;
        activityAttachmentPreviewWrap.style.display = "flex";
      } else {
        activityAttachmentName.textContent = "";
        activityAttachmentPreviewWrap.style.display = "none";
      }
    }

    if (activityAttachmentZone && activityAttachmentInput) {
      activityAttachmentZone.addEventListener("click", function () { activityAttachmentInput.click(); });
      activityAttachmentZone.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activityAttachmentInput.click(); }
      });
      ["dragover", "dragenter"].forEach(function (evt) {
        activityAttachmentZone.addEventListener(evt, function (e) { e.preventDefault(); activityAttachmentZone.classList.add("is-dragover"); });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        activityAttachmentZone.addEventListener(evt, function (e) { e.preventDefault(); activityAttachmentZone.classList.remove("is-dragover"); });
      });
      activityAttachmentZone.addEventListener("drop", function (e) {
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleAttachmentFile(file);
      });
      activityAttachmentInput.addEventListener("change", function () {
        var file = activityAttachmentInput.files && activityAttachmentInput.files[0];
        if (file) handleAttachmentFile(file);
        activityAttachmentInput.value = "";
      });
    }
    if (activityAttachmentRemove) {
      activityAttachmentRemove.addEventListener("click", function () { setAttachmentPreview("", ""); });
    }

    function handleAttachmentFile(file) {
      window.IPA.readFileAsDataUrl(file, ACTIVITY_ATTACHMENT_MAX_BYTES)
        .then(function (dataUrl) { setAttachmentPreview(file.name, dataUrl); })
        .catch(function () { alert("파일을 첨부하지 못했습니다. 2MB 이하의 파일만 업로드할 수 있습니다."); });
    }

    function openActivityForm(item) {
      activityForm.reset();
      activityForm.elements.id.value = item ? item.id : "";
      if (item) {
        activityFormTitle.textContent = "활동 수정";
        activityForm.elements.date.value = item.date;
        activityForm.elements.category.value = item.category;
        activityForm.elements.title.value = item.title;
        activityForm.elements.description.value = item.description;
        activityForm.elements.detail.value = item.detail || "";
        activityForm.elements.displayOrder.value = (item.displayOrder === undefined || item.displayOrder === null) ? "" : item.displayOrder;
        setThumbnailPreview(item.thumbnail || "");
        setAttachmentPreview(item.attachmentName || "", item.attachmentDataUrl || "");
      } else {
        activityFormTitle.textContent = "활동 추가";
        setThumbnailPreview("");
        setAttachmentPreview("", "");
      }
      activityForm.classList.add("is-open");
      activityForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    function closeActivityForm() {
      activityForm.classList.remove("is-open");
      activityForm.reset();
      setThumbnailPreview("");
      setAttachmentPreview("", "");
    }

    function renderActivities() {
      var items = sortByDisplayOrder(window.DataStore.getActivities().slice(), byDateDesc);
      activityTableEmpty.style.display = items.length === 0 ? "block" : "none";
      activityTableBody.innerHTML = items.map(function (a) {
        var thumbCell = a.thumbnail
          ? '<img src="' + a.thumbnail + '" alt="" style="width:56px;height:38px;object-fit:cover;border-radius:var(--radius);border:1px solid var(--outline-variant);box-sizing:border-box;display:block;">'
          : '<div style="width:56px;height:38px;display:flex;align-items:center;justify-content:center;background:var(--surface-container-low);border-radius:var(--radius);border:1px solid var(--outline-variant);color:var(--on-surface-variant);box-sizing:border-box;">-</div>';
        var orderCell = (a.displayOrder === undefined || a.displayOrder === null || a.displayOrder === "")
          ? '<span style="color:var(--on-surface-variant);">-</span>'
          : esc(a.displayOrder);
        var badges = "";
        if (a.detail) badges += '<br><span style="color:var(--on-surface-variant);font-size:12px;">상세 내용 등록됨</span>';
        if (a.attachmentDataUrl) badges += '<br><span style="color:var(--on-surface-variant);font-size:12px;">첨부파일: ' + esc(a.attachmentName || "") + "</span>";
        return (
          "<tr>" +
          '<td class="nowrap">' + orderCell + "</td>" +
          "<td>" + thumbCell + "</td>" +
          '<td class="nowrap">' + esc(a.date) + "</td>" +
          "<td>" + esc(a.category) + "</td>" +
          "<td>" + esc(a.title) + badges + "</td>" +
          "<td><div class=\"admin-table__actions\">" +
          '<button type="button" class="icon-btn" data-activity-edit="' + a.id + '" aria-label="수정"><span data-icon="edit"></span></button>' +
          '<button type="button" class="icon-btn icon-btn--danger" data-activity-delete="' + a.id + '" aria-label="삭제"><span data-icon="trash"></span></button>' +
          "</div></td></tr>"
        );
      }).join("");
      injectIcons(activityTableBody);
    }

    if (activityAddToggle) activityAddToggle.addEventListener("click", function () { openActivityForm(null); });
    if (activityFormCancel) activityFormCancel.addEventListener("click", closeActivityForm);
    if (activityForm) {
      activityForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var id = activityForm.elements.id.value;
        var orderRaw = activityForm.elements.displayOrder.value.trim();
        var data = {
          date: activityForm.elements.date.value,
          category: activityForm.elements.category.value,
          title: activityForm.elements.title.value.trim(),
          description: activityForm.elements.description.value.trim(),
          detail: activityForm.elements.detail.value.trim(),
          thumbnail: activityForm.elements.thumbnail.value || "",
          attachmentName: activityForm.elements.attachmentName.value || "",
          attachmentDataUrl: activityForm.elements.attachmentDataUrl.value || "",
          displayOrder: orderRaw === "" ? null : Number(orderRaw)
        };
        if (!data.date || !data.title || !data.description) return;
        try {
          if (id) window.DataStore.updateActivity(id, data);
          else window.DataStore.addActivity(data);
        } catch (err) {
          alert("저장하지 못했습니다. 이미지/첨부파일 용량이 너무 클 수 있으니 더 작은 파일로 다시 시도해주세요.");
          return;
        }
        closeActivityForm();
        renderActivities();
        renderStats();
      });
    }
    if (activityTableBody) {
      activityTableBody.addEventListener("click", function (e) {
        var editBtn = e.target.closest("[data-activity-edit]");
        var delBtn = e.target.closest("[data-activity-delete]");
        if (editBtn) {
          var id = editBtn.getAttribute("data-activity-edit");
          var item = window.DataStore.getActivities().filter(function (a) { return a.id === id; })[0];
          if (item) openActivityForm(item);
        } else if (delBtn) {
          var delId = delBtn.getAttribute("data-activity-delete");
          if (confirm("이 활동을 삭제하시겠습니까?")) {
            window.DataStore.deleteActivity(delId);
            renderActivities();
            renderStats();
          }
        }
      });
    }

    /* ================= 회원신청 목록 ================= */
    var applicationTableBody = document.querySelector("[data-application-table-body]");
    var applicationTableEmpty = document.querySelector("[data-application-table-empty]");

    function renderApplications() {
      var apps = window.DataStore.getApplications().slice().sort(function (a, b) {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      });
      applicationTableEmpty.style.display = apps.length === 0 ? "block" : "none";
      applicationTableBody.innerHTML = apps.map(function (a) {
        var submitted = a.submittedAt ? new Date(a.submittedAt).toLocaleString("ko-KR") : "-";
        var statusBadge = a.status === "done"
          ? '<span class="status-badge status-badge--done">처리완료</span>'
          : '<span class="status-badge status-badge--new">신규</span>';
        var websiteLine = a.website
          ? '<br><a href="' + esc(a.website) + '" target="_blank" rel="noopener noreferrer" style="font-size:12px;">' + esc(a.website) + "</a>"
          : "";
        var fileCell = a.fileDataUrl
          ? '<a href="' + a.fileDataUrl + '" download="' + esc(a.fileName || "attachment") + '" class="link-inline" style="margin-top:0;"><span data-icon="download"></span> ' + esc(a.fileName || "다운로드") + "</a>"
          : (a.fileName ? esc(a.fileName) + '<br><span style="color:var(--on-surface-variant);font-size:12px;">(파일 데이터 없음)</span>' : "-");
        return (
          "<tr>" +
          '<td class="nowrap">' + esc(submitted) + "</td>" +
          "<td>" + esc(a.companyName) + " <br><span style=\"color:var(--on-surface-variant);font-size:12px;\">대표 " + esc(a.representative) + "</span>" + websiteLine + "</td>" +
          "<td>" + esc(a.contactName) + "</td>" +
          "<td>" + esc(a.contactEmail) + "<br>" + esc(a.contactPhone) + "</td>" +
          "<td>" + esc(toArray(a.interestField).map(function (c) { return MEMBER_CATEGORY_LABEL[c] || c; }).join(", ")) + "</td>" +
          "<td>" + esc(a.mainField || "-") + "</td>" +
          "<td>" + fileCell + "</td>" +
          "<td>" + statusBadge + "</td>" +
          "<td><div class=\"admin-table__actions\">" +
          '<button type="button" class="icon-btn" data-app-toggle="' + a.id + '" aria-label="상태 전환"><span data-icon="check-circle"></span></button>' +
          '<button type="button" class="icon-btn icon-btn--danger" data-app-delete="' + a.id + '" aria-label="삭제"><span data-icon="trash"></span></button>' +
          "</div></td></tr>"
        );
      }).join("");
      injectIcons(applicationTableBody);
    }

    if (applicationTableBody) {
      applicationTableBody.addEventListener("click", function (e) {
        var toggleBtn = e.target.closest("[data-app-toggle]");
        var delBtn = e.target.closest("[data-app-delete]");
        if (toggleBtn) {
          var id = toggleBtn.getAttribute("data-app-toggle");
          var app = window.DataStore.getApplications().filter(function (a) { return a.id === id; })[0];
          if (app) {
            window.DataStore.updateApplication(id, { status: app.status === "done" ? "new" : "done" });
            renderApplications();
            renderStats();
          }
        } else if (delBtn) {
          var delId = delBtn.getAttribute("data-app-delete");
          if (confirm("이 신청 내역을 삭제하시겠습니까?")) {
            window.DataStore.deleteApplication(delId);
            renderApplications();
            renderStats();
          }
        }
      });
    }

    /* ================= 데이터 백업 ================= */
    var exportBtn = document.querySelector("[data-export-btn]");
    var exportMembersBtn = document.querySelector("[data-export-members-btn]");
    var exportActivitiesBtn = document.querySelector("[data-export-activities-btn]");
    var importInput = document.querySelector("[data-import-input]");
    var resetBtn = document.querySelector("[data-reset-btn]");

    function downloadJson(filename, data) {
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        var stamp = new Date().toISOString().slice(0, 10);
        downloadJson("ipa-data-backup-" + stamp + ".json", window.DataStore.exportAll());
      });
    }
    if (exportMembersBtn) {
      exportMembersBtn.addEventListener("click", function () {
        downloadJson("members.json", window.DataStore.getMembers());
      });
    }
    if (exportActivitiesBtn) {
      exportActivitiesBtn.addEventListener("click", function () {
        downloadJson("activities.json", window.DataStore.getActivities());
      });
    }

    if (importInput) {
      importInput.addEventListener("change", function () {
        var file = importInput.files && importInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var payload = JSON.parse(reader.result);
            window.DataStore.importAll(payload);
            renderAll();
            alert("데이터를 성공적으로 가져왔습니다.");
          } catch (err) {
            alert("파일을 읽지 못했습니다. 올바른 백업 JSON 파일인지 확인해주세요.");
          }
          importInput.value = "";
        };
        reader.readAsText(file);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("정말 모든 데이터를 초기값으로 되돌리시겠습니까? 회원신청 내역을 포함해 되돌릴 수 없습니다.")) {
          window.DataStore.resetAll();
          renderAll();
        }
      });
    }

    function renderAll() {
      renderStats();
      renderMembers();
      renderActivities();
      renderApplications();
    }

    var ready = window.DataStore.ready || Promise.resolve();
    ready.then(renderAll);
  });
})();
