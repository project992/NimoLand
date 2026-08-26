/**
 * Serialise a value for embedding inside a <script> tag.
 *
 * JSON.stringify alone is NOT safe here. The HTML parser ends a script element
 * at the first "</script", regardless of JSON quoting or type="application/json".
 * A customer whose name is  </script><img src=x onerror=alert(1)>  would break
 * out of the blob and run script on every page that renders their session.
 *
 * Escaping "<" to its < form keeps the JSON semantically identical
 * (JSON.parse yields the same string) while making the break-out impossible.
 *
 * U+2028 and U+2029 are escaped too: they are legal inside JSON strings, but
 * are line terminators to older JavaScript parsers.
 *
 * @param {unknown} value
 * @returns {string} JSON text that is safe between <script> and </script>
 */

// Referenced by code point rather than as literal characters, so the escaping
// cannot be silently broken by an editor or tool normalising the file.
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

const ESCAPES = {
  '<': '\\u003c',
  [LINE_SEP]: '\\u2028',
  [PARA_SEP]: '\\u2029',
};

const UNSAFE = new RegExp(`[<${LINE_SEP}${PARA_SEP}]`, 'g');

export function jsonForScript(value) {
  return JSON.stringify(value ?? null).replace(UNSAFE, ch => ESCAPES[ch]);
}
