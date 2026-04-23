import { jsxs as v, jsx as s } from "react/jsx-runtime";
import { useState as w, useRef as g, useEffect as f } from "react";
import { useLocation as E, useNavigate as y } from "react-router-dom";
const N = "_root_1ildn_1", L = "_trigger_1ildn_12", b = "_menu_1ildn_33", x = "_item_1ildn_42", k = "_disabled_1ildn_58", S = "_icon_1ildn_62", I = "_label_1ildn_70", A = "_devOnly_1ildn_79", O = "_active_1ildn_87", r = {
  root: N,
  trigger: L,
  menu: b,
  item: x,
  disabled: k,
  icon: S,
  label: I,
  devOnly: A,
  active: O
};
function T({ items: o, activeId: l, style: c, activationMode: t = "click", onSelect: u }) {
  const [a, i] = w(!1), n = g(null);
  f(() => {
    if (!a || t !== "click") return;
    function e(m) {
      n.current && !n.current.contains(m.target) && i(!1);
    }
    function d(m) {
      m.key === "Escape" && i(!1);
    }
    return document.addEventListener("mousedown", e), document.addEventListener("keydown", d), () => {
      document.removeEventListener("mousedown", e), document.removeEventListener("keydown", d);
    };
  }, [a, t]), f(() => {
    if (t !== "hover" || !n.current) return;
    const e = n.current, d = () => i(!0), m = () => i(!1);
    return e.addEventListener("mouseenter", d), e.addEventListener("mouseleave", m), () => {
      e.removeEventListener("mouseenter", d), e.removeEventListener("mouseleave", m);
    };
  }, [t]);
  function h(e, d) {
    u && (e.preventDefault(), u(d)), i(!1);
  }
  return /* @__PURE__ */ v("div", { ref: n, className: r.root, style: c, children: [
    a && /* @__PURE__ */ s("ul", { className: r.menu, children: o.map((e) => /* @__PURE__ */ s("li", { children: e.disabled ? /* @__PURE__ */ v("span", { className: `${r.item} ${r.disabled}`, children: [
      /* @__PURE__ */ s("img", { src: e.iconUrl, alt: "", className: r.icon }),
      /* @__PURE__ */ s("span", { className: r.label, children: e.label })
    ] }) : /* @__PURE__ */ v(
      "a",
      {
        href: e.url,
        className: [
          r.item,
          e.devOnly ? r.devOnly : "",
          e.id === l ? r.active : ""
        ].filter(Boolean).join(" "),
        onClick: (d) => h(d, e),
        children: [
          /* @__PURE__ */ s("img", { src: e.iconUrl, alt: "", className: r.icon }),
          /* @__PURE__ */ s("span", { className: r.label, children: e.label })
        ]
      }
    ) }, e.id)) }),
    /* @__PURE__ */ s(
      "button",
      {
        className: r.trigger,
        onClick: t === "click" ? () => i((e) => !e) : void 0,
        "aria-label": "Open navigation menu",
        "aria-expanded": a,
        children: /* @__PURE__ */ v("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: [
          /* @__PURE__ */ s("rect", { x: "1", y: "1", width: "6", height: "6", rx: "1" }),
          /* @__PURE__ */ s("rect", { x: "9", y: "1", width: "6", height: "6", rx: "1" }),
          /* @__PURE__ */ s("rect", { x: "1", y: "9", width: "6", height: "6", rx: "1" }),
          /* @__PURE__ */ s("rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" })
        ] })
      }
    )
  ] });
}
const _ = [];
function p(o, l, c) {
  return !!(l.includes(o) || c && /^https?:\/\/localhost(:\d+)?$/.test(o));
}
function M({
  trustedOrigins: o = _,
  allowLocalhost: l = !0,
  style: c
}) {
  const [t, u] = w(null);
  if (f(() => {
    function n(h) {
      if (!p(h.origin, o, l)) return;
      const e = h.data;
      (e == null ? void 0 : e.type) === "MEFLY_MENU" && u({ items: e.items, activeId: e.activeId });
    }
    return window.addEventListener("message", n), () => window.removeEventListener("message", n);
  }, [o, l]), !t || t.items.length === 0) return null;
  const a = window.parent !== window;
  function i(n) {
    window.parent.postMessage({ type: "MEFLY_NAV_SELECT", item: n }, "*");
  }
  return /* @__PURE__ */ s(
    T,
    {
      items: t.items,
      activeId: t.activeId,
      style: c,
      onSelect: a ? i : void 0
    }
  );
}
function R(o = _, l = !0) {
  const c = E(), t = y();
  f(() => {
    window.parent !== window && window.parent.postMessage(
      { type: "HASH_CHANGED", hash: c.hash, pathname: c.pathname },
      "*"
    );
  }, [c]), f(() => {
    if (window.parent === window) return;
    function u(a) {
      var h;
      if (!p(a.origin, o, l) || ((h = a.data) == null ? void 0 : h.type) !== "NAVIGATE_TO_HASH" || a.data.hash === void 0) return;
      const i = a.data.hash, n = i.startsWith("#") ? i.slice(1) : i;
      if (n.startsWith("/"))
        t(n);
      else {
        const e = `#${n}`;
        window.location.hash !== e && (window.location.hash = e);
      }
    }
    return window.addEventListener("message", u), () => window.removeEventListener("message", u);
  }, [o, l, t]);
}
export {
  T as MeflyNav,
  M as MeflyNavReceiver,
  R as useHostSync
};
