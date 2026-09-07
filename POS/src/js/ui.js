/** Tiny DOM helpers. No framework — the whole app is a handful of screens. */

/**
 * el('button.big', { onclick }, 'Label') — tag#id.class shorthand, props by
 * name (on* become listeners), children as strings or nodes.
 */
export function el(spec, props, ...children) {
  const [head, ...classes] = spec.split('.')
  const [tag, id] = head.split('#')
  const node = document.createElement(tag || 'div')
  if (id) node.id = id
  if (classes.length) node.className = classes.join(' ')

  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue
    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2), value)
    } else if (key === 'class') {
      node.className = [node.className, value].filter(Boolean).join(' ')
    } else if (key === 'html') {
      node.innerHTML = value
    } else if (key in node && key !== 'list') {
      node[key] = value
    } else {
      node.setAttribute(key, value === true ? '' : value)
    }
  }

  append(node, children)
  return node
}

function append(node, children) {
  for (const child of children.flat(4)) {
    if (child == null || child === false) continue
    node.append(child instanceof Node ? child : document.createTextNode(String(child)))
  }
  return node
}

export function clear(node) {
  node.replaceChildren()
  return node
}

/** Whole rupees — the counter never deals in paise. */
export function money(n) {
  return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN')
}

/** Locks/unlocks page scroll while a modal is up. */
export function lockScroll(locked) {
  document.body.classList.toggle('is-locked', locked)
}
