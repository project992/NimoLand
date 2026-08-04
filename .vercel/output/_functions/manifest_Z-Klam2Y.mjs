import 'piccolore';
import { q as decodeKey } from './chunks/astro/server_rOUT-VGP.mjs';
import 'clsx';
import './chunks/astro-designed-error-pages_C4ngcWkh.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_9uxEZYXv.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/idris/Desktop/nimo%20project/","cacheDir":"file:///C:/Users/idris/Desktop/nimo%20project/node_modules/.astro/","outDir":"file:///C:/Users/idris/Desktop/nimo%20project/dist/","srcDir":"file:///C:/Users/idris/Desktop/nimo%20project/src/","publicDir":"file:///C:/Users/idris/Desktop/nimo%20project/public/","buildClientDir":"file:///C:/Users/idris/Desktop/nimo%20project/dist/client/","buildServerDir":"file:///C:/Users/idris/Desktop/nimo%20project/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/akun.B_oDExM7.css"}],"routeData":{"route":"/akun","isIndex":false,"type":"page","pattern":"^\\/akun\\/?$","segments":[[{"content":"akun","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/akun.astro","pathname":"/akun","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/login.js","pathname":"/api/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/logout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/logout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/logout.js","pathname":"/api/auth/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/me","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/me\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"me","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/me.js","pathname":"/api/auth/me","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/register\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/register.js","pathname":"/api/auth/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/bookings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/bookings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"bookings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/bookings.js","pathname":"/api/bookings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/ess/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ess\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ess","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ess/login.js","pathname":"/api/ess/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/ess/tickets","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ess\\/tickets\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ess","dynamic":false,"spread":false}],[{"content":"tickets","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ess/tickets.js","pathname":"/api/ess/tickets","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/ess/verify","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ess\\/verify\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ess","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ess/verify.js","pathname":"/api/ess/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/akun.B_oDExM7.css"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/akun.B_oDExM7.css"}],"routeData":{"route":"/register","isIndex":false,"type":"page","pattern":"^\\/register\\/?$","segments":[[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/register.astro","pathname":"/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/akun.B_oDExM7.css"},{"type":"inline","content":".nav-account[data-astro-cid-5blmo7yk]{color:#fff;border-color:#ffffff4d}.nav-account[data-astro-cid-5blmo7yk]:hover{background:#ffffff1f}#navbar.scrolled .nav-account[data-astro-cid-5blmo7yk],#navbar.solid .nav-account[data-astro-cid-5blmo7yk]{color:var(--color-ink);border-color:var(--color-line)}#navbar.scrolled .nav-account[data-astro-cid-5blmo7yk]:hover,#navbar.solid .nav-account[data-astro-cid-5blmo7yk]:hover{background:var(--color-paper)}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/idris/Desktop/nimo project/src/pages/akun.astro",{"propagation":"none","containsHead":true}],["C:/Users/idris/Desktop/nimo project/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/idris/Desktop/nimo project/src/pages/login.astro",{"propagation":"none","containsHead":true}],["C:/Users/idris/Desktop/nimo project/src/pages/register.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:src/pages/akun@_@astro":"pages/akun.astro.mjs","\u0000@astro-page:src/pages/api/auth/login@_@js":"pages/api/auth/login.astro.mjs","\u0000@astro-page:src/pages/api/auth/logout@_@js":"pages/api/auth/logout.astro.mjs","\u0000@astro-page:src/pages/api/auth/me@_@js":"pages/api/auth/me.astro.mjs","\u0000@astro-page:src/pages/api/auth/register@_@js":"pages/api/auth/register.astro.mjs","\u0000@astro-page:src/pages/api/bookings@_@js":"pages/api/bookings.astro.mjs","\u0000@astro-page:src/pages/api/ess/login@_@js":"pages/api/ess/login.astro.mjs","\u0000@astro-page:src/pages/api/ess/tickets@_@js":"pages/api/ess/tickets.astro.mjs","\u0000@astro-page:src/pages/api/ess/verify@_@js":"pages/api/ess/verify.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/register@_@astro":"pages/register.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Z-Klam2Y.mjs","C:/Users/idris/Desktop/nimo project/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_B5onfXbY.mjs","C:/Users/idris/Desktop/nimo project/src/pages/akun.astro?astro&type=script&index=0&lang.ts":"_astro/akun.astro_astro_type_script_index_0_lang.DnT-YZdV.js","C:/Users/idris/Desktop/nimo project/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CPeAkVRF.js","C:/Users/idris/Desktop/nimo project/src/pages/login.astro?astro&type=script&index=0&lang.ts":"_astro/login.astro_astro_type_script_index_0_lang.CCwFi4v8.js","C:/Users/idris/Desktop/nimo project/src/pages/register.astro?astro&type=script&index=0&lang.ts":"_astro/register.astro_astro_type_script_index_0_lang.CS34vegf.js","C:/Users/idris/Desktop/nimo project/node_modules/html2canvas/dist/html2canvas.esm.js":"_astro/html2canvas.esm.B0tyYwQk.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/idris/Desktop/nimo project/src/pages/akun.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\"[data-logout]\").forEach(e=>e.addEventListener(\"click\",async()=>{await fetch(\"/api/auth/logout\",{method:\"POST\",credentials:\"same-origin\"}),window.location.href=\"/\"}));"],["C:/Users/idris/Desktop/nimo project/src/pages/login.astro?astro&type=script&index=0&lang.ts","const l=document.getElementById(\"loginForm\"),t=document.getElementById(\"loginBtn\"),e=document.getElementById(\"loginError\"),o=t.innerHTML;l.addEventListener(\"submit\",async r=>{r.preventDefault(),e.classList.add(\"hidden\");const i=document.getElementById(\"email\").value.trim(),d=document.getElementById(\"password\").value,s=document.getElementById(\"nextUrl\").value;if(!i||!d){e.textContent=\"Email dan password wajib diisi.\",e.classList.remove(\"hidden\");return}t.disabled=!0,t.textContent=\"Memeriksa…\";let n,a;try{n=await fetch(\"/api/auth/login\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},credentials:\"same-origin\",body:JSON.stringify({email:i,password:d,next:s})}),a=await n.json()}catch{t.disabled=!1,t.innerHTML=o,e.textContent=\"Tidak dapat menghubungi server. Periksa koneksi Anda.\",e.classList.remove(\"hidden\");return}if(!n.ok){t.disabled=!1,t.innerHTML=o,e.textContent=a?.error??\"Tidak dapat masuk. Coba lagi.\",e.classList.remove(\"hidden\");return}window.location.href=a.next||s||\"/\"});"],["C:/Users/idris/Desktop/nimo project/src/pages/register.astro?astro&type=script&index=0&lang.ts","const o=document.getElementById(\"registerForm\"),t=document.getElementById(\"registerBtn\"),i=document.getElementById(\"registerError\"),s=t.innerHTML;o.addEventListener(\"submit\",async a=>{a.preventDefault(),i.classList.add(\"hidden\");const n={name:document.getElementById(\"name\").value.trim(),email:document.getElementById(\"email\").value.trim(),phone:document.getElementById(\"phone\").value.trim(),password:document.getElementById(\"password\").value};if(n.name.length<3)return e(\"Nama minimal 3 karakter.\");if(!n.email)return e(\"Email wajib diisi.\");if(n.password.length<8)return e(\"Password minimal 8 karakter.\");t.disabled=!0,t.textContent=\"Mendaftarkan…\";let r,d;try{r=await fetch(\"/api/auth/register\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},credentials:\"same-origin\",body:JSON.stringify(n)}),d=await r.json()}catch{return e(\"Tidak dapat menghubungi server. Periksa koneksi Anda.\")}if(!r.ok)return e(d?.error??\"Pendaftaran gagal. Coba lagi.\");window.location.href=document.getElementById(\"nextUrl\").value||\"/\"});function e(a){t.disabled=!1,t.innerHTML=s,i.textContent=a,i.classList.remove(\"hidden\")}"]],"assets":["/_astro/akun.B_oDExM7.css","/_astro/html2canvas.esm.B0tyYwQk.js","/_astro/index.astro_astro_type_script_index_0_lang.CPeAkVRF.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"wKyCuOjrgmg9yg9FrXDkFiLJkCYmQoGh23sbUiUkJ68="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
