/**
 * Pure TypeScript allowlist HTML sanitizer.
 * Works on server and edge runtimes (no DOM API).
 */

const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 's', 'ul', 'ol', 'li',
  'a', 'blockquote', 'p', 'br', 'span',
]);

/** Strip dangerous URI schemes */
function sanitizeHref(href: string): string {
  const trimmed = href.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return '#';
  }
  return href;
}

/** Remove all on* event attributes and dangerous attrs from a tag string */
function sanitizeAttrs(tagName: string, attrString: string): string {
  if (tagName === 'a') {
    const hrefMatch = attrString.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*))/i);
    if (hrefMatch) {
      const href = hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '';
      return ` href="${sanitizeHref(href)}" rel="noopener noreferrer"`;
    }
    return '';
  }
  if (tagName === 'span') {
    const mentionMatch = attrString.match(/data-mention-id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*))/i);
    if (mentionMatch) {
      const id = mentionMatch[1] ?? mentionMatch[2] ?? mentionMatch[3] ?? '';
      // Only allow alphanumeric/dash/underscore IDs
      if (/^[a-zA-Z0-9_-]+$/.test(id)) {
        return ` data-mention-id="${id}"`;
      }
    }
    return '';
  }
  return '';
}

/**
 * Sanitize HTML string using an allowlist of tags.
 * Strips script, iframe, svg, img, style, and all on* attrs.
 */
export function sanitizeKudoHtml(html: string): string {
  if (!html) return '';

  // Remove dangerous block-level elements entirely (including content)
  let result = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '');

  // Process remaining tags
  result = result.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, slash, rawTag, attrs) => {
    const tag = rawTag.toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    if (slash) {
      // Closing tag — no attributes needed
      return `</${tag}>`;
    }

    const safeAttrs = sanitizeAttrs(tag, attrs);
    return `<${tag}${safeAttrs}>`;
  });

  return result;
}
