import { jsxs as m, jsx as r } from "react/jsx-runtime";
import { useState as _, useRef as y, useEffect as w } from "react";
import { useLocation as N, useNavigate as b } from "react-router-dom";
const x = "_root_1ildn_1", L = "_trigger_1ildn_12", M = "_menu_1ildn_33", S = "_item_1ildn_42", k = "_disabled_1ildn_58", I = "_icon_1ildn_62", A = "_label_1ildn_70", O = "_devOnly_1ildn_79", T = "_active_1ildn_87", s = {
  root: x,
  trigger: L,
  menu: M,
  item: S,
  disabled: k,
  icon: I,
  label: A,
  devOnly: O,
  active: T
};
function C({ items: o, activeId: d, style: c, activationMode: n = "click", onSelect: u }) {
  const [a, t] = _(!1), i = y(null);
  w(() => {
    if (!a || n !== "click") return;
    function e(v) {
      i.current && !i.current.contains(v.target) && t(!1);
    }
    function f(v) {
      v.key === "Escape" && t(!1);
    }
    return document.addEventListener("mousedown", e), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", e), document.removeEventListener("keydown", f);
    };
  }, [a, n]);
  const h = n === "hover" ? () => t(!0) : void 0, l = n === "hover" ? () => t(!1) : void 0;
  function E(e, f) {
    u && (e.preventDefault(), u(f)), t(!1);
  }
  return /* @__PURE__ */ m(
    "div",
    {
      ref: i,
      className: s.root,
      style: c,
      onMouseEnter: h,
      onMouseLeave: l,
      children: [
        a && /* @__PURE__ */ r("ul", { className: s.menu, children: o.map((e) => /* @__PURE__ */ r("li", { children: e.disabled ? /* @__PURE__ */ m("span", { className: `${s.item} ${s.disabled}`, children: [
          /* @__PURE__ */ r("img", { src: e.iconUrl, alt: "", className: s.icon }),
          /* @__PURE__ */ r("span", { className: s.label, children: e.label })
        ] }) : /* @__PURE__ */ m(
          "a",
          {
            href: e.url,
            className: [
              s.item,
              e.devOnly ? s.devOnly : "",
              e.id === d ? s.active : ""
            ].filter(Boolean).join(" "),
            onClick: (f) => E(f, e),
            children: [
              /* @__PURE__ */ r("img", { src: e.iconUrl, alt: "", className: s.icon }),
              /* @__PURE__ */ r("span", { className: s.label, children: e.label })
            ]
          }
        ) }, e.id)) }),
        /* @__PURE__ */ r(
          "button",
          {
            className: s.trigger,
            onClick: () => t((e) => !e),
            "aria-label": "Open navigation menu",
            "aria-expanded": a,
            children: /* @__PURE__ */ m("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: [
              /* @__PURE__ */ r("rect", { x: "1", y: "1", width: "6", height: "6", rx: "1" }),
              /* @__PURE__ */ r("rect", { x: "9", y: "1", width: "6", height: "6", rx: "1" }),
              /* @__PURE__ */ r("rect", { x: "1", y: "9", width: "6", height: "6", rx: "1" }),
              /* @__PURE__ */ r("rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" })
            ] })
          }
        )
      ]
    }
  );
}
const p = [];
function g(o, d, c) {
  return !!(d.includes(o) || c && /^https?:\/\/localhost(:\d+)?$/.test(o));
}
function U({
  trustedOrigins: o = p,
  allowLocalhost: d = !0,
  style: c
}) {
  const [n, u] = _(null);
  if (w(() => {
    function i(h) {
      if (!g(h.origin, o, d)) return;
      const l = h.data;
      (l == null ? void 0 : l.type) === "MEFLY_MENU" && u({ items: l.items, activeId: l.activeId });
    }
    return window.addEventListener("message", i), () => window.removeEventListener("message", i);
  }, [o, d]), !n || n.items.length === 0) return null;
  const a = window.parent !== window;
  function t(i) {
    window.parent.postMessage({ type: "MEFLY_NAV_SELECT", item: i }, "*");
  }
  return /* @__PURE__ */ r(
    C,
    {
      items: n.items,
      activeId: n.activeId,
      style: c,
      onSelect: a ? t : void 0
    }
  );
}
function $(o = p, d = !0) {
  const c = N(), n = b();
  w(() => {
    window.parent !== window && window.parent.postMessage(
      { type: "HASH_CHANGED", hash: c.hash, pathname: c.pathname },
      "*"
    );
  }, [c]), w(() => {
    if (window.parent === window) return;
    function u(a) {
      var h;
      if (!g(a.origin, o, d) || ((h = a.data) == null ? void 0 : h.type) !== "NAVIGATE_TO_HASH" || a.data.hash === void 0) return;
      const t = a.data.hash, i = t.startsWith("#") ? t.slice(1) : t;
      if (i.startsWith("/"))
        n(i);
      else {
        const l = `#${i}`;
        window.location.hash !== l && (window.location.hash = l);
      }
    }
    return window.addEventListener("message", u), () => window.removeEventListener("message", u);
  }, [o, d, n]);
}
export {
  C as MeflyNav,
  U as MeflyNavReceiver,
  $ as useHostSync
};
