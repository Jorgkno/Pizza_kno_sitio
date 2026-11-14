import { r as e } from "./rolldown-runtime-C60lm6uB.js";
import { i as t, r as n } from "./framework-D_rUT4EX.js";
var r = e(t(), 1),
  i = n();
function a() {
  let [e, t] = (0, r.useState)([]),
    [n, a] = (0, r.useState)([]),
    [o, s] = (0, r.useState)(``),
    [c, l] = (0, r.useState)(!1),
    [u, d] = (0, r.useState)(!1),
    [f, p] = (0, r.useState)(`requests`),
    [m, h] = (0, r.useState)(``);
  async function g() {
    try {
      let e = await fetch(`/api/admin`),
        n = await e.json();
      if (!e.ok) throw Error(n.error);
      (t(n), l(!0));
      let r = await fetch(`/api/eventos`);
      if (!r.ok) throw Error(`No pudimos cargar los eventos.`);
      a(await r.json());
    } catch (e) {
      s(e instanceof Error ? e.message : `Error de conexión.`);
    }
  }
  (0, r.useEffect)(() => {
    g();
  }, []);
  async function _(e, t) {
    (d(!0), s(``));
    try {
      let n = await fetch(`/api/admin`, {
        method: `PATCH`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify({ id: e, status: t }),
      });
      if (!n.ok) {
        let e = await n.json();
        throw Error(e.error);
      }
      (await g(),
        h(
          `Estado actualizado. La confirmación al cliente debe enviarse por separado.`,
        ));
    } catch (e) {
      s(String(e));
    } finally {
      d(!1);
    }
  }
  async function v(e) {
    e.preventDefault();
    let t = e.currentTarget;
    (d(!0), s(``));
    try {
      let e = await fetch(`/api/eventos`, {
          method: `POST`,
          headers: { "Content-Type": `application/json` },
          body: JSON.stringify(Object.fromEntries(new FormData(t))),
        }),
        n = await e.json();
      if (!e.ok) throw Error(n.error);
      (t.reset(), await g(), h(`Encuentro publicado en el calendario.`));
    } catch (e) {
      s(e instanceof Error ? e.message : `Error al guardar.`);
    } finally {
      d(!1);
    }
  }
  async function y(e) {
    if (confirm(`¿Eliminar este encuentro del calendario?`)) {
      d(!0);
      try {
        if (!(await fetch(`/api/eventos?id=` + e, { method: `DELETE` })).ok)
          throw Error(`No se pudo eliminar.`);
        await g();
      } catch (e) {
        s(String(e));
      } finally {
        d(!1);
      }
    }
  }
  return (0, i.jsxs)(`main`, {
    className: `admin`,
    children: [
      (0, i.jsx)(`a`, { href: `/`, children: `← Volver al calendario` }),
      (0, i.jsx)(`div`, {
        className: `eyebrow`,
        children: `KNO’S PIZZAS · PANEL PRIVADO`,
      }),
      (0, i.jsx)(`h1`, { children: `Tu agenda, en tus manos.` }),
      (0, i.jsx)(`p`, {
        children: `Gestiona solicitudes y publica dónde estará Kno’s Pizzas.`,
      }),
      o &&
        (0, i.jsx)(`p`, {
          className: `form-error`,
          role: `alert`,
          children: o,
        }),
      c
        ? (0, i.jsxs)(i.Fragment, {
            children: [
              (0, i.jsxs)(`div`, {
                className: `admin-tabs`,
                children: [
                  (0, i.jsxs)(`button`, {
                    className: `secondary`,
                    onClick: () => p(`requests`),
                    children: [`Solicitudes (`, e.length, `)`],
                  }),
                  (0, i.jsxs)(`button`, {
                    className: `secondary`,
                    onClick: () => p(`events`),
                    children: [`Pop-ups y colaboraciones (`, n.length, `)`],
                  }),
                ],
              }),
              m &&
                (0, i.jsx)(`p`, {
                  className: `notice`,
                  role: `status`,
                  children: m,
                }),
              f === `requests`
                ? (0, i.jsxs)(i.Fragment, {
                    children: [
                      (0, i.jsx)(`p`, {
                        className: `notice`,
                        children: `Las solicitudes no envían correos automáticos. Contacta al cliente para cotizar y confirmar los detalles antes de marcar la reserva como confirmada.`,
                      }),
                      e.length === 0 &&
                        (0, i.jsx)(`p`, {
                          children: `Aún no hay solicitudes. Aparecerán aquí cuando un cliente envíe el formulario.`,
                        }),
                      e.map((e) =>
                        (0, i.jsxs)(
                          `article`,
                          {
                            className: `admin-request`,
                            children: [
                              (0, i.jsxs)(`div`, {
                                className: `admin-request-heading`,
                                children: [
                                  (0, i.jsx)(`h2`, { children: e.name }),
                                  (0, i.jsx)(`span`, {
                                    className: `pill`,
                                    children: {
                                      pending: `Pendiente`,
                                      confirmed: `Confirmada`,
                                      cancelled: `Cancelada`,
                                    }[e.status],
                                  }),
                                ],
                              }),
                              (0, i.jsx)(`p`, {
                                children: (0, i.jsxs)(`strong`, {
                                  children: [
                                    e.date,
                                    ` · `,
                                    e.time,
                                    ` · `,
                                    e.guests,
                                    ` personas`,
                                  ],
                                }),
                              }),
                              (0, i.jsxs)(`p`, {
                                children: [e.occasion, ` · `, e.location],
                              }),
                              (0, i.jsx)(`p`, {
                                children: e.notes || `Sin notas adicionales`,
                              }),
                              (0, i.jsxs)(`p`, {
                                children: [
                                  (0, i.jsx)(`a`, {
                                    href: `mailto:` + e.email,
                                    children: e.email,
                                  }),
                                  ` · `,
                                  (0, i.jsx)(`a`, {
                                    href: `tel:` + e.phone,
                                    children: e.phone,
                                  }),
                                ],
                              }),
                              (0, i.jsxs)(`small`, {
                                children: [
                                  `Referencia: KNO-`,
                                  e.id.slice(0, 8).toUpperCase(),
                                ],
                              }),
                              (0, i.jsx)(`div`, {
                                className: `admin-tabs`,
                                children: [
                                  [`confirmed`, `Confirmar`],
                                  [`cancelled`, `Cancelar`],
                                  [`pending`, `Marcar pendiente`],
                                ].map(([t, n]) =>
                                  (0, i.jsx)(
                                    `button`,
                                    {
                                      disabled: u || e.status === t,
                                      className: `secondary`,
                                      onClick: () => _(e.id, t),
                                      children: n,
                                    },
                                    t,
                                  ),
                                ),
                              }),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    ],
                  })
                : (0, i.jsxs)(`div`, {
                    className: `admin-columns`,
                    children: [
                      (0, i.jsxs)(`section`, {
                        children: [
                          (0, i.jsx)(`h2`, {
                            children: `Publicar un encuentro`,
                          }),
                          (0, i.jsxs)(`form`, {
                            onSubmit: v,
                            children: [
                              (0, i.jsxs)(`label`, {
                                children: [
                                  `Título`,
                                  (0, i.jsx)(`input`, {
                                    required: !0,
                                    name: `title`,
                                    maxLength: 120,
                                  }),
                                ],
                              }),
                              (0, i.jsxs)(`label`, {
                                children: [
                                  `Tipo`,
                                  (0, i.jsxs)(`select`, {
                                    name: `type`,
                                    children: [
                                      (0, i.jsx)(`option`, {
                                        value: `popup`,
                                        children: `Pop-up`,
                                      }),
                                      (0, i.jsx)(`option`, {
                                        value: `collab`,
                                        children: `Colaboración`,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, i.jsxs)(`div`, {
                                className: `form-row`,
                                children: [
                                  (0, i.jsxs)(`label`, {
                                    children: [
                                      `Fecha`,
                                      (0, i.jsx)(`input`, {
                                        required: !0,
                                        type: `date`,
                                        name: `date`,
                                      }),
                                    ],
                                  }),
                                  (0, i.jsxs)(`label`, {
                                    children: [
                                      `Sede`,
                                      (0, i.jsx)(`input`, {
                                        required: !0,
                                        name: `place`,
                                        maxLength: 200,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, i.jsxs)(`label`, {
                                children: [
                                  `Dirección completa`,
                                  (0, i.jsx)(`input`, {
                                    required: !0,
                                    name: `address`,
                                    maxLength: 500,
                                    placeholder: `Calle, número, ciudad y estado`,
                                  }),
                                ],
                              }),
                              (0, i.jsxs)(`div`, {
                                className: `form-row`,
                                children: [
                                  (0, i.jsxs)(`label`, {
                                    children: [
                                      `Hora de inicio`,
                                      (0, i.jsx)(`input`, {
                                        required: !0,
                                        type: `time`,
                                        name: `time`,
                                      }),
                                    ],
                                  }),
                                  (0, i.jsxs)(`label`, {
                                    children: [
                                      `Hora de cierre`,
                                      (0, i.jsx)(`input`, {
                                        required: !0,
                                        type: `time`,
                                        name: `end`,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, i.jsxs)(`label`, {
                                children: [
                                  `Descripción`,
                                  (0, i.jsx)(`textarea`, {
                                    required: !0,
                                    name: `description`,
                                    maxLength: 2e3,
                                  }),
                                ],
                              }),
                              (0, i.jsx)(`p`, {
                                className: `form-note`,
                                children: `Hora local de Monterrey. Los encuentros terminan el mismo día.`,
                              }),
                              (0, i.jsx)(`button`, {
                                disabled: u,
                                className: `primary wide`,
                                children: u
                                  ? `Guardando…`
                                  : `Publicar en calendario`,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsxs)(`section`, {
                        children: [
                          (0, i.jsx)(`h2`, {
                            children: `Encuentros publicados`,
                          }),
                          n.length === 0 &&
                            (0, i.jsx)(`p`, {
                              children: `La agenda muestra ejemplos hasta que publiques tu primer encuentro real.`,
                            }),
                          n.map((e) =>
                            (0, i.jsxs)(
                              `article`,
                              {
                                className: `admin-request`,
                                children: [
                                  (0, i.jsx)(`h3`, { children: e.title }),
                                  (0, i.jsxs)(`p`, {
                                    children: [
                                      e.day,
                                      `/`,
                                      e.month + 1,
                                      `/`,
                                      e.year,
                                      ` · `,
                                      e.place,
                                    ],
                                  }),
                                  (0, i.jsx)(`button`, {
                                    className: `secondary`,
                                    disabled: u,
                                    onClick: () => y(e.id),
                                    children: `Eliminar encuentro`,
                                  }),
                                ],
                              },
                              e.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
            ],
          })
        : (0, i.jsx)(`a`, {
            className: `primary`,
            href: `/signin-with-chatgpt?return_to=/gestion`,
            target: `_top`,
            children: `Entrar con la cuenta propietaria`,
          }),
    ],
  });
}
export { a as default };
