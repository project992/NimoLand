import { e as createComponent, r as renderTemplate, o as renderSlot, p as renderHead, u as unescapeHTML, g as addAttribute, h as createAstro, m as maybeRenderHead, s as spreadAttributes, k as renderComponent } from './astro/server_rOUT-VGP.mjs';
import 'piccolore';
import 'clsx';
/* empty css                        */

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

function jsonForScript(value) {
  return JSON.stringify(value ?? null).replace(UNSAFE, ch => ESCAPES[ch]);
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Base;
  const { title, description } = Astro2.props;
  const user = Astro2.locals.user;
  return renderTemplate(_a || (_a = __template(['<html lang="id"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"', '><meta name="referrer" content="no-referrer"><title>', '</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet"><script type="application/json" id="session-data">', "<\/script>", '</head> <body class="bg-canvas text-ink"> ', ' <div id="toast" role="status" aria-live="polite" class="fixed left-1/2 -translate-x-1/2 bottom-8 z-[99] opacity-0 translate-y-4 pointer-events-none\n           bg-bark text-white text-sm font-heading px-5 py-3 rounded-full shadow-lg"></div> </body></html>'])), addAttribute(description, "content"), title, unescapeHTML(jsonForScript(user)), renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/idris/Desktop/nimo project/src/layouts/Base.astro", void 0);

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};

const $$Astro = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Icon;
  const {
    color = "currentColor",
    size = 24,
    "stroke-width": strokeWidth = 2,
    absoluteStrokeWidth = false,
    iconNode = [],
    class: className,
    ...rest
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes({
    ...defaultAttributes,
    width: size,
    height: size,
    stroke: color,
    "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
    ...!hasA11yProp(rest) && { "aria-hidden": "true" },
    ...rest
  })}${addAttribute(["lucide", className], "class:list")}> ${iconNode.map(([Tag, attrs]) => renderTemplate`${renderComponent($$result, "Tag", Tag, { ...attrs })}`)} ${renderSlot($$result, $$slots["default"])} </svg>`;
}, "C:/Users/idris/Desktop/nimo project/node_modules/@lucide/astro/src/Icon.astro", void 0);

const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const createLucideIcon = (iconName, iconNode) => {
  const Component = createComponent(
    ($$result, $$props, $$slots) => {
      const { class: className, ...restProps } = $$props;
      return renderTemplate`${renderComponent(
        $$result,
        "Icon",
        $$Icon,
        {
          class: mergeClasses(
            Boolean(iconName) && `lucide-${toKebabCase(iconName)}`,
            Boolean(className) && className
          ),
          iconNode,
          ...restProps
        },
        { default: () => renderTemplate`${renderSlot($$result, $$slots["default"])}` }
      )}`;
    },
    void 0,
    "none"
  );
  return Component;
};

export { $$Base as $, createLucideIcon as c, jsonForScript as j };
