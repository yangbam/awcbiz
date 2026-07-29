/* ==========================================================================
   AWC기업인연합회 site — client-side data store.

   Members & activities are published as static JSON files committed to the
   git repo (data/members.json, data/activities.json), fetched fresh on every
   page load — this is what keeps every browser/visitor in sync, since there
   is no backend/database. Admin edits (management.html) are staged in this
   browser's localStorage as a *draft* until exported and committed back to
   those JSON files (see the "데이터 백업" tab).

   Applications (회원신청) are also kept as a local draft/record, but the
   real delivery channel is Formspree (see js/main.js) since a visitor's
   browser has no way to write back to the git repo.
   ========================================================================== */

(function (global) {
  "use strict";

  var KEYS = {
    members: "ipa_members_v1",
    activities: "ipa_activities_v1",
    applications: "ipa_applications_v1"
  };

  var DATA_URLS = {
    members: "data/members.json",
    activities: "data/activities.json"
  };

  /* Used only if data/members.json or data/activities.json can't be fetched —
     e.g. the site was opened directly as a file:// page (fetch of local
     files is blocked by the browser) instead of through a web server.
     Kept as a full, up-to-date copy of the JSON files so the fallback never
     silently shows fewer members/activities than what's actually published. */
  var FALLBACK_MEMBERS = [
    { id: "m1", name: "(주)대한인프라엔지니어링", rep: "김철수", category: ["engineering"], field: "대규모 교량 및 터널 설계", location: "서울 강남구", website: "" },
    { id: "m2", name: "스마트시티솔루션스", rep: "이영희", category: ["solution"], field: "스마트 인프라 관제 시스템", location: "경기 성남시", website: "" },
    { id: "m3", name: "글로벌인프라운영", rep: "박민준", category: ["operations"], field: "시설물 유지관리 및 진단", location: "서울 중구", website: "" },
    { id: "m4", name: "(주)미래도시건설", rep: "최지훈", category: ["engineering"], field: "스마트 도로 및 교량 설계", location: "부산 해운대구", website: "" },
    { id: "m5", name: "에코에너지시스템", rep: "정수진", category: ["solution"], field: "신재생 에너지 통합 관리", location: "대전 유성구", website: "" },
    { id: "m6", name: "K-인프라케어", rep: "한상우", category: ["operations"], field: "공공 시설물 안전 진단", location: "인천 연수구", website: "" },
    { id: "m7", name: "글로벌토목설계", rep: "강동원", category: ["engineering"], field: "항만 및 해양 구조물 설계", location: "울산 남구", website: "" },
    { id: "m8", name: "스마트그리드테크", rep: "임채원", category: ["solution"], field: "지능형 전력망 제어 솔루션", location: "광주 북구", website: "" },
    { id: "m9", name: "도시환경매니지먼트", rep: "송민호", category: ["operations"], field: "수처리 시설 운영 및 관리", location: "대구 수성구", website: "" }
  ];
  var FALLBACK_ACTIVITIES = [
    { id: "a1", date: "2024-03-15", category: "포럼", title: "2024 스마트 시티 인프라 포럼", description: "미래형 스마트 시티 구축을 위한 인프라 기술 동향과 정책 방향을 논의하는 자리를 가졌습니다. 정부 관계자 및 산학연 전문가 200여 명이 참석하여 실효성 있는 대안을 모색했습니다." },
    { id: "a2", date: "2024-02-28", category: "연구보고", title: "노후 인프라 개선 방안 연구", description: "국내 노후 교량 및 터널의 안전성 평가 기준 재정립을 위한 정책 연구 보고서를 발간했습니다." },
    { id: "a3", date: "2023-11-10", category: "세미나", title: "교량 안전 진단 기술 세미나", description: "최신 비파괴 검사 기술을 활용한 교량 안전 진단 방법론을 공유하고 실무 적용 사례를 분석했습니다." },
    { id: "a4", date: "2023-09-05", category: "총회", title: "제 3차 이사회 및 임시 총회", description: "2024년도 주요 사업 계획 승인 및 신규 회원사 가입 안건을 의결하였습니다." },
    { id: "a5", date: "2023-07-22", category: "프로젝트", title: "수도권 광역 교통망 확충 자문", description: "효율적인 광역 교통망 설계를 위한 기술적 타당성 검토 및 자문을 수행했습니다." },
    { id: "a6", date: "2023-05-18", category: "세미나", title: "친환경 건설자재 활용 세미나", description: "탄소 저감형 건설자재의 현장 적용 사례와 향후 표준화 방향을 공유했습니다." },
    { id: "a7", date: "2023-03-02", category: "연구보고", title: "스마트 항만 자동화 기술 백서 발간", description: "항만 물류 자동화 및 무인화 기술 도입 현황을 정리한 산업 백서를 발간했습니다." },
    { id: "a8", date: "2023-01-20", category: "총회", title: "2023년도 정기총회 개최", description: "신임 이사진 선출 및 연간 사업 계획을 심의·의결하였습니다." }
  ];

  /* Populated once the fetch in `ready` resolves; used as the seed for the
     localStorage-backed draft copies (getMembers/getActivities below). */
  var currentDefaults = {
    members: FALLBACK_MEMBERS,
    activities: FALLBACK_ACTIVITIES
  };

  function fetchJson(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
      return res.json();
    });
  }

  var ready = Promise.all([
    fetchJson(DATA_URLS.members).catch(function (err) {
      console.warn("AWC기업인연합회: data/members.json을 불러오지 못해 내장된 기본 데이터를 사용합니다. (file://로 열었다면 로컬 서버로 실행해보세요)", err);
      return FALLBACK_MEMBERS;
    }),
    fetchJson(DATA_URLS.activities).catch(function (err) {
      console.warn("AWC기업인연합회: data/activities.json을 불러오지 못해 내장된 기본 데이터를 사용합니다. (file://로 열었다면 로컬 서버로 실행해보세요)", err);
      return FALLBACK_ACTIVITIES;
    })
  ]).then(function (results) {
    currentDefaults.members = results[0];
    currentDefaults.activities = results[1];
  });

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function uid(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function load(key, seed) {
    try {
      var raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (e) { /* corrupt data, fall through to reseed */ }
    try { save(key, seed); } catch (e) { /* storage full on first boot: still usable in-memory */ }
    return clone(seed);
  }

  function save(key, value) {
    /* Intentionally not caught here: quota-exceeded (e.g. a large image)
       must reach the caller so the admin UI can tell the user what failed. */
    localStorage.setItem(key, JSON.stringify(value));
  }

  function findIndexById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return i;
    }
    return -1;
  }

  var DataStore = {
    KEYS: KEYS,

    /* Resolves once data/members.json + data/activities.json have been
       fetched (or have fallen back). Every page must wait on this before
       calling getPublishedMembers/getPublishedActivities, and management.html
       should wait on it too so the admin draft seeds from the real published
       data rather than the tiny built-in fallback. */
    ready: ready,

    /* ---- Published (read-only, always fresh from the committed JSON) ---- */
    getPublishedMembers: function () { return clone(currentDefaults.members); },
    getPublishedActivities: function () { return clone(currentDefaults.activities); },

    /* ---- Members (admin draft — localStorage, seeded from published data) ---- */
    getMembers: function () { return load(KEYS.members, currentDefaults.members); },
    setMembers: function (arr) { save(KEYS.members, arr); },
    addMember: function (member) {
      var list = DataStore.getMembers();
      member.id = uid("m");
      list.unshift(member);
      DataStore.setMembers(list);
      return member;
    },
    updateMember: function (id, patch) {
      var list = DataStore.getMembers();
      var idx = findIndexById(list, id);
      if (idx === -1) return null;
      list[idx] = Object.assign({}, list[idx], patch);
      DataStore.setMembers(list);
      return list[idx];
    },
    deleteMember: function (id) {
      var list = DataStore.getMembers().filter(function (m) { return m.id !== id; });
      DataStore.setMembers(list);
    },

    /* ---- Activities (admin draft — localStorage, seeded from published data) ---- */
    getActivities: function () { return load(KEYS.activities, currentDefaults.activities); },
    setActivities: function (arr) { save(KEYS.activities, arr); },
    addActivity: function (item) {
      var list = DataStore.getActivities();
      item.id = uid("a");
      list.unshift(item);
      DataStore.setActivities(list);
      return item;
    },
    updateActivity: function (id, patch) {
      var list = DataStore.getActivities();
      var idx = findIndexById(list, id);
      if (idx === -1) return null;
      list[idx] = Object.assign({}, list[idx], patch);
      DataStore.setActivities(list);
      return list[idx];
    },
    deleteActivity: function (id) {
      var list = DataStore.getActivities().filter(function (a) { return a.id !== id; });
      DataStore.setActivities(list);
    },

    /* ---- Applications (회원신청) — local record only; Formspree (js/main.js)
       is the real delivery channel to the admin's email. ---- */
    getApplications: function () { return load(KEYS.applications, []); },
    setApplications: function (arr) { save(KEYS.applications, arr); },
    addApplication: function (app) {
      var list = DataStore.getApplications();
      app.id = uid("app");
      app.submittedAt = new Date().toISOString();
      app.status = "new";
      list.unshift(app);
      DataStore.setApplications(list);
      return app;
    },
    updateApplication: function (id, patch) {
      var list = DataStore.getApplications();
      var idx = findIndexById(list, id);
      if (idx === -1) return null;
      list[idx] = Object.assign({}, list[idx], patch);
      DataStore.setApplications(list);
      return list[idx];
    },
    deleteApplication: function (id) {
      var list = DataStore.getApplications().filter(function (a) { return a.id !== id; });
      DataStore.setApplications(list);
    },

    /* ---- Bulk / backup ---- */
    resetAll: function () {
      save(KEYS.members, currentDefaults.members);
      save(KEYS.activities, currentDefaults.activities);
      save(KEYS.applications, []);
    },
    exportAll: function () {
      return {
        exportedAt: new Date().toISOString(),
        members: DataStore.getMembers(),
        activities: DataStore.getActivities(),
        applications: DataStore.getApplications()
      };
    },
    importAll: function (payload) {
      if (!payload || typeof payload !== "object") throw new Error("invalid payload");
      if (Array.isArray(payload.members)) DataStore.setMembers(payload.members);
      if (Array.isArray(payload.activities)) DataStore.setActivities(payload.activities);
      if (Array.isArray(payload.applications)) DataStore.setApplications(payload.applications);
    }
  };

  global.DataStore = DataStore;
})(window);
