/** Build a homepage link without escaping a project deployment's base. */
export function homeLink(path, base, cleanUrls) {
  const [, pathname, suffix = ''] = path.match(/^([^?#]*)(.*)$/)
  let target = pathname
  if (!cleanUrls && target !== '/' && !target.endsWith('.html')) {
    target += target.endsWith('/') ? 'index.html' : '.html'
  }
  return base.replace(/\/$/, '') + target + suffix
}
