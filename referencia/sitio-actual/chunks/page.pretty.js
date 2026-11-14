import { r as e } from "./rolldown-runtime-C60lm6uB.js";
import { i as t, r as n } from "./framework-D_rUT4EX.js";
var r = (e) => e?.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase();
function i(e, t, n = []) {
  if (t == null)
    throw Error(`[lucide]: iconNode is required when icon name is used`);
  return {
    name: r(e),
    size: 24,
    node: t,
    ...(n.length > 0 ? { aliases: n } : {}),
  };
}
var a = (e) => {
    let t = ``,
      n = !1;
    for (let r of e) {
      if (r === `-` || r === `_` || r <= ` `) {
        n = t.length > 0;
        continue;
      }
      (t.length === 0 ? (t += r.toLowerCase()) : (t += n ? r.toUpperCase() : r),
        (n = !1));
    }
    return t;
  },
  o = (e) => {
    let t = a(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  s = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim(),
  c = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    "stroke-width": 2,
    "stroke-linecap": `round`,
    "stroke-linejoin": `round`,
  };
function l(e) {
  return e != null;
}
function u(e, t = {}) {
  let n = t.attributeNames ?? {},
    r = (e) => n[e] ?? e,
    i = e.size ?? e.width ?? c.width,
    a = e.size ?? e.height ?? c.height,
    o =
      e.aliases
        ?.filter((e) => typeof e == `string` && e.trim() !== ``)
        .map((e) => `lucide-${e}`) ?? [],
    u = [...(e.name ? [`lucide-${e.name}`] : []), ...o],
    d = t.className?.split(` `).filter(Boolean) ?? [],
    f = t.includeDefaultClasses === !1 ? s(...d) : s(`lucide`, ...u, ...d),
    p = t.absoluteStrokeWidth
      ? (Number(t.strokeWidth ?? c[`stroke-width`]) *
          Number(e.size ?? e.width ?? c.width)) /
        Number(t.size ?? t.width ?? c.width)
      : (t.strokeWidth ?? c[`stroke-width`]);
  return [
    `svg`,
    {
      ...Object.entries(c).reduce((e, [t, n]) => ((e[r(t)] = n), e), {}),
      ...(`color` in t && t.color && { [r(`stroke`)]: t.color }),
      ...(`size` in t &&
        l(t.size) && { [r(`width`)]: t.size, [r(`height`)]: t.size }),
      ...(`width` in t && l(t.width) && { [r(`width`)]: t.width }),
      ...(`height` in t && l(t.height) && { [r(`height`)]: t.height }),
      [r(`stroke-width`)]: p,
      ...(f && { [r(`class`)]: f }),
      [r(`viewBox`)]: `0 0 ${i} ${a}`,
      ...(t.hasA11yProp === !1 ? { [r(`aria-hidden`)]: `true` } : {}),
      ...(`attributes` in t && t.attributes),
    },
    e.node.map((e) => {
      let [n, i, a] = e,
        o = t.nonScalingStroke
          ? { [r(`vector-effect`)]: `non-scaling-stroke`, ...i }
          : i;
      return a ? [n, o, a] : [n, o];
    }),
  ];
}
function d(e, t = {}) {
  return u(e, {
    ...t,
    attributeNames: {
      ...t.attributeNames,
      class: `className`,
      "stroke-width": `strokeWidth`,
      "stroke-linecap": `strokeLinecap`,
      "stroke-linejoin": `strokeLinejoin`,
      "vector-effect": `vectorEffect`,
    },
  });
}
var f = (e) => {
    for (let t in e)
      if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
  },
  p = e(t(), 1),
  m = (0, p.createContext)({}),
  h = () => (0, p.useContext)(m),
  g = (0, p.forwardRef)(
    (
      {
        color: e,
        size: t,
        width: n,
        height: r,
        strokeWidth: i,
        absoluteStrokeWidth: a,
        nonScalingStroke: o,
        className: c = ``,
        children: l,
        iconNode: u = [],
        icon: m = { node: u, aliases: [], size: 24 },
        ...g
      },
      _,
    ) => {
      let {
          size: v = 24,
          strokeWidth: y = 2,
          absoluteStrokeWidth: b = !1,
          nonScalingStroke: x = !1,
          color: S = `currentColor`,
          className: C = ``,
        } = h() ?? {},
        w = !!l || f(g),
        [T, E, D = []] = d(m, {
          color: e ?? S,
          width: n ?? t ?? v,
          height: r ?? t ?? v,
          strokeWidth: i ?? y,
          absoluteStrokeWidth: a ?? b,
          nonScalingStroke: o ?? x,
          className: s(C, c),
          hasA11yProp: w,
          attributes: g,
        });
      return (0, p.createElement)(T, { ref: _, ...E }, [
        ...D.map(([e, t]) => (0, p.createElement)(e, t)),
        ...(Array.isArray(l) ? l : [l]),
      ]);
    },
  );
function _(e, t = [], n = []) {
  let r = typeof e == `string` ? i(e, t, n) : e,
    a = (0, p.forwardRef)(({ className: e, ...t }, n) =>
      (0, p.createElement)(g, { ref: n, icon: r, className: e, ...t }),
    );
  return (r.name && (a.displayName = o(r.name)), a);
}
var v = {
  name: `arrow-down`,
  size: 24,
  node: [
    [`path`, { d: `M12 5v14`, key: `s699le` }],
    [`path`, { d: `m19 12-7 7-7-7`, key: `1idqje` }],
  ],
};
v.node;
var y = _(v),
  b = {
    name: `arrow-right`,
    size: 24,
    node: [
      [`path`, { d: `M5 12h14`, key: `1ays0h` }],
      [`path`, { d: `m12 5 7 7-7 7`, key: `xquz4c` }],
    ],
  };
b.node;
var x = _(b),
  S = {
    name: `arrow-up-right`,
    size: 24,
    node: [
      [`path`, { d: `M7 7h10v10`, key: `1tivn9` }],
      [`path`, { d: `M7 17 17 7`, key: `1vkiza` }],
    ],
  };
S.node;
var C = _(S),
  w = {
    name: `calendar-days`,
    size: 24,
    node: [
      [`path`, { d: `M8 2v3`, key: `1ioesn` }],
      [`path`, { d: `M16 2v3`, key: `otl347` }],
      [
        `rect`,
        { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2`, key: `h1oib` },
      ],
      [`path`, { d: `M3 9h18`, key: `1pudct` }],
      [`path`, { d: `M8 13h.01`, key: `1sbv64` }],
      [`path`, { d: `M12 13h.01`, key: `y0uutt` }],
      [`path`, { d: `M16 13h.01`, key: `wip0gl` }],
      [`path`, { d: `M8 17h.01`, key: `p3bg7i` }],
      [`path`, { d: `M12 17h.01`, key: `p32p05` }],
      [`path`, { d: `M16 17h.01`, key: `ql8jdd` }],
    ],
  };
w.node;
var T = _(w),
  E = {
    name: `check`,
    size: 24,
    node: [[`path`, { d: `M20 6 9 17l-5-5`, key: `1gmf2c` }]],
  };
E.node;
var D = _(E),
  O = {
    name: `chevron-left`,
    size: 24,
    node: [[`path`, { d: `m15 18-6-6 6-6`, key: `1wnfg3` }]],
  };
O.node;
var k = _(O),
  A = {
    name: `chevron-right`,
    size: 24,
    node: [[`path`, { d: `m9 18 6-6-6-6`, key: `mthhwq` }]],
  };
A.node;
var j = _(A),
  M = {
    name: `clock`,
    size: 24,
    node: [
      [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
      [`path`, { d: `M12 6v6l4 2`, key: `mmk7yg` }],
    ],
  };
M.node;
var ee = _(M),
  N = {
    name: `download`,
    size: 24,
    node: [
      [`path`, { d: `M12 15V3`, key: `m9g1x1` }],
      [
        `path`,
        { d: `M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`, key: `ih7n3h` },
      ],
      [`path`, { d: `m7 10 5 5 5-5`, key: `brsn70` }],
    ],
  };
N.node;
var te = _(N),
  P = {
    name: `map-pin`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,
          key: `1r0f0z`,
        },
      ],
      [`circle`, { cx: `12`, cy: `10`, r: `3`, key: `ilqhr7` }],
    ],
  };
P.node;
var F = _(P),
  I = {
    name: `menu`,
    size: 24,
    node: [
      [`path`, { d: `M4 5h16`, key: `1tepv9` }],
      [`path`, { d: `M4 12h16`, key: `1lakjw` }],
      [`path`, { d: `M4 19h16`, key: `1djgab` }],
    ],
  };
I.node;
var ne = _(I),
  L = {
    name: `plus`,
    size: 24,
    node: [
      [`path`, { d: `M5 12h14`, key: `1ays0h` }],
      [`path`, { d: `M12 5v14`, key: `s699le` }],
    ],
  };
L.node;
var R = _(L),
  z = {
    name: `share-2`,
    size: 24,
    node: [
      [`circle`, { cx: `18`, cy: `5`, r: `3`, key: `gq8acd` }],
      [`circle`, { cx: `6`, cy: `12`, r: `3`, key: `w7nqdw` }],
      [`circle`, { cx: `18`, cy: `19`, r: `3`, key: `1xt0gg` }],
      [
        `line`,
        { x1: `8.59`, x2: `15.42`, y1: `13.51`, y2: `17.49`, key: `47mynk` },
      ],
      [
        `line`,
        { x1: `15.41`, x2: `8.59`, y1: `6.51`, y2: `10.49`, key: `1n3mei` },
      ],
    ],
  };
z.node;
var re = _(z),
  B = {
    name: `x`,
    size: 24,
    node: [
      [`path`, { d: `M18 6 6 18`, key: `1bl5f8` }],
      [`path`, { d: `m6 6 12 12`, key: `d8bk6v` }],
    ],
  };
B.node;
var ie = _(B);
function V(e, t) {
  let n = new Date(e + `T12:00:00Z`);
  return (n.setUTCDate(n.getUTCDate() + t), n.toISOString().slice(0, 10));
}
function H(e) {
  return V(e, -((new Date(e + `T12:00:00Z`).getUTCDay() + 6) % 7));
}
function U(e) {
  let t = H(e);
  return Array.from({ length: 7 }, (e, n) => V(t, n));
}
function W(e, t) {
  return new Intl.DateTimeFormat(`es-MX`, { ...t, timeZone: `UTC` }).format(
    new Date(e + `T12:00:00Z`),
  );
}
function G(e) {
  let t = V(e, 6),
    n = new Date(e + `T12:00:00Z`),
    r = new Date(t + `T12:00:00Z`);
  return n.getUTCFullYear() === r.getUTCFullYear()
    ? n.getUTCMonth() === r.getUTCMonth()
      ? `${n.getUTCDate()} al ${W(t, { day: `numeric`, month: `long`, year: `numeric` })}`
      : `${W(e, { day: `numeric`, month: `short` })} a ${W(t, { day: `numeric`, month: `short`, year: `numeric` })}`
    : `${W(e, { day: `numeric`, month: `short`, year: `numeric` })} a ${W(t, { day: `numeric`, month: `short`, year: `numeric` })}`;
}
var K = (e) =>
    `${e.year}-${String(e.month + 1).padStart(2, `0`)}-${String(e.day).padStart(2, `0`)}`,
  q = n(),
  J = [
    `Enero`,
    `Febrero`,
    `Marzo`,
    `Abril`,
    `Mayo`,
    `Junio`,
    `Julio`,
    `Agosto`,
    `Septiembre`,
    `Octubre`,
    `Noviembre`,
    `Diciembre`,
  ];
function Y({ event: e }) {
  return (0, q.jsxs)(`span`, {
    className: `event-kind ${e.type}`,
    children: [
      e.type === `popup` ? `Pop-up` : `Colaboración`,
      e.sample ? ` · Ejemplo` : ``,
    ],
  });
}
function ae(e) {
  let {
      events: t,
      reserved: n,
      today: r,
      week: i,
      month: a,
      year: o,
      filter: s,
      loaded: c,
      error: l,
      onFilter: u,
      onWeek: d,
      onMonth: f,
      onMonthToday: p,
      onToday: m,
      onBook: h,
      onEvent: g,
    } = e,
    _ = t
      .slice()
      .sort((e, t) => K(e).localeCompare(K(t)) || e.time.localeCompare(t.time)),
    v = _.filter((e) => s === `all` || (s !== `catering` && e.type === s)),
    b = U(i),
    x = v.filter((e) => b.includes(K(e))),
    S = v.filter((e) => e.month === a && e.year === o),
    w = (new Date(Date.UTC(o, a, 1)).getUTCDay() + 6) % 7,
    E = new Date(Date.UTC(o, a + 1, 0)).getUTCDate(),
    O = Math.ceil((w + E) / 7) * 7;
  function A(e) {
    return l
      ? `error`
      : c
        ? e < r
          ? `past`
          : n.includes(e)
            ? `reserved`
            : `open`
        : `loading`;
  }
  function M(e, t = !1) {
    let n = A(e),
      r =
        n === `reserved`
          ? `Reservado`
          : n === `past`
            ? `Fecha pasada`
            : n === `loading`
              ? `Consultando`
              : n === `error`
                ? `No disponible`
                : `Agendar`;
    return (0, q.jsxs)(`button`, {
      type: `button`,
      className: `stack-book ${t ? `month-book` : ``} ${n}`,
      disabled: n !== `open`,
      "aria-label": `${n === `open` ? `Agendar catering` : n === `reserved` ? `Catering reservado` : n === `past` ? `Fecha pasada, catering no disponible` : n === `error` ? `Agenda no disponible` : `Consultando disponibilidad`} el ${W(e, { day: `numeric`, month: `long`, year: `numeric` })}`,
      onClick: () => h(e),
      children: [
        n === `reserved`
          ? (0, q.jsx)(D, { size: 14 })
          : (0, q.jsx)(R, { size: 14 }),
        (0, q.jsx)(`span`, { children: r }),
      ],
    });
  }
  return (0, q.jsxs)(`main`, {
    className: `stack-home`,
    children: [
      (0, q.jsxs)(`section`, {
        className: `stack-events`,
        id: `encuentros`,
        "aria-labelledby": `encounters-title`,
        children: [
          (0, q.jsxs)(`div`, {
            className: `stack-intro`,
            children: [
              (0, q.jsxs)(`div`, {
                className: `eyebrow`,
                children: [
                  (0, q.jsx)(`span`, {}),
                  ` SIEMPRE HAY ALGO COCINÁNDOSE`,
                ],
              }),
              (0, q.jsxs)(`h1`, {
                children: [
                  `Pop-ups & `,
                  (0, q.jsx)(`em`, { children: `colaboraciones.` }),
                ],
              }),
              (0, q.jsx)(`p`, {
                children: `Pizza para compartir. Descubre dónde nos encontramos.`,
              }),
              (0, q.jsxs)(`a`, {
                href: `#calendario`,
                className: `jump-week`,
                children: [
                  `Ver semana y agendar catering `,
                  (0, q.jsx)(y, { size: 16 }),
                ],
              }),
            ],
          }),
          (0, q.jsx)(`h2`, {
            id: `encounters-title`,
            className: `sr-only`,
            children: `Próximos pop-ups y colaboraciones`,
          }),
          c
            ? l
              ? (0, q.jsx)(`p`, {
                  className: `form-error`,
                  role: `alert`,
                  children: l,
                })
              : (0, q.jsxs)(`div`, {
                  className: `stack-event-cards`,
                  children: [
                    _.filter((e) => K(e) >= r).map((e) =>
                      (0, q.jsxs)(
                        `button`,
                        {
                          type: `button`,
                          className: `stack-event-card ${e.type}`,
                          onClick: () => g(e),
                          "aria-label": `Ver detalles de ${e.title}, ${W(K(e), { day: `numeric`, month: `long`, year: `numeric` })}`,
                          children: [
                            (0, q.jsxs)(`span`, {
                              className: `stack-date ${e.type}`,
                              children: [
                                (0, q.jsx)(`small`, {
                                  children: J[e.month].slice(0, 3),
                                }),
                                (0, q.jsx)(`strong`, { children: e.day }),
                                (0, q.jsx)(`span`, {
                                  children: W(K(e), {
                                    weekday: `short`,
                                  }).replace(`.`, ``),
                                }),
                              ],
                            }),
                            (0, q.jsxs)(`div`, {
                              className: `stack-event-content`,
                              children: [
                                (0, q.jsx)(`div`, {
                                  className: `stack-event-photo`,
                                  style: {
                                    backgroundImage: `url("${e.image}")`,
                                  },
                                  children: (0, q.jsx)(Y, { event: e }),
                                }),
                                (0, q.jsxs)(`div`, {
                                  className: `stack-event-details`,
                                  children: [
                                    (0, q.jsxs)(`h3`, {
                                      children: [
                                        e.title,
                                        (0, q.jsx)(C, { size: 19 }),
                                      ],
                                    }),
                                    (0, q.jsxs)(`p`, {
                                      children: [
                                        (0, q.jsx)(T, { size: 14 }),
                                        W(K(e), {
                                          day: `numeric`,
                                          month: `long`,
                                          year: `numeric`,
                                        }),
                                        ` · `,
                                        e.time,
                                        `–`,
                                        e.end,
                                      ],
                                    }),
                                    (0, q.jsxs)(`p`, {
                                      children: [
                                        (0, q.jsx)(F, { size: 14 }),
                                        e.place,
                                      ],
                                    }),
                                    (0, q.jsxs)(`span`, {
                                      className: `view-details`,
                                      children: [
                                        `Ver detalles `,
                                        (0, q.jsx)(C, { size: 13 }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        e.id,
                      ),
                    ),
                    _.filter((e) => K(e) >= r).length === 0 &&
                      (0, q.jsx)(`p`, {
                        className: `stack-empty`,
                        children: `Aún no hay próximos encuentros. Consulta las fechas de catering en la semana.`,
                      }),
                  ],
                })
            : (0, q.jsx)(`p`, {
                role: `status`,
                children: `Cargando encuentros…`,
              }),
          (0, q.jsx)(`p`, {
            className: `stack-sample`,
            children: _.some((e) => e.sample)
              ? `Encuentros de ejemplo · Fechas y sedes ilustrativas.`
              : `Horarios locales de Monterrey.`,
          }),
        ],
      }),
      (0, q.jsxs)(`section`, {
        className: `stack-week`,
        id: `calendario`,
        "aria-labelledby": `week-title`,
        children: [
          (0, q.jsxs)(`div`, {
            className: `stack-week-heading`,
            children: [
              (0, q.jsxs)(`div`, {
                children: [
                  (0, q.jsx)(`div`, {
                    className: `eyebrow`,
                    children: `TU PRÓXIMA PIZZA YA TIENE FECHA`,
                  }),
                  (0, q.jsx)(`h2`, {
                    id: `week-title`,
                    children: `Vista por semana`,
                  }),
                  (0, q.jsx)(`p`, { "aria-live": `polite`, children: G(i) }),
                ],
              }),
              (0, q.jsxs)(`div`, {
                className: `stack-week-nav`,
                children: [
                  (0, q.jsx)(`button`, {
                    className: `icon`,
                    "aria-label": `Semana anterior`,
                    onClick: () => d(V(i, -7)),
                    children: (0, q.jsx)(k, { size: 18 }),
                  }),
                  (0, q.jsx)(`button`, {
                    className: `icon`,
                    "aria-label": `Semana siguiente`,
                    onClick: () => d(V(i, 7)),
                    children: (0, q.jsx)(j, { size: 18 }),
                  }),
                  (0, q.jsx)(`button`, {
                    className: `today`,
                    onClick: m,
                    children: `Hoy`,
                  }),
                ],
              }),
            ],
          }),
          (0, q.jsx)(`div`, {
            className: `stack-filters`,
            "aria-label": `Filtrar calendarios`,
            children: [
              [`all`, `Todo`],
              [`catering`, `Catering`],
              [`popup`, `Pop-ups`],
              [`collab`, `Colaboraciones`],
            ].map(([e, t]) =>
              (0, q.jsxs)(
                `button`,
                {
                  "aria-pressed": s === e,
                  className: s === e ? `selected` : ``,
                  onClick: () => u(e),
                  children: [
                    e !== `all` && (0, q.jsx)(`i`, { className: e }),
                    (0, q.jsx)(`span`, { children: t }),
                  ],
                },
                e,
              ),
            ),
          }),
          (0, q.jsx)(`div`, {
            className: `compact-week`,
            "aria-label": `Calendario semanal`,
            children: b.map((e) => {
              let t = x.filter((t) => K(t) === e);
              return (0, q.jsxs)(
                `div`,
                {
                  className: `compact-week-day ${e === r ? `is-current` : ``} ${t.some((e) => e.type === `popup`) ? `popup-day` : ``} ${t.some((e) => e.type === `collab`) ? `collab-day` : ``}`,
                  "aria-label": W(e, {
                    weekday: `long`,
                    day: `numeric`,
                    month: `long`,
                  }),
                  children: [
                    (0, q.jsxs)(`div`, {
                      className: `compact-date`,
                      children: [
                        (0, q.jsx)(`small`, {
                          children: W(e, { weekday: `short` }).replace(`.`, ``),
                        }),
                        (0, q.jsx)(`strong`, { children: Number(e.slice(8)) }),
                        e === r && (0, q.jsx)(`span`, { children: `Hoy` }),
                      ],
                    }),
                    (0, q.jsx)(`div`, {
                      className: `compact-day-content`,
                      children: t.length
                        ? (0, q.jsx)(`div`, {
                            className: `compact-day-events`,
                            children: t.map((e) =>
                              (0, q.jsxs)(
                                `button`,
                                {
                                  className: `compact-event ${e.type}`,
                                  onClick: () => g(e),
                                  "aria-label": `Ver detalles de ${e.title}`,
                                  children: [
                                    (0, q.jsx)(`img`, {
                                      src: e.image,
                                      alt: ``,
                                    }),
                                    (0, q.jsxs)(`span`, {
                                      children: [
                                        (0, q.jsxs)(`small`, {
                                          children: [
                                            e.type === `popup`
                                              ? `Pop-up`
                                              : `Colaboración`,
                                            e.sample ? ` · Ejemplo` : ``,
                                          ],
                                        }),
                                        (0, q.jsx)(`strong`, {
                                          children: e.title,
                                        }),
                                        (0, q.jsxs)(`span`, {
                                          children: [e.time, `–`, e.end],
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                e.id,
                              ),
                            ),
                          })
                        : (0, q.jsxs)(`p`, {
                            children: [
                              c
                                ? l
                                  ? `Agenda no disponible`
                                  : e < r
                                    ? `Fecha pasada`
                                    : n.includes(e)
                                      ? `Catering reservado`
                                      : `Fecha para catering`
                                : `Consultando…`,
                              (0, q.jsx)(`small`, {
                                children:
                                  e >= r && !n.includes(e) && c && !l
                                    ? `Sujeto a confirmación`
                                    : ``,
                              }),
                            ],
                          }),
                    }),
                    M(e),
                  ],
                },
                e,
              );
            }),
          }),
          (0, q.jsxs)(`p`, {
            className: `stack-week-note`,
            children: [
              (0, q.jsx)(`span`, { className: `legend-dot popup` }),
              ` Pop-up `,
              (0, q.jsx)(`span`, { className: `legend-dot collab` }),
              ` Colaboración `,
              (0, q.jsx)(`span`, {
                children: `Catering sujeto a confirmación`,
              }),
            ],
          }),
        ],
      }),
      (0, q.jsxs)(`section`, {
        className: `stack-month`,
        id: `vista-mes`,
        "aria-labelledby": `month-title`,
        children: [
          (0, q.jsxs)(`a`, {
            className: `month-preview`,
            href: `#vista-mes`,
            children: [
              (0, q.jsxs)(`span`, {
                children: [
                  (0, q.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `EXPLORA TODAS LAS FECHAS`,
                  }),
                  (0, q.jsx)(`h2`, {
                    id: `month-title`,
                    children: `Vista por mes`,
                  }),
                ],
              }),
              (0, q.jsx)(y, { size: 23 }),
            ],
          }),
          (0, q.jsxs)(`div`, {
            className: `stack-month-heading`,
            children: [
              (0, q.jsxs)(`h3`, {
                children: [J[a], ` `, (0, q.jsx)(`span`, { children: o })],
              }),
              (0, q.jsxs)(`div`, {
                children: [
                  (0, q.jsx)(`button`, {
                    className: `icon`,
                    "aria-label": `Mes anterior`,
                    onClick: () => f(-1),
                    children: (0, q.jsx)(k, { size: 18 }),
                  }),
                  (0, q.jsx)(`button`, {
                    className: `icon`,
                    "aria-label": `Mes siguiente`,
                    onClick: () => f(1),
                    children: (0, q.jsx)(j, { size: 18 }),
                  }),
                  (0, q.jsx)(`button`, {
                    className: `today`,
                    onClick: p,
                    children: `Hoy`,
                  }),
                ],
              }),
            ],
          }),
          (0, q.jsxs)(`div`, {
            className: `month-calendar-scroll`,
            children: [
              (0, q.jsx)(`div`, {
                className: `stack-month-weekdays`,
                children: [`LUN`, `MAR`, `MIÉ`, `JUE`, `VIE`, `SÁB`, `DOM`].map(
                  (e) => (0, q.jsx)(`span`, { children: e }, e),
                ),
              }),
              (0, q.jsx)(`div`, {
                className: `stack-month-grid`,
                "aria-label": `Calendario de ${J[a]} de ${o}`,
                children: Array.from({ length: O }, (e, t) => {
                  let i = t - w + 1,
                    s = i < 1 || i > E,
                    c = new Date(Date.UTC(o, a, i)),
                    l = c.toISOString().slice(0, 10),
                    u = s ? [] : S.filter((e) => e.day === i);
                  return (0, q.jsxs)(
                    `div`,
                    {
                      className: `stack-month-day ${s ? `outside` : ``} ${l === r ? `is-current` : ``} ${n.includes(l) ? `is-booked` : ``}`,
                      children: [
                        (0, q.jsx)(`span`, {
                          className: `month-date`,
                          children: c.getUTCDate(),
                        }),
                        !s &&
                          (0, q.jsxs)(q.Fragment, {
                            children: [
                              (0, q.jsx)(`div`, {
                                className: `month-day-events`,
                                children: u.map((e) =>
                                  (0, q.jsxs)(
                                    `button`,
                                    {
                                      className: `month-mini-event ${e.type}`,
                                      onClick: () => g(e),
                                      "aria-label": `Ver detalles de ${e.title}, ${W(l, { day: `numeric`, month: `long` })}`,
                                      title: e.title,
                                      children: [
                                        (0, q.jsx)(`img`, {
                                          src: e.image,
                                          alt: ``,
                                        }),
                                        (0, q.jsx)(`span`, {
                                          children:
                                            e.type === `popup`
                                              ? `Pop-up`
                                              : `Colab.`,
                                        }),
                                      ],
                                    },
                                    e.id,
                                  ),
                                ),
                              }),
                              M(l, !0),
                            ],
                          }),
                      ],
                    },
                    l,
                  );
                }),
              }),
            ],
          }),
          (0, q.jsxs)(`div`, {
            className: `stack-month-legend`,
            children: [
              (0, q.jsxs)(`span`, {
                children: [
                  (0, q.jsx)(`i`, { className: `legend-dot popup` }),
                  ` Pop-ups`,
                ],
              }),
              (0, q.jsxs)(`span`, {
                children: [
                  (0, q.jsx)(`i`, { className: `legend-dot collab` }),
                  ` Colaboraciones`,
                ],
              }),
              (0, q.jsxs)(`span`, {
                children: [(0, q.jsx)(R, { size: 12 }), ` Solicitar catering`],
              }),
              (0, q.jsxs)(`span`, {
                children: [(0, q.jsx)(D, { size: 12 }), ` Reservado`],
              }),
            ],
          }),
          (0, q.jsx)(`p`, {
            className: `stack-sample`,
            children: `Las fechas de catering se confirman después de revisar tu solicitud.`,
          }),
          (0, q.jsxs)(`div`, {
            className: `catering-banner`,
            children: [
              (0, q.jsx)(`span`, { className: `banner-mark`, children: `✳` }),
              (0, q.jsxs)(`div`, {
                children: [
                  (0, q.jsx)(`div`, {
                    className: `eyebrow`,
                    children: `NOSOTROS LLEVAMOS LAS PIZZAS`,
                  }),
                  (0, q.jsx)(`h2`, { children: `Tú pones el motivo.` }),
                  (0, q.jsx)(`p`, {
                    children: `Celebraciones, equipos y momentos que merecen buena comida.`,
                  }),
                ],
              }),
              (0, q.jsxs)(`button`, {
                onClick: () => h(),
                children: [`Cuéntanos tu idea `, (0, q.jsx)(C, { size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
var X = [
    {
      sample: !0,
      id: 1,
      day: 14,
      month: 10,
      year: 2026,
      type: `popup`,
      title: `Un sábado para compartir`,
      place: `Patio de temporada · sede por confirmar`,
      time: `13:00`,
      end: `19:00`,
      image: `https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85`,
      description: `Pizza recién hecha, ingredientes de temporada y muchas ganas de encontrarnos. Una muestra de cómo se verán tus próximos pop-ups.`,
    },
    {
      sample: !0,
      id: 2,
      day: 20,
      month: 10,
      year: 2026,
      type: `collab`,
      title: `Pizza & vino`,
      place: `Cocina invitada · sede por confirmar`,
      time: `19:00`,
      end: `23:00`,
      image: `https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85`,
      description: `Una colaboración para descubrir sabores y conocer a quienes están detrás de cada plato. La ubicación y el menú se publicarán al confirmar el evento.`,
    },
    {
      sample: !0,
      id: 3,
      day: 28,
      month: 10,
      year: 2026,
      type: `popup`,
      title: `Sábado de pizza`,
      place: `Jardín de temporada · sede por confirmar`,
      time: `10:00`,
      end: `15:00`,
      image: `https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85`,
      description: `Sobremesas sin prisa y una cocina para disfrutar juntos. Este evento es una muestra; aún no está abierto al público.`,
    },
    {
      sample: !0,
      id: 4,
      day: 5,
      month: 11,
      year: 2026,
      type: `collab`,
      title: `La última pizza del año`,
      place: `Espacio colaborador · sede por confirmar`,
      time: `18:00`,
      end: `22:00`,
      image: `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85`,
      description: `Un encuentro para cerrar el año alrededor de la mesa. Evento de muestra, pendiente de fecha y sede reales.`,
    },
  ],
  oe = [
    `Enero`,
    `Febrero`,
    `Marzo`,
    `Abril`,
    `Mayo`,
    `Junio`,
    `Julio`,
    `Agosto`,
    `Septiembre`,
    `Octubre`,
    `Noviembre`,
    `Diciembre`,
  ],
  Z = (e) => String(e).padStart(2, `0`),
  Q = new Intl.DateTimeFormat(`en-CA`, {
    timeZone: `America/Monterrey`,
    year: `numeric`,
    month: `2-digit`,
    day: `2-digit`,
  })
    .formatToParts(new Date())
    .reduce((e, t) => (t.type !== `literal` && (e[t.type] = t.value), e), {}),
  $ = `${Q.year}-${Q.month}-${Q.day}`,
  se = Number($.slice(0, 4)),
  ce = Number($.slice(5, 7)) - 1;
function le() {
  let [e, t] = (0, p.useState)([]),
    [n, r] = (0, p.useState)(!1),
    [i, a] = (0, p.useState)(``),
    [o, s] = (0, p.useState)([]);
  (0, p.useEffect)(() => {
    Promise.all([fetch(`/api/eventos`), fetch(`/api/disponibilidad`)])
      .then(async ([e, n]) => {
        if (!e.ok || !n.ok) throw Error();
        let i = await e.json(),
          a = await n.json();
        (t(i.length ? i : X), s(a.map((e) => e.date)), r(!0));
        let o = new URLSearchParams(location.search).get(`evento`),
          c = (i.length ? i : X).find((e) => String(e.id) === o);
        c && (l(c.month), d(c.year), z(H(K(c))), g(c));
      })
      .catch(() => {
        (a(
          `No pudimos cargar la agenda. Recarga la página para consultar las fechas.`,
        ),
          r(!0));
      });
  }, []);
  let [c, l] = (0, p.useState)(ce),
    [u, d] = (0, p.useState)(se),
    [f, m] = (0, p.useState)(`all`),
    [h, g] = (0, p.useState)(null),
    [_, v] = (0, p.useState)(!1),
    [y, b] = (0, p.useState)(``),
    [S, w] = (0, p.useState)(1),
    [E, O] = (0, p.useState)(!1),
    [k, A] = (0, p.useState)(``),
    [j, M] = (0, p.useState)(``),
    [N, P] = (0, p.useState)(``),
    [I, L] = (0, p.useState)(!1),
    [R, z] = (0, p.useState)(() => H($)),
    B = (0, p.useRef)(null),
    V = (0, p.useRef)(null),
    U = (0, p.useRef)({});
  ((0, p.useEffect)(() => {
    h || _
      ? ((V.current = document.activeElement), B.current?.showModal())
      : (B.current?.close(), V.current?.focus());
  }, [h, _]),
    (0, p.useEffect)(() => {
      if (N) {
        let e = setTimeout(() => P(``), 3500);
        return () => clearTimeout(e);
      }
    }, [N]));
  function W(e) {
    let t = new Date(u, c + e, 1);
    (l(t.getMonth()), d(t.getFullYear()));
  }
  function G() {
    z(H($));
  }
  function J() {
    (v(!1), g(null), M(``));
  }
  function Y(e) {
    (g(null), b(e || ``), w(1), A(``), M(``), (U.current = {}), v(!0));
  }
  function Q(e) {
    let t = `${e.year}${Z(e.month + 1)}${Z(e.day)}`,
      n = (e) =>
        e
          .replace(/\\/g, `\\\\`)
          .replace(/\n/g, `\\n`)
          .replace(/,/g, `\\,`)
          .replace(/;/g, `\\;`),
      r = [
        `BEGIN:VCALENDAR`,
        `VERSION:2.0`,
        `PRODID:-//Knos Pizzas//Agenda//ES`,
        `BEGIN:VEVENT`,
        `UID:knos-${e.sample ? `example-` : ``}${e.id}@knos-pizzas.local`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, ``).split(`.`)[0]}Z`,
        `DTSTART;TZID=America/Monterrey:${t}T${e.time.replace(`:`, ``)}00`,
        `DTEND;TZID=America/Monterrey:${t}T${e.end.replace(`:`, ``)}00`,
        `SUMMARY:${n((e.sample ? `[MUESTRA] ` : ``) + e.title)}`,
        `LOCATION:${n(e.address || e.place)}`,
        `DESCRIPTION:` +
          n(
            e.sample
              ? `Evento de muestra. Fecha y sede pendientes de confirmación.`
              : e.description,
          ) +
          `\\nHorario local de Monterrey.`,
        `END:VEVENT`,
        `END:VCALENDAR`,
      ].join(`\r
`),
      i = URL.createObjectURL(
        new Blob([r], { type: `text/calendar;charset=utf-8` }),
      ),
      a = document.createElement(`a`);
    ((a.href = i),
      (a.download = `knos-evento.ics`),
      a.click(),
      setTimeout(() => URL.revokeObjectURL(i), 1e3),
      P(e.sample ? `Evento de muestra descargado` : `Evento descargado`));
  }
  async function le(e) {
    let t = new URL(location.href);
    t.searchParams.set(`evento`, String(e.id));
    try {
      navigator.share
        ? await navigator.share({
            title: e.title,
            text:
              (e.sample ? `Evento de muestra · ` : `Kno’s Pizzas · `) + e.title,
            url: t.href,
          })
        : (await navigator.clipboard.writeText(t.href), P(`Enlace copiado`));
    } catch {
      P(`No se pudo compartir. Puedes copiar el enlace del navegador.`);
    }
  }
  async function ue(e) {
    e.preventDefault();
    let t = Object.fromEntries(new FormData(e.currentTarget));
    if (((U.current = { ...U.current, ...t }), S === 1)) {
      if (o.includes(String(t.date))) {
        M(
          `Esta fecha ya tiene una reserva de catering confirmada. Elige otra fecha.`,
        );
        return;
      }
      (M(``), b(String(t.date)), w(2));
      return;
    }
    (O(!0), M(``));
    try {
      let e = await fetch(`/api/solicitudes`, {
          method: `POST`,
          headers: { "Content-Type": `application/json` },
          body: JSON.stringify({
            ...U.current,
            guests: Number(U.current.guests),
          }),
        }),
        t = await e.json();
      if (!e.ok) throw Error(t.error);
      (A(t.reference), w(3));
    } catch (e) {
      M(e instanceof Error ? e.message : `Intenta de nuevo.`);
    } finally {
      O(!1);
    }
  }
  return (0, q.jsxs)(q.Fragment, {
    children: [
      (0, q.jsxs)(`header`, {
        className: `stack-header`,
        children: [
          (0, q.jsxs)(`a`, {
            className: `brand`,
            href: `/`,
            "aria-label": `Kno’s Pizzas, inicio`,
            children: [
              `Kno’s`,
              (0, q.jsx)(`span`, { children: `✳` }),
              (0, q.jsx)(`small`, { children: `PIZZAS · CATERING & POP-UPS` }),
            ],
          }),
          (0, q.jsxs)(`nav`, {
            className: I ? `open` : ``,
            children: [
              (0, q.jsx)(`a`, {
                className: `active`,
                href: `#calendario`,
                onClick: () => L(!1),
                children: `Calendario`,
              }),
              (0, q.jsxs)(`a`, {
                href: `#encuentros`,
                onClick: () => L(!1),
                children: [
                  `Pop-ups & colaboraciones `,
                  (0, q.jsx)(C, { size: 13 }),
                ],
              }),
              (0, q.jsxs)(`button`, {
                className: `nav-book`,
                onClick: () => Y(),
                children: [`Planeemos tu evento `, (0, q.jsx)(C, { size: 15 })],
              }),
            ],
          }),
          (0, q.jsx)(`button`, {
            className: `mobile-menu icon`,
            "aria-label": `Abrir menú`,
            onClick: () => L(!I),
            children: (0, q.jsx)(ne, {}),
          }),
        ],
      }),
      (0, q.jsx)(ae, {
        events: e,
        reserved: o,
        today: $,
        week: R,
        month: c,
        year: u,
        filter: f,
        loaded: n,
        error: i,
        onFilter: m,
        onWeek: z,
        onMonth: W,
        onMonthToday: () => {
          (l(ce), d(se));
        },
        onToday: G,
        onBook: Y,
        onEvent: g,
      }),
      (0, q.jsxs)(`footer`, {
        children: [
          (0, q.jsx)(`a`, {
            className: `footer-brand`,
            href: `#`,
            children: `Kno’s Pizzas✳`,
          }),
          (0, q.jsx)(`span`, {
            children: `Pizza para compartir. Momentos para quedarse.`,
          }),
          (0, q.jsx)(`a`, {
            href: `/gestion`,
            children: `Gestionar agenda ↗`,
          }),
        ],
      }),
      (0, q.jsxs)(`dialog`, {
        ref: B,
        onCancel: J,
        onClick: (e) => {
          e.target === B.current && J();
        },
        "aria-labelledby": `dialog-title`,
        children: [
          (0, q.jsx)(`button`, {
            className: `close icon`,
            "aria-label": `Cerrar`,
            onClick: J,
            children: (0, q.jsx)(ie, { size: 20 }),
          }),
          h &&
            (0, q.jsxs)(q.Fragment, {
              children: [
                (0, q.jsx)(`div`, {
                  className: `detail-image`,
                  style: { backgroundImage: `url("${h.image}")` },
                }),
                (0, q.jsxs)(`div`, {
                  className: `dialog-content`,
                  children: [
                    (0, q.jsxs)(`span`, {
                      className: `pill ${h.type}`,
                      children: [
                        h.type === `popup` ? `Pop-up` : `Colaboración`,
                        h.sample ? ` · Muestra` : ``,
                      ],
                    }),
                    (0, q.jsx)(`h2`, { id: `dialog-title`, children: h.title }),
                    (0, q.jsxs)(`div`, {
                      className: `detail-meta`,
                      children: [
                        (0, q.jsxs)(`span`, {
                          children: [
                            (0, q.jsx)(T, {}),
                            h.day,
                            ` de `,
                            oe[h.month].toLowerCase(),
                            ` de `,
                            h.year,
                          ],
                        }),
                        (0, q.jsxs)(`span`, {
                          children: [
                            (0, q.jsx)(ee, {}),
                            h.time,
                            ` — `,
                            h.end,
                            ` · Hora de Monterrey`,
                          ],
                        }),
                        (0, q.jsxs)(`span`, {
                          children: [(0, q.jsx)(F, {}), h.place],
                        }),
                      ],
                    }),
                    (0, q.jsx)(`p`, { children: h.description }),
                    h.sample
                      ? (0, q.jsx)(`div`, {
                          className: `notice`,
                          children: `Fecha y sede ilustrativas. Este encuentro todavía no tiene ubicación confirmada ni admite reservas.`,
                        })
                      : (0, q.jsxs)(q.Fragment, {
                          children: [
                            (0, q.jsxs)(`p`, {
                              children: [
                                (0, q.jsx)(F, { size: 14 }),
                                ` `,
                                h.address,
                              ],
                            }),
                            (0, q.jsxs)(`a`, {
                              className: `secondary`,
                              href:
                                `https://www.google.com/maps/search/?api=1&query=` +
                                encodeURIComponent(h.address || h.place),
                              target: `_blank`,
                              rel: `noopener noreferrer`,
                              children: [
                                `Cómo llegar `,
                                (0, q.jsx)(C, { size: 16 }),
                              ],
                            }),
                          ],
                        }),
                    (0, q.jsxs)(`div`, {
                      className: `detail-buttons`,
                      children: [
                        (0, q.jsxs)(`button`, {
                          className: `primary`,
                          onClick: () => Q(h),
                          children: [
                            (0, q.jsx)(te, { size: 16 }),
                            h.sample
                              ? `Guardar fecha de muestra`
                              : `Añadir a mi calendario`,
                          ],
                        }),
                        (0, q.jsxs)(`button`, {
                          className: `secondary`,
                          onClick: () => le(h),
                          children: [(0, q.jsx)(re, { size: 16 }), `Compartir`],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          _ &&
            (0, q.jsxs)(`div`, {
              className: `dialog-content booking`,
              children: [
                (0, q.jsx)(`div`, {
                  className: `eyebrow`,
                  children: `UNA MESA A TU MEDIDA`,
                }),
                (0, q.jsx)(`h2`, {
                  id: `dialog-title`,
                  children:
                    S === 3
                      ? `Ya estamos cocinando tu idea.`
                      : `Planeemos algo rico.`,
                }),
                S < 3
                  ? (0, q.jsxs)(q.Fragment, {
                      children: [
                        (0, q.jsx)(`p`, {
                          children: `Cuéntanos lo esencial. La fecha se confirma después de revisar tu solicitud.`,
                        }),
                        (0, q.jsxs)(`div`, {
                          className: `steps`,
                          children: [
                            (0, q.jsx)(`span`, {
                              className: S === 1 ? `current` : ``,
                              children: `01 Tu evento`,
                            }),
                            (0, q.jsx)(`span`, {
                              className: S === 2 ? `current` : ``,
                              children: `02 Tus datos`,
                            }),
                          ],
                        }),
                        (0, q.jsx)(
                          `form`,
                          {
                            onSubmit: ue,
                            children:
                              S === 1
                                ? (0, q.jsxs)(q.Fragment, {
                                    children: [
                                      (0, q.jsxs)(`div`, {
                                        className: `form-row`,
                                        children: [
                                          (0, q.jsxs)(`label`, {
                                            children: [
                                              `Fecha`,
                                              (0, q.jsx)(`input`, {
                                                required: !0,
                                                type: `date`,
                                                name: `date`,
                                                min: $,
                                                defaultValue: y,
                                              }),
                                            ],
                                          }),
                                          (0, q.jsxs)(`label`, {
                                            children: [
                                              `Hora`,
                                              (0, q.jsx)(`input`, {
                                                required: !0,
                                                type: `time`,
                                                name: `time`,
                                                defaultValue:
                                                  U.current.time || `14:00`,
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, q.jsxs)(`div`, {
                                        className: `form-row`,
                                        children: [
                                          (0, q.jsxs)(`label`, {
                                            children: [
                                              `Invitados`,
                                              (0, q.jsx)(`input`, {
                                                required: !0,
                                                type: `number`,
                                                min: `1`,
                                                max: `1000`,
                                                name: `guests`,
                                                defaultValue:
                                                  U.current.guests || 30,
                                              }),
                                            ],
                                          }),
                                          (0, q.jsxs)(`label`, {
                                            children: [
                                              `Tipo de evento`,
                                              (0, q.jsxs)(`select`, {
                                                required: !0,
                                                name: `occasion`,
                                                defaultValue:
                                                  U.current.occasion || ``,
                                                children: [
                                                  (0, q.jsx)(`option`, {
                                                    value: ``,
                                                    disabled: !0,
                                                    children: `Selecciona una opción`,
                                                  }),
                                                  (0, q.jsx)(`option`, {
                                                    children: `Celebración privada`,
                                                  }),
                                                  (0, q.jsx)(`option`, {
                                                    children: `Evento de empresa`,
                                                  }),
                                                  (0, q.jsx)(`option`, {
                                                    children: `Boda`,
                                                  }),
                                                  (0, q.jsx)(`option`, {
                                                    children: `Otro encuentro`,
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, q.jsxs)(`label`, {
                                        children: [
                                          `¿Dónde será?`,
                                          (0, q.jsx)(`input`, {
                                            required: !0,
                                            maxLength: 250,
                                            name: `location`,
                                            placeholder: `Ciudad, zona o lugar del evento`,
                                            defaultValue: U.current.location,
                                          }),
                                        ],
                                      }),
                                      (0, q.jsxs)(`label`, {
                                        children: [
                                          `Algo que debamos saber `,
                                          (0, q.jsx)(`small`, {
                                            children: `(opcional)`,
                                          }),
                                          (0, q.jsx)(`textarea`, {
                                            maxLength: 2e3,
                                            name: `notes`,
                                            placeholder: `Tu idea, estilo de menú, restricciones alimentarias…`,
                                            defaultValue: U.current.notes,
                                          }),
                                        ],
                                      }),
                                      (0, q.jsx)(`p`, {
                                        className: `form-note`,
                                        children: `Cuéntanos cuántas personas asistirán. Sujeto a cobertura y disponibilidad.`,
                                      }),
                                      j &&
                                        (0, q.jsx)(`p`, {
                                          className: `form-error`,
                                          role: `alert`,
                                          children: j,
                                        }),
                                      (0, q.jsxs)(`button`, {
                                        className: `primary wide`,
                                        children: [
                                          `Continuar `,
                                          (0, q.jsx)(x, { size: 18 }),
                                        ],
                                      }),
                                    ],
                                  })
                                : (0, q.jsxs)(q.Fragment, {
                                    children: [
                                      (0, q.jsxs)(`div`, {
                                        className: `summary`,
                                        children: [
                                          (0, q.jsx)(T, { size: 18 }),
                                          new Date(
                                            y + `T12:00:00`,
                                          ).toLocaleDateString(`es-MX`, {
                                            day: `numeric`,
                                            month: `long`,
                                            year: `numeric`,
                                          }),
                                          ` · `,
                                          U.current.guests,
                                          ` personas`,
                                        ],
                                      }),
                                      (0, q.jsxs)(`label`, {
                                        children: [
                                          `Tu nombre`,
                                          (0, q.jsx)(`input`, {
                                            name: `name`,
                                            autoComplete: `name`,
                                            required: !0,
                                            maxLength: 150,
                                            defaultValue: U.current.name,
                                          }),
                                        ],
                                      }),
                                      (0, q.jsxs)(`label`, {
                                        children: [
                                          `Correo electrónico`,
                                          (0, q.jsx)(`input`, {
                                            name: `email`,
                                            autoComplete: `email`,
                                            type: `email`,
                                            required: !0,
                                            maxLength: 200,
                                            defaultValue: U.current.email,
                                          }),
                                        ],
                                      }),
                                      (0, q.jsxs)(`label`, {
                                        children: [
                                          `Teléfono`,
                                          (0, q.jsx)(`input`, {
                                            name: `phone`,
                                            autoComplete: `tel`,
                                            type: `tel`,
                                            required: !0,
                                            pattern: `[+0-9 ()\\-]{7,25}`,
                                            placeholder: `+52 81 1234 5678`,
                                            defaultValue: U.current.phone,
                                          }),
                                        ],
                                      }),
                                      (0, q.jsxs)(`label`, {
                                        className: `consent`,
                                        children: [
                                          (0, q.jsx)(`input`, {
                                            type: `checkbox`,
                                            required: !0,
                                          }),
                                          `Acepto que utilicen estos datos para gestionar y responder esta solicitud de catering.`,
                                        ],
                                      }),
                                      j &&
                                        (0, q.jsx)(`p`, {
                                          className: `form-error`,
                                          role: `alert`,
                                          children: j,
                                        }),
                                      (0, q.jsxs)(`button`, {
                                        className: `primary wide`,
                                        disabled: E,
                                        children: [
                                          E
                                            ? `Guardando solicitud…`
                                            : `Enviar solicitud`,
                                          (0, q.jsx)(C, { size: 18 }),
                                        ],
                                      }),
                                      (0, q.jsx)(`button`, {
                                        type: `button`,
                                        className: `back`,
                                        disabled: E,
                                        onClick: (e) => {
                                          let t = e.currentTarget.form;
                                          (t &&
                                            (U.current = {
                                              ...U.current,
                                              ...Object.fromEntries(
                                                new FormData(t),
                                              ),
                                            }),
                                            w(1));
                                        },
                                        children: `Volver a mi evento`,
                                      }),
                                    ],
                                  }),
                          },
                          S,
                        ),
                      ],
                    })
                  : (0, q.jsxs)(`div`, {
                      className: `success`,
                      children: [
                        (0, q.jsx)(`div`, {
                          className: `success-check`,
                          children: (0, q.jsx)(D, { size: 30 }),
                        }),
                        (0, q.jsx)(`p`, {
                          children: `Tu solicitud se guardó correctamente.`,
                        }),
                        (0, q.jsx)(`strong`, { children: k }),
                        (0, q.jsx)(`p`, {
                          children: `Conserva tu referencia. Es una solicitud pendiente; aún no confirma la fecha ni el servicio.`,
                        }),
                        (0, q.jsx)(`button`, {
                          className: `primary wide`,
                          onClick: J,
                          children: `Volver al calendario`,
                        }),
                      ],
                    }),
              ],
            }),
        ],
      }),
      N &&
        (0, q.jsxs)(`div`, {
          className: `toast`,
          role: `status`,
          children: [(0, q.jsx)(D, { size: 16 }), N],
        }),
    ],
  });
}
export { le as default };
