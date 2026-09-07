/** "Who's this?" — one big card per person on the counter. */

import { el } from '../ui.js'
import { shop } from '../store.js'
import { SHOP } from '../data.js'

export default function loginScreen(ctx) {
  return el(
    'section.login',
    null,
    el(
      'div.login__brand',
      null,
      el('h1.login__logo', null, SHOP.name),
      el('p.login__tag', null, SHOP.tagline),
    ),
    el('h2.login__ask', null, "Who's this?"),
    el(
      'div.login__people',
      null,
      shop.users.map((user) =>
        el(
          'button.person',
          { onclick: () => ctx.go('pin', { userId: user.id }) },
          el('span.person__initial', null, user.name.slice(0, 1).toUpperCase()),
          el('span.person__name', null, user.name),
        ),
      ),
    ),
  )
}
