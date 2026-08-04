import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_T2t5GGLI.mjs';
import { manifest } from './manifest_Z-Klam2Y.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/akun.astro.mjs');
const _page2 = () => import('./pages/api/auth/login.astro.mjs');
const _page3 = () => import('./pages/api/auth/logout.astro.mjs');
const _page4 = () => import('./pages/api/auth/me.astro.mjs');
const _page5 = () => import('./pages/api/auth/register.astro.mjs');
const _page6 = () => import('./pages/api/bookings.astro.mjs');
const _page7 = () => import('./pages/api/ess/login.astro.mjs');
const _page8 = () => import('./pages/api/ess/tickets.astro.mjs');
const _page9 = () => import('./pages/api/ess/verify.astro.mjs');
const _page10 = () => import('./pages/login.astro.mjs');
const _page11 = () => import('./pages/register.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/akun.astro", _page1],
    ["src/pages/api/auth/login.js", _page2],
    ["src/pages/api/auth/logout.js", _page3],
    ["src/pages/api/auth/me.js", _page4],
    ["src/pages/api/auth/register.js", _page5],
    ["src/pages/api/bookings.js", _page6],
    ["src/pages/api/ess/login.js", _page7],
    ["src/pages/api/ess/tickets.js", _page8],
    ["src/pages/api/ess/verify.js", _page9],
    ["src/pages/login.astro", _page10],
    ["src/pages/register.astro", _page11],
    ["src/pages/index.astro", _page12]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "24b7a70e-d96d-400b-961d-666fc120d5ad",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
