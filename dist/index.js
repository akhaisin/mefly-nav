import { jsxs as m, jsx as i } from "react/jsx-runtime";
import { useState as v, useRef as y, useEffect as w } from "react";
import { useLocation as N } from "react-router-dom";
const b = "_root_1ildn_1", x = "_trigger_1ildn_12", L = "_menu_1ildn_33", M = "_item_1ildn_42", S = "_disabled_1ildn_58", k = "_icon_1ildn_62", I = "_label_1ildn_70", A = "_devOnly_1ildn_79", O = "_active_1ildn_87", t = {
  root: b,
  trigger: x,
  menu: L,
  item: M,
  disabled: S,
  icon: k,
  label: I,
  devOnly: A,
  active: O
};
function T({ items: o, activeId: d, style: l, activationMode: n = "click", onSelect: c }) {
  const [a, s] = v(!1), r = y(null);
  w(() => {
    if (!a || n !== "click") return;
    function e(_) {
      r.current && !r.current.contains(_.target) && s(!1);
    }
    function h(_) {
      _.key === "Escape" && s(!1);
    }
    return document.addEventListener("mousedown", e), document.addEventListener("keydown", h), () => {
      document.removeEventListener("mousedown", e), document.removeEventListener("keydown", h);
    };
  }, [a, n]);
  const f = n === "hover" ? () => s(!0) : void 0, u = n === "hover" ? () => s(!1) : void 0;
  function E(e, h) {
    c && (e.preventDefault(), c(h)), s(!1);
  }
  return /* @__PURE__ */ m(
    "div",
    {
      ref: r,
      className: t.root,
      style: l,
      onMouseEnter: f,
      onMouseLeave: u,
      children: [
        a && /* @__PURE__ */ i("ul", { className: t.menu, children: o.map((e) => /* @__PURE__ */ i("li", { children: e.disabled ? /* @__PURE__ */ m("span", { className: `${t.item} ${t.disabled}`, children: [
          /* @__PURE__ */ i("img", { src: e.iconUrl, alt: "", className: t.icon }),
          /* @__PURE__ */ i("span", { className: t.label, children: e.label })
        ] }) : /* @__PURE__ */ m(
          "a",
          {
            href: e.url,
            className: [
              t.item,
              e.devOnly ? t.devOnly : "",
              e.id === d ? t.active : ""
            ].filter(Boolean).join(" "),
            onClick: (h) => E(h, e),
            children: [
              /* @__PURE__ */ i("img", { src: e.iconUrl, alt: "", className: t.icon }),
              /* @__PURE__ */ i("span", { className: t.label, children: e.label })
            ]
          }
        ) }, e.id)) }),
        /* @__PURE__ */ i(
          "button",
          {
            className: t.trigger,
            onClick: () => s((e) => !e),
            "aria-label": "Open navigation menu",
            "aria-expanded": a,
            children: /* @__PURE__ */ m("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: [
              /* @__PURE__ */ i("rect", { x: "1", y: "1", width: "6", height: "6", rx: "1" }),
              /* @__PURE__ */ i("rect", { x: "9", y: "1", width: "6", height: "6", rx: "1" }),
              /* @__PURE__ */ i("rect", { x: "1", y: "9", width: "6", height: "6", rx: "1" }),
              /* @__PURE__ */ i("rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" })
            ] })
          }
        )
      ]
    }
  );
}
const p = [];
function g(o, d, l) {
  return !!(d.includes(o) || l && /^https?:\/\/localhost(:\d+)?$/.test(o));
}
function R({
  trustedOrigins: o = p,
  allowLocalhost: d = !0,
  style: l
}) {
  const [n, c] = v(null);
  if (w(() => {
    function r(f) {
      if (!g(f.origin, o, d)) return;
      const u = f.data;
      (u == null ? void 0 : u.type) === "MEFLY_MENU" && c({ items: u.items, activeId: u.activeId });
    }
    return window.addEventListener("message", r), () => window.removeEventListener("message", r);
  }, [o, d]), !n || n.items.length === 0) return null;
  const a = window.parent !== window;
  function s(r) {
    window.parent.postMessage({ type: "MEFLY_NAV_SELECT", item: r }, "*");
  }
  return /* @__PURE__ */ i(
    T,
    {
      items: n.items,
      activeId: n.activeId,
      style: l,
      onSelect: a ? s : void 0
    }
  );
}
function U(o = p, d = !0) {
  const l = N();
  w(() => {
    window.parent !== window && window.parent.postMessage(
      { type: "HASH_CHANGED", hash: l.hash, pathname: l.pathname },
      "*"
    );
  }, [l]), w(() => {
    if (window.parent === window) return;
    function n(c) {
      var r;
      if (!g(c.origin, o, d) || ((r = c.data) == null ? void 0 : r.type) !== "NAVIGATE_TO_HASH" || c.data.hash === void 0) return;
      const a = c.data.hash, s = a.startsWith("#") ? a : `#${a}`;
      window.location.hash !== s && (window.location.hash = s);
    }
    return window.addEventListener("message", n), () => window.removeEventListener("message", n);
  }, [o, d]);
}
export {
  T as MeflyNav,
  R as MeflyNavReceiver,
  U as useHostSync
};
