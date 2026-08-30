/* Content + data, shared by the server and the client SPA. Hotel room rates
   live in src/data/pricing.json (single source of truth), imported below. */

import pricing from '../data/pricing.json' with { type: 'json' };

const HOTEL_RATES = pricing.hotel_rates;

/** Master switch for the whole situs: while true, every "simulation / demo /
 *  placeholder" notice is shown (payment not connected, tariff not final,
 *  e-ticket simulated, badge name not filed). Flip to false on production. */
export const IS_DEMO_MODE = true;

/** Company details single source: the fill-in badges in the UI read from here
 *  instead of hard-coded strings, so going live is a one-line edit. */
export const COMPANY = {
  legalName: 'PT Nimo Kreasindo Utama',
  email: 'official@nimoenterprise.com',
};

const G = 'https://lh3.googleusercontent.com/sitesv/';

export const IMG = {
  hero      : G + 'AG8ngQWBpj62NH-sryt3zUUZ3FH79mhb-xb8HCge3luyDmls4uTsS-qCyQctfyqL7Ki_CXwbw4OYeMSh99ho2FJeM3rk5kwnIuqGOAlKO9aolbco13TIMnsEHu8TGayRi2j-3H5s7b6PZtvtUpUB6TVTD4qZInFcn95pyZpWMsZOhOkwsH9ToSfqhmm_F23j=w16383',
  mist      : G + 'AG8ngQWhvIldQCn-PP39-vaHh7ta5zZz8N1zsHOue73wHjpO7hvMzO_uPtX5HibcFKI5zcXQ3jRAa3vWHwZN5GOLHuHvouGH76Nvg18WvOTCJC5TSPh3OCwRcL2KFExegH6Rqcx8YePj64snZaHTBrQ_lEsWGPxBECCx1w0cgwr7R7cPqpgzx9hBJnOP_MLN8aeMxtu6Smo9o3eLbOEUmrCvIi3ZkBlTeo9sq1Nuase_=w1280',
  light     : G + 'AG8ngQV0fx8_JTY17NC4bGScGuYa8l7o-Te9aELus4XVx5iazxjM9OqojPB7emweH-drW-5PTGKN9y_ARJWxm9vVAv2KsQYDoOsz6See7qdLKyk1rGW16uL6z5-y6pYv-du6gX_0jPuibA_UWl6YO8YCV8XLr4cpP88WLecWmbOgS1VcxfEIHMOJweOqObvL=w1280',
  epic      : G + 'AG8ngQX9ISK8yMUgk7ood48y4hlix_dvLyxfWdxRLoY4Mx1UaLC38gaMLcJp53Yk0_9tbHerjeoVcO1Ls8M5AkB6T0sz89YIcI9spG2W-gdswUWdu7waQH-U9PNMKPVRZfJbKwuWIV8_bP2KOacBiglpGatll2p8DGatYKGz0Ql_-VG1S01j45T1zkdMw2OHXzU=w1280',
  sunrise   : G + 'AG8ngQXyN2cqa6dtV0LpNgVDGOEiXZ8GbgOxvadjQTtF2plx7s6r0Rb4uXQXEc4cLjJQ1lx5Emv7h0IXkJrOtZOvTKPdPWPQXXWJaTay1eOFtXvJVQe_9taFk44EwWw6OKTzXwtlGWUReh2_9iJi_t3gjrWh_-akNHAi9TVaE947d91_a5OdVQkb6qq4yvWpc1iFbm-oymI-GYyVllaH_tv2R5P1HcXZSwJAZk3WbrMj8c0=w1280',
  act1      : G + 'AG8ngQUhbXDX_1XPzu1cRb-5LqRajfZE5EA9wdeJcbHQPe9ZfLOw5qezcjRNC5fMO0o8dEI0H4ZPvEeV0EcNOQt-sTSZ_KvfctRQ8HEsKD1elVWiexm8Il0N-c2nPxqhUokgsV95Af_nDUOjPFxOCQiY4f0eRlEG20mmH3VCMrEz4ZmQpgRd_aBR612B8tIuB3e2M9PRuUgfBSZE68hdmfPHsQOFqwq-6LtDIVIjixKg=w1280',
  act2      : G + 'AG8ngQWmR7W9PuRcPOQhVJQZugueoQAjBb2v04o_6P-UvzstE9lCMzH63TsJ0ognXnGyi4xEM1nueH_MJTV_F9EJADkeozdUt4Ese5qvSfh4ustZd9-ae4ypI_AOazF6YJcRY6k340-_rscWkUgMKF4jAelMKZVBRROuDO1RjVdO2gvLAKiDJFkDazn0QSCubjE=w1280',
  act3      : G + 'AG8ngQXmVY5trD--fyftPNyJhpFIyQev-3WPll4S3frOLt54XayeiskZ3-3midDwhJrFUWQ8I298Yp4XPvI8SZjBREMelYMvut9xLL92tSfAwcWFnn8eY5D5dvbKuaB_ioJpbDZvm4y8N6JN0-bG8wa1NOvuKdBf7qC5zfS7t9yeuGc-1c5aubWdJm3hpcGt0qc=w1280',
  act4      : G + 'AG8ngQVcsr6h-1AcK886LNDP5OmkZsk7RwtRkuZfi2b-Y8vTJo1oqlRXiJl6TynmOqONX0ZyGcSX3BAYn0ANYByg6WTMTLi2QC54ra5dcY5kyWpwjY1HSM4FPToasMy31wVtkKSC6MKmuDMfoTNAmrqBXoPXXKekzwH1Sr03NyTtzk8wsEuHa5eoSoKfdI0DxLCEYKWEw4z10W-qGjXx53t1XD_RO3jFk4YFMkD6AgpugcQ=w1280',
  act5      : G + 'AG8ngQVFd_X1QlavLv2gHD_1p2Kvh2jc4-Dg1d6M7GuUK2KWL6WcQ7MOZnGNGc1lBPyd4qczZqX01NwMKOkfOiW_pHr8X818vhjXjX9SW0ZhpuY85x-TAo-ll_csy3nGV4kWv4rb_LkvlXhuS9QL_HAgf2ktpCuBSjL6DUlZKsJRKu8w9r0cogXXpQMIl_Xe1A0=w1280',
  act6      : G + 'AG8ngQUoZxacm5P3hIvlOkUOqM29gSnPZaAHoTwzUa0HZ7ZoB0EI8pJvxgmq5LHdmZoh9bR_x0-UQ_Kol766a7fxDYbvQC3X8FWAgtGHlVyZ-Ccgrh2ZGP7071NkOhUBvkvv2ceIPmQ1v2LfdQK49PBze7OS61dKtxCm9fQerUSNBE_6D-235YTGyJIkPJnv_rw=w1280',
  act7      : G + 'AG8ngQU7XJ9eyWK6o2A2_3szTv6HWrSR93nFJakURFCEAKqaxe4JnyZlJmh6qfp2yUcg2aO9OLbkK6udTizT6qdEczkNVzgmPCkEkrnDwzJu2IGCaMOp3eARnwwJityZok-c3m7WhvRks_Mh9oC0E9njb57ke20Q2JQrarpe4x1k8dWI-hPqv_eEJq9lyxgq0YI=w1280',
  zoo       : G + 'AG8ngQVeRUgLdlrGM9KgE6wuLgkPtXEEhQ4f6g0Nd5kPuOnEGzlRjyAS5rnpSLgptWeHe-Mh41teZL7aIkoLPBXnUiqF_zqz7xdZ_I-j_Cq66o7ZdEJnSVF5pzswXwOr-C_bACmF-3mjII41x7v0UNwQkXU7xdWoN_xPnWxO6N22a_jR3OqG7BK2ImbPTGO-7QRJXFELfldzQjalDFL0DJ-RIsbiR4MFRWENl5s4c03gAxQ=w1280',
  zooFun    : G + 'AG8ngQXY5EISC5V6KkBEQlueD_YknFK7PeXs-Ey2wxUU1q_ZaZASDjczTvJhufpIbjPc_S8EudU0XytgUqHfkLYQzIFP0Cgm6rrfDXFRxXQZdGFveIOvVHeqp_p9ZqBGmEejUWXo6pU9H-b9l_lQLKwKSu6Uu4nFuHzlA969uVb_6ZYFfmKd991DotjRatXK6XK1SNQWlVP5bX0jlBX31_TD_5j9fjBNMxHKVp5bqR1JOQQ=w1280',
  fac1      : G + 'AG8ngQUzsRCjE8Exaao6xDLXnmojzDg8rEo8tfJ3QwrIhQAlThpVT0q5_eXKGcZdKvmqakbufLH4m_WP2tAWKbtEWHLR9VHWmu8Y1WcpTgFzMPh2tLO-vfWp9cbt3fTV5ej7nWME5HhJmA7O9tueEBt9FvQEZ87j53dN2KuZMSB6Kix_FTT7qsoBNiGDfAPRxvWsEJIDSS32yKOOAHFzfA8tL5c=w1280',
  fac2      : G + 'AG8ngQWhvIldQCn-PP39-vaHh7ta5zZz8N1zsHOue73wHjpO7hvMzO_uPtX5HibcFKI5zcXQ3jRAa3vWHwZN5GOLHuHvouGH76Nvg18WvOTCJC5TSPh3OCwRcL2KFExegH6Rqcx8YePj64snZaHTBrQ_lEsWGPxBECCx1w0cgwr7R7cPqpgzx9hBJnOP_MLN8aeMxtu6Smo9o3eLbOEUmrCvIi3ZkBlTeo9sq1Nuase_=w1280',
  fac3      : G + 'AG8ngQV0fx8_JTY17NC4bGScGuYa8l7o-Te9aELus4XVx5iazxjM9OqojPB7emweH-drW-5PTGKN9y_ARJWxm9vVAv2KsQYDoOsz6See7qdLKyk1rGW16uL6z5-y6pYv-du6gX_0jPuibA_UWl6YO8YCV8XLr4cpP88WLecWmbOgS1VcxfEIHMOJweOqObvL=w1280',
  fac4      : G + 'AG8ngQWX1o-VF3W4tVPxqpn1etepD_i60hO3gmgD8RN043rMlcGKtnvViYRdwpUAA5DZ1fiUg_fYkMqPk-ws_DwFxOnq80VQq7AvX1tvc16UDSvdpvrMxTkIN--x1CGCxkKF9_-_Coo10EoduL52_6o-CPJfQkoGr7ZNTyUvpbtoy0x0KgTvwCvxfH2XaP1ioV2skKilLhGOQVftIgv5PUeQsHs=w16383',
  fac5      : G + 'AG8ngQXtcKBP0ExnnhIpHdYKtriib6H3bnIxcNJrwdqkqJzes44tEV_fhZwnOM5ZHEx33fboiziZPLXhqJAhcLtFxMzRp8ah6ApH3ga269lqW_vqWrgVX7U4D0Vt3kS7gyQFpbx6lKj0Lh84pZckk-zDWlQZdQkPRLZV1tNZYHSiqFdCyOfFD1qk_7eLeZrL=w16383',
  fac6      : G + 'AG8ngQX2LEX_bBPDTvdev5Ate5hgavfuGrocVg12THHxFmnxRN9Vsi3oHdTtYEsoOyhF5gWetU7Ys20-4agw24BQgzuMivfhMD-vADLMsa6Fa5MYRUKUueZu4EH31Dc-7LGy_cpoE9s1QHqE_KglDgNeFlwDDtdlbXHcp6Wc7kgx8MUJRE7raAdh4HcsetccWIzS1VVU2MTXbyY9z-W6aNsOWMM=w16383',
  fac7      : G + 'AG8ngQVmVud6tA_3Wk3ZnWPu5kJ6KFAkHz8g_2XqTX-XQhd7LwF40TvgoFgMFsuDhCSVlZSWChoTFvqUn1Lo4UbTR8Nka2Wv_qyDlmJgR1lVm6spi1XlMUgQKJY1oLFoe0R4CRf1S1Dq7WdeEgJg1NZiXUqXZ_hBExDUZr98DTnbPrYFlGqo9N-CzDwaZZRf=w16383',
  eye       : G + 'AG8ngQVFd_X1QlavLv2gHD_1p2Kvh2jc4-Dg1d6M7GuUK2KWL6WcQ7MOZnGNGc1lBPyd4qczZqX01NwMKOkfOiW_pHr8X818vhjXjX9SW0ZhpuY85x-TAo-ll_csy3nGV4kWv4rb_LkvlXhuS9QL_HAgf2ktpCuBSjL6DUlZKsJRKu8w9r0cogXXpQMIl_Xe1A0=w1280',
  eyeCabin  : G + 'AG8ngQUoZxacm5P3hIvlOkUOqM29gSnPZaAHoTwzUa0HZ7ZoB0EI8pJvxgmq5LHdmZoh9bR_x0-UQ_Kol766a7fxDYbvQC3X8FWAgtGHlVyZ-Ccgrh2ZGP7071NkOhUBvkvv2ceIPmQ1v2LfdQK49PBze7OS61dKtxCm9fQerUSNBE_6D-235YTGyJIkPJnv_rw=w1280',
};

// Fallback HD stock imagery, also used as the main image for destinations that
// have no official asset yet. Replace with real photos when available.
const U = id => 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=1400&q=80';
export const FB = {
  tea      : G + 'AG8ngQWBpj62NH-sryt3zUUZ3FH79mhb-xb8HCge3luyDmls4uTsS-qCyQctfyqL7Ki_CXwbw4OYeMSh99ho2FJeM3rk5kwnIuqGOAlKO9aolbco13TIMnsEHu8TGayRi2j-3H5s7b6PZtvtUpUB6TVTD4qZInFcn95pyZpWMsZOhOkwsH9ToSfqhmm_F23j=w16383',
  mist     : G + 'AG8ngQWhvIldQCn-PP39-vaHh7ta5zZz8N1zsHOue73wHjpO7hvMzO_uPtX5HibcFKI5zcXQ3jRAa3vWHwZN5GOLHuHvouGH76Nvg18WvOTCJC5TSPh3OCwRcL2KFExegH6Rqcx8YePj64snZaHTBrQ_lEsWGPxBECCx1w0cgwr7R7cPqpgzx9hBJnOP_MLN8aeMxtu6Smo9o3eLbOEUmrCvIi3ZkBlTeo9sq1Nuase_=w1280',
  sunrise  : G + 'AG8ngQXyN2cqa6dtV0LpNgVDGOEiXZ8GbgOxvadjQTtF2plx7s6r0Rb4uXQXEc4cLjJQ1lx5Emv7h0IXkJrOtZOvTKPdPWPQXXWJaTay1eOFtXvJVQe_9taFk44EwWw6OKTzXwtlGWUReh2_9iJi_t3gjrWh_-akNHAi9TVaE947d91_a5OdVQkb6qq4yvWpc1iFbm-oymI-GYyVllaH_tv2R5P1HcXZSwJAZk3WbrMj8c0=w1280',
  forest   : G + 'AG8ngQXtcKBP0ExnnhIpHdYKtriib6H3bnIxcNJrwdqkqJzes44tEV_fhZwnOM5ZHEx33fboiziZPLXhqJAhcLtFxMzRp8ah6ApH3ga269lqW_vqWrgVX7U4D0Vt3kS7gyQFpbx6lKj0Lh84pZckk-zDWlQZdQkPRLZV1tNZYHSiqFdCyOfFD1qk_7eLeZrL=w16383',
  peak     : G + 'AG8ngQWX1o-VF3W4tVPxqpn1etepD_i60hO3gmgD8RN043rMlcGKtnvViYRdwpUAA5DZ1fiUg_fYkMqPk-ws_DwFxOnq80VQq7AvX1tvc16UDSvdpvrMxTkIN--x1CGCxkKF9_-_Coo10EoduL52_6o-CPJfQkoGr7ZNTyUvpbtoy0x0KgTvwCvxfH2XaP1ioV2skKilLhGOQVftIgv5PUeQsHs=w16383',
  valley   : G + 'AG8ngQX2LEX_bBPDTvdev5Ate5hgavfuGrocVg12THHxFmnxRN9Vsi3oHdTtYEsoOyhF5gWetU7Ys20-4agw24BQgzuMivfhMD-vADLMsa6Fa5MYRUKUueZu4EH31Dc-7LGy_cpoE9s1QHqE_KglDgNeFlwDDtdlbXHcp6Wc7kgx8MUJRE7raAdh4HcsetccWIzS1VVU2MTXbyY9z-W6aNsOWMM=w16383',
  trail    : G + 'AG8ngQVeRUgLdlrGM9KgE6wuLgkPtXEEhQ4f6g0Nd5kPuOnEGzlRjyAS5rnpSLgptWeHe-Mh41teZL7aIkoLPBXnUiqF_zqz7xdZ_I-j_Cq66o7ZdEJnSVF5pzswXwOr-C_bACmF-3mjII41x7v0UNwQkXU7xdWoN_xPnWxO6N22a_jR3OqG7BK2ImbPTGO-7QRJXFELfldzQjalDFL0DJ-RIsbiR4MFRWENl5s4c03gAxQ=w1280',
  food     : G + 'AG8ngQUoZxacm5P3hIvlOkUOqM29gSnPZaAHoTwzUa0HZ7ZoB0EI8pJvxgmq5LHdmZoh9bR_x0-UQ_Kol766a7fxDYbvQC3X8FWAgtGHlVyZ-Ccgrh2ZGP7071NkOhUBvkvv2ceIPmQ1v2LfdQK49PBze7OS61dKtxCm9fQerUSNBE_6D-235YTGyJIkPJnv_rw=w1280',
  water    : G + 'AG8ngQWBpj62NH-sryt3zUUZ3FH79mhb-xb8HCge3luyDmls4uTsS-qCyQctfyqL7Ki_CXwbw4OYeMSh99ho2FJeM3rk5kwnIuqGOAlKO9aolbco13TIMnsEHu8TGayRi2j-3H5s7b6PZtvtUpUB6TVTD4qZInFcn95pyZpWMsZOhOkwsH9ToSfqhmm_F23j=w16383',
  lake     : G + 'AG8ngQWBpj62NH-sryt3zUUZ3FH79mhb-xb8HCge3luyDmls4uTsS-qCyQctfyqL7Ki_CXwbw4OYeMSh99ho2FJeM3rk5kwnIuqGOAlKO9aolbco13TIMnsEHu8TGayRi2j-3H5s7b6PZtvtUpUB6TVTD4qZInFcn95pyZpWMsZOhOkwsH9ToSfqhmm_F23j=w16383',
  cabin    : G + 'AG8ngQVmVud6tA_3Wk3ZnWPu5kJ6KFAkHz8g_2XqTX-XQhd7LwF40TvgoFgMFsuDhCSVlZSWChoTFvqUn1Lo4UbTR8Nka2Wv_qyDlmJgR1lVm6spi1XlMUgQKJY1oLFoe0R4CRf1S1Dq7WdeEgJg1NZiXUqXZ_hBExDUZr98DTnbPrYFlGqo9N-CzDwaZZRf=w16383',
  camp     : G + 'AG8ngQXtcKBP0ExnnhIpHdYKtriib6H3bnIxcNJrwdqkqJzes44tEV_fhZwnOM5ZHEx33fboiziZPLXhqJAhcLtFxMzRp8ah6ApH3ga269lqW_vqWrgVX7U4D0Vt3kS7gyQFpbx6lKj0Lh84pZckk-zDWlQZdQkPRLZV1tNZYHSiqFdCyOfFD1qk_7eLeZrL=w16383',
  villa    : G + 'AG8ngQVmVud6tA_3Wk3ZnWPu5kJ6KFAkHz8g_2XqTX-XQhd7LwF40TvgoFgMFsuDhCSVlZSWChoTFvqUn1Lo4UbTR8Nka2Wv_qyDlmJgR1lVm6spi1XlMUgQKJY1oLFoe0R4CRf1S1Dq7WdeEgJg1NZiXUqXZ_hBExDUZr98DTnbPrYFlGqo9N-CzDwaZZRf=w16383',
};

/* Reverse URL -> key so <NimoImage> can find the local copy of any image in
   src/assets/nimo/ (see scripts/images-seed.mjs) by URL alone. FB keys are
   prefixed "fb-" to stay unique against the Google IMG set. */
export const IMG_KEYS = {};
for (const [k, v] of Object.entries(IMG)) IMG_KEYS[v] = k;
for (const [k, v] of Object.entries(FB)) IMG_KEYS[v] = 'fb-' + k;

/* The lh3.googleusercontent.com/sitesv URLs only serve to a request carrying
   nimoland.com's own cookies/referer; hotlinked straight into a browser they
   return 403 (so photos would never render). Astro <NimoImage> already serves
   the local copy from src/assets; this helper lets every client-rendered
   <img> (and SSR hero) use the local static copy instead of the dead URL.
   Local files live at public/aimg/t<token>.jpg (mirrored by
   scripts/seed-live-assets.mjs). Non-Google URLs pass through untouched. */
const AIMG_TOKEN = /AG8ngQ[A-Za-z0-9_-]+/;
export function localSrc(url) {
  const m = AIMG_TOKEN.exec(String(url ?? ''));
  return m ? `/aimg/t${m[0].slice(0, 28)}.jpg` : String(url ?? '');
}

/* Brand photo folders (see scripts/organize-brand-assets.mjs). Each brand keeps
   its own folder under public/brand/. Files are already local so they are
   referenced directly; localSrc() passes them through untouched. */
const NH = n => `/brand/nimo-highland/nh-${String(n).padStart(2, '0')}.jpg`;
const DG = (facility, n) => `/brand/dgyp/${facility}-${n}.jpg`;
const AQ = n => `/brand/aqua-game/aqua-game-${String(n).padStart(2, '0')}.jpg`;
const NWF = n => `/brand/nimo-water-forest/nimo-water-forest-${String(n).padStart(2, '0')}.jpg`;
const NE = n => `/brand/nimo-eye/nimo-eye-${String(n).padStart(2, '0')}.jpg`;
const MSK = n => `/brand/malang-skyland/malang-skyland-${String(n).padStart(2, '0')}.jpg`;
const MSKGIF = n => `/brand/malang-skyland/malang-skyland-${String(n).padStart(2, '0')}.gif`;
const ECO = n => `/brand/nimo-ecomarine/nimo-ecomarine-${String(n).padStart(2, '0')}.jpg`;
const KLT = n => `/brand/nimo-kaldera-toba/nimo-kaldera-toba-${String(n).padStart(2, '0')}.jpg`;
const ZOO = n => `/brand/nimo-zoo/nimo-zoo-${String(n).padStart(2, '0')}.jpg`;
const PUN = n => brandPath('punceling-park', n, { 8:'png', 9:'png', 10:'png', 11:'png', 12:'png' });
const brandPath = (slug, n, extMap) => `/brand/${slug}/${slug}-${String(n).padStart(2, '0')}.${extMap?.[n] ?? 'jpg'}`;
const TR  = n => brandPath('nimo-tea-resort', n, { 1:'png', 2:'png', 3:'png', 4:'png', 5:'png', 6:'jpg' });
const RC  = n => brandPath('nimo-resort-ciater', n, { 1:'png', 2:'jpg', 3:'png', 4:'png', 5:'png', 6:'png', 7:'png', 8:'png', 9:'jpg', 10:'png' });
const SV  = n => brandPath('savia-hotel-resort', n, { 1:'png', 2:'jpg', 3:'jpg', 4:'png', 5:'jpg', 6:'jpg', 7:'jpg', 8:'png' });
const GL  = n => brandPath('nimoza-glamping', n, { 1:'png', 2:'png', 3:'jpg', 4:'png' });
const PR  = n => brandPath('pinaru-park', n, { 1:'png', 2:'png', 3:'png', 4:'jpg', 5:'jpg', 6:'jpg', 7:'jpg', 8:'png' });

/* ---- Destinations ---- */
export const DEST_FILTERS = [
  { id: 'semua',    label: 'Semua',              icon: 'sparkles' },
  { id: 'alam',     label: 'Alam & Pegunungan',  icon: 'mountain' },
  { id: 'air',      label: 'Wisata Air',         icon: 'waves-horizontal' },
  { id: 'keluarga', label: 'Keluarga & Edukasi', icon: 'trees' },
];

export const DESTINATIONS = [
  { id:'nimo-highland', name:'Nimo Highland', type:'alam', area:'Banjarsari, Pangalengan, Bandung',
    tag:'Unggulan', img:'/brand/nimo-highland/nh-hero.jpg', fb:'/brand/nimo-highland/nh-hero.jpg',
    desc:'Destinasi kebun teh di Pangalengan, Bandung dengan Sky Bridge ikonis berbentuk U yang membentang di atas hamparan kebun teh, menawarkan panorama 360° yang memukau. Nikmati udara pegunungan yang segar sambil mengagumi hamparan hijau yang luas.',
    highlights:['Sky Bridge','Glass Sky Bridge','ATV','Paintball','Jimny Adventure','Flying Fox','Rafting','Nimo Zoo','Virtual Reality','Photo Ethnic Studio'],
    gallery:[NH(1), NH(2), NH(3), NH(4)] },

  { id:'nimo-eye', name:'Nimo Eye', type:'alam', area:'Banjarsari, Pangalengan, Bandung',
    tag:'Rekor MURI', img:NE(1), fb:NE(1),
    desc:'Bianglala dengan elevasi tertinggi di Indonesia, berada di ketinggian sekitar 1.400 mdpl dan memecahkan rekor MURI. Pemandangan kebun teh dari ketinggian ekstrem menjadikannya wahana wisata baru yang populer.',
    highlights:['Kabin Regular & VIP','Karaoke in the Sky','Dine in the Sky','360° view'],
    gallery:[NE(1), NE(2), NE(3), NE(4)] },

  { id:'nimo-water-forest', name:'Nimo Water Forest', type:'air', area:'Purwakarta, Jawa Barat',
    img:'/brand/nimo-water-forest/nwf-hero.jpg', fb:'/brand/nimo-water-forest/nwf-hero.jpg',
    desc:'Konsep pantai pertama di Purwakarta — perpaduan harmonis hutan tropis yang rimbun dengan petualangan air yang menyegarkan. Dirancang untuk keluarga, pencari sensasi, dan pecinta alam.',
    highlights:['Kolam anak','Wahana air','Area piknik','Nimo Zoo','Virtual Reality'], gallery:[NWF(1), NWF(2), NWF(3)] },

  { id:'bogor-aqua-game', name:'Bogor Aqua Game', type:'air', area:'Bogor, Jawa Barat',
    img:AQ(1), fb:AQ(1),
    desc:'Wahana watersport pertama di Indonesia yang menghadirkan permainan inflatable premium Wibit dari Jerman. Keseruan semakin lengkap dengan wahana interaktif seperti Boqu War, Caterpillar Race, paddle board, dan berbagai permainan menarik lainnya.',
    highlights:['Wibit inflatable','Boqu War','Caterpillar Race','Paddle Boat'], gallery:[AQ(1), AQ(2), AQ(3)] },

  { id:'malang-skyland', name:'Malang Skyland', type:'alam', area:'Kabupaten Malang, Jawa Timur',
    img:'/brand/malang-skyland/msk-hero.gif', fb:'/brand/malang-skyland/msk-hero.gif',
    desc:'Destinasi wisata modern di Kabupaten Malang yang menawarkan pengalaman di ketinggian dengan pemandangan alam serta gemerlap lampu Kota Malang dan Kota Batu. Terkenal dengan jembatan kaca (Glass Sky Bridge), wahana seperti ATV, dan kafe berkonsep futuristik — cocok untuk keluarga dan pasangan.',
    highlights:['Glass Sky Bridge','ATV','Kidszone','SkyZone','Cafe futuristik'], gallery:[MSK(1), MSK(2), MSK(3), MSK(4), MSK(5), MSK(6), MSK(7), MSK(8), MSKGIF(9), MSKGIF(10), MSKGIF(11)] },

  { id:'pinaru-park', name:'Pinaru Park', type:'keluarga', area:'Ciater, Subang',
    img:'/brand/pinaru-park/unnamed-1.jpg', fb:'/brand/pinaru-park/unnamed-1.jpg',
    desc:'Destinasi ramah keluarga yang memadukan keseruan wahana modern dengan kesegaran alam pegunungan. Berada di bawah rindangnya pohon pinus, kami menghadirkan area bermain yang aman dan menyenangkan untuk segala usia — dari wahana yang memacu adrenalin di seluncuran pelangi ikonik hingga bersantai di udara segar.',
    highlights:['Rainbow Slide','Water Slide','ATV','Luge Car','Jacuzzi','Aviary & Mini Zoo'],
    gallery:[PR(1), PR(2), PR(3), PR(4), PR(5)] },

  { id:'nimo-kaldera-toba', name:'Nimo Kaldera Toba', type:'alam', area:'Danau Toba, Sumut',
    img:KLT(1), fb:KLT(1),
    desc:'Destinasi di kawasan kaldera Danau Toba, danau vulkanik terbesar di dunia. Saat kabut menyapu, keindahan Danau Toba terbentang luas — nikmati pesona alam yang menenangkan di ketinggian, unik dan luar biasa.',
    highlights:['Pemandangan danau','Spot foto','Udara sejuk','Calandra berkuda'], gallery:[KLT(1), KLT(2), KLT(3), KLT(4)] },

  { id:'nimo-zoo', name:'Nimo Zoo', type:'keluarga', area:'Area Nimo Highland',
    img:ZOO(1), fb:ZOO(1),
    desc:'Area edukasi satwa dengan interactive storytelling dan sesi feeding time yang aman untuk anak.',
    highlights:['Interactive storytelling','Feeding time','Edukasi satwa'],
    gallery:[ZOO(1), ZOO(2), ZOO(3), ZOO(4)] },

  { id:'punceling-park', name:'Punceling Park', type:'air', area:'Ciwidey, Bandung',
    img:'/brand/punceling-park/4320b925-e19f-458d-9c87-cd9f0036b6c4.jpg', fb:'/brand/punceling-park/4320b925-e19f-458d-9c87-cd9f0036b6c4.jpg',
    desc:'Oase ketenangan di Ciwidey, Bandung — destinasi dengan udara sejuk khas pegunungan. Nikmati fasilitas water boom slided usai berkemah atau bersantai, dan lepas penat menikmati alam hijau pegunungan.',
    highlights:['Waterboom','Camping','Kolam air panas','Hutan pinus','Tempat ibadah'], gallery:[PUN(1), PUN(2), PUN(3), PUN(4)] },

  { id:'nimo-ecomarine', name:'Nimo Ecomarine', type:'air', area:'Bali',
    img:ECO(1), fb:ECO(1),
    desc:'Petualangan air terbaru di Bali sebagai bagian dari keluarga besar Nimo Land Group.',
    highlights:['Wahana air','Area pantai','Baru dibuka'], gallery:[ECO(1), ECO(2), ECO(3)] },
];

/* ---- Accommodation ----
   ROOM LISTS & DESCRIPTIONS follow the official site (nimoland.com).
   NIGHTLY RATES are not officially published yet: existing placeholder figures
   are kept in pricing.json (see IS_DEMO_MODE above) and marked for confirmation
   with the reservations team; rooms without an official rate use null and show
   "Hubungi reservasi". */
export const HOTELS = [
  {
    id:'nimo-tea-resort', name:'Nimo Tea Resort', area:'Gunung Nini, Pangalengan',
    img:TR(1), fb:TR(1),
    desc:'Kamar berbalkon dengan pemandangan 360° kebun teh dan pegunungan. Titik terbaik untuk sunrise maupun sunset, tepat di dalam kawasan Nimo Highland.',
    facilities:['Restoran semi-outdoor','Balkon pribadi','Air panas','Wi-Fi','Parkir','Akses langsung Nimo Highland'],
    rooms:[
      { id:'lavaza', type:'Villa', name:'Lavaza Room', cap:6, rate:HOTEL_RATES['lavaza'],
        desc:'Villa 2 lantai berkonsep kayu futuristik dengan sentuhan mewah, 65 m², dan pemandangan kebun teh.',
        img:TR(2), fb:TR(2) },
      { id:'arjuna', type:'Villa', name:'Arjuna Room', cap:6, rate:HOTEL_RATES['arjuna'],
        desc:'Villa kayu 2 lantai seluas 65 m² dengan suasana hangat dan panorama pegunungan kebun teh.',
        img:TR(3), fb:TR(3) },
    ]
  },
  {
    id:'nimo-resort-ciater', name:'Nimo Resort Ciater', area:'Ciater, Subang',
    img:RC(1), fb:RC(1),
    desc:'Resort pertama di Ciater dengan konsep Nordic European yang elegan dan estetik, dilengkapi kolam renang air panas.',
    facilities:['Kolam air panas','Restoran','Area bermain anak','Parkir luas','Wi-Fi'],
    rooms:[
      { id:'ciat-superior', type:'Room', name:'Superior Room', cap:2, rate:HOTEL_RATES['ciat-superior'],
        desc:'Kamar 16 m² untuk 2 tamu.', img:RC(2), fb:RC(2) },
      { id:'ciat-standard', type:'Room', name:'Standard Room', cap:2, rate:HOTEL_RATES['ciat-standard'],
        desc:'Kamar 16 m² untuk 2 tamu.', img:RC(3), fb:RC(3) },
      { id:'ciat-deluxe-pool', type:'Room', name:'Deluxe Room Pool View', cap:2, rate:HOTEL_RATES['ciat-deluxe-pool'],
        desc:'Kamar 29 m² dengan pemandangan kolam.', img:RC(4), fb:RC(4) },
      { id:'ciat-deluxe-triple', type:'Room', name:'Deluxe Triple Room', cap:3, rate:HOTEL_RATES['ciat-deluxe-triple'],
        desc:'Kamar 32 m² untuk 3 tamu.', img:RC(5), fb:RC(5) },
      { id:'ciat-deluxe-queen', type:'Room', name:'Deluxe Room Double Queen', cap:4, rate:HOTEL_RATES['ciat-deluxe-queen'],
        desc:'Kamar 37 m² untuk 4 tamu dengan dua tempat tidur queen.', img:RC(6), fb:RC(6) },
      { id:'ciat-exec-suite', type:'Suite', name:'Executive Suite 2 Bedroom', cap:4, rate:HOTEL_RATES['ciat-exec-suite'],
        desc:'Suite 35 m² dengan 2 kamar tidur.', img:RC(7), fb:RC(7) },
      { id:'ciat-family-3', type:'Room', name:'Family Room 3', cap:6, rate:HOTEL_RATES['ciat-family-3'],
        desc:'Kamar keluarga 52 m² untuk 6 tamu.', img:RC(8), fb:RC(8) },
      { id:'ciat-family-4', type:'Room', name:'Family Room 4', cap:8, rate:HOTEL_RATES['ciat-family-4'],
        desc:'Kamar keluarga 80 m² untuk 8 tamu.', img:RC(9), fb:RC(9) },
      { id:'ciat-family-5', type:'Room', name:'Family Room 5', cap:10, rate:HOTEL_RATES['ciat-family-5'],
        desc:'Kamar keluarga 90 m² untuk 10 tamu.', img:RC(10), fb:RC(10) },
    ]
  },
  {
    id:'nimoza-glamping', name:'Glamping Nimoza', area:'Kawasan Nimo Highland, Pangalengan',
    img:GL(1), fb:GL(1),
    desc:'Glamping dalam area Nimo Tea Resort — menginap di tenda mewah tanpa repot menyiapkan perlengkapan kemah.',
    facilities:['Tenda ber-AC','Kamar mandi dalam','Api unggun','Sarapan','Wi-Fi area umum'],
    rooms:[
      { id:'lux-camp', type:'Luxury Camp', name:'Luxury Camp Deluxe', cap:4, rate:HOTEL_RATES['lux-camp'],
        desc:'Tenda glamping ukuran besar dengan ranjang king dan teras pribadi menghadap bukit.',
        img:GL(2), fb:GL(2) },
      { id:'std-camp', type:'Luxury Camp', name:'Camp Standard', cap:2, rate:HOTEL_RATES['std-camp'],
        desc:'Tenda glamping untuk dua orang, lengkap dengan kamar mandi dalam.',
        img:GL(3), fb:GL(3) },
    ]
  },
  {
    id:'new-dgyp-resort', name:'New Dgyp Resort Ciater', area:'Ciater, Subang',
    img:DG('junior-private-pool', 1), fb:DG('junior-private-pool', 1),
    desc:'Resort di Ciater dengan konsep vila bambu yang memadukan keindahan alam dan kenyamanan desain modern woody, satu kawasan dengan Pinaru Park.',
    facilities:['Area cottage rustic','Jakuzi','Aviary','Mini zoo','Water slide','ATV','Akses Pinaru Park'],
    facilityImages: [
      { label:'Lobby',          img:DG('lobby', 1),                   fb:DG('lobby', 1) },
      { label:'Restoran',       img:DG('resto', 1),                   fb:DG('resto', 1) },
      { label:'Playground',     img:DG('playground', 1),              fb:DG('playground', 1) },
      { label:'Kolam Renang',   img:DG('swimming-pool', 1),           fb:DG('swimming-pool', 1) },
      { label:'Swimming Pool',  img:DG('swimming-pool', 2),           fb:DG('swimming-pool', 2) },
      { label:'Villa Kayu',     img:DG('villa-kayu-exclusive', 1),   fb:DG('villa-kayu-exclusive', 1) },
    ],
    rooms:[
      { id:'junior-suite', type:'Suite', name:'Junior Suite', cap:4, rate:HOTEL_RATES['junior-suite'],
        desc:'Suite luas untuk keluarga kecil dengan interior hangat bergaya modern woody dan akses mudah ke fasilitas resort.',
        img:DG('junior-suite', 1), fb:DG('junior-suite', 2) },
      { id:'standard', type:'Room', name:'Standard Room', cap:2, rate:HOTEL_RATES['standard'],
        desc:'Kamar standar 24 m² dengan desain sederhana yang nyaman untuk dua tamu.',
        img:DG('standard', 1), fb:DG('standard', 2) },
      { id:'villa-kayu-exclusive', type:'Villa', name:'Villa Kayu Exclusive', cap:4, rate:HOTEL_RATES['villa-kayu-exclusive'],
        desc:'Vila kayu eksklusif dengan area privasi lebih luas, teras pribadi, dan sentuhan mewah di tengah resort.',
        img:DG('villa-kayu-exclusive', 1), fb:DG('villa-kayu-exclusive', 2) },
      { id:'villa-kayu-standar', type:'Villa', name:'Villa Kayu Standar', cap:2, rate:HOTEL_RATES['villa-kayu-standar'],
        desc:'Vila kayu standar yang hangat dan dekat dengan alam, cocok untuk pasangan atau keluarga kecil.',
        img:DG('villa-kayu-standar', 1), fb:DG('villa-kayu-standar', 2) },
      { id:'junior-private-pool', type:'Pool Villa', name:'Junior Private Pool', cap:4, rate:HOTEL_RATES['junior-private-pool'],
        desc:'Vila dengan kolam renang pribadi — pengalaman privat maksimal untuk keluarga atau rombongan kecil.',
        img:DG('junior-private-pool', 1), fb:DG('junior-private-pool', 2) },
    ]
  },
  {
    id:'savia-hotel-resort', name:'Savia Hotel & Resort', area:'Ciater, Subang',
    img:SV(1), fb:SV(1),
    desc:'Hidden hillside resort di tengah sejuknya alam Ciater dengan perpaduan rustic villa, hotel building, dan modern cabin. Cocok untuk family getaway, honeymoon, hingga corporate gathering.',
    facilities:['Area meeting','Outbound','Ruang terbuka luas','Restoran','Parkir'],
    rooms:[
      { id:'savia-superior-room', type:'Room', name:'Superior Room', cap:2, rate:HOTEL_RATES['savia-superior-room'],
        desc:'Kamar bergaya hotel seluas 24 m² untuk 2 tamu.', img:SV(2), fb:SV(2) },
      { id:'savia-superior-cabin', type:'Cabin', name:'Superior Cabin', cap:2, rate:HOTEL_RATES['savia-superior-cabin'],
        desc:'Cabin modern 30 m² dengan kaca depan luas yang menyatu dengan alam.', img:SV(3), fb:SV(3) },
      { id:'savia-deluxe-cottage', type:'Cottage', name:'Deluxe Cottage', cap:4, rate:HOTEL_RATES['savia-deluxe-cottage'],
        desc:'Cottage rustic dengan desain mezzanine seluas 29 m² untuk 4 tamu.', img:SV(4), fb:SV(4) },
      { id:'savia-executive-cabin', type:'Cabin', name:'Executive Cabin', cap:4, rate:HOTEL_RATES['savia-executive-cabin'],
        desc:'Cabin modern 46 m² untuk 4 tamu, dilengkapi bathtub.', img:SV(5), fb:SV(5) },
      { id:'savia-suite-cabin', type:'Suite', name:'Suite Cabin', cap:4, rate:HOTEL_RATES['savia-suite-cabin'],
        desc:'Cabin eksklusif 46 m² dengan 2 kamar tidur untuk 4 tamu.', img:SV(6), fb:SV(6) },
      { id:'savia-grand-deluxe', type:'Suite', name:'Grand Deluxe', cap:5, rate:HOTEL_RATES['savia-grand-deluxe'],
        desc:'Kamar berdesain mezzanine seluas 55 m² hingga 5 tamu.', img:SV(7), fb:SV(7) },
      { id:'savia-junior-suite', type:'Suite', name:'Junior Suite', cap:4, rate:HOTEL_RATES['savia-junior-suite'],
        desc:'Kamar keluarga seluas 42 m² untuk 4 tamu.', img:SV(8), fb:SV(8) },
    ]
  },
];

export const ROOM_TYPES = ['Semua', 'Villa', 'Room', 'Cabin', 'Cottage', 'Suite', 'Luxury Camp', 'Pool Villa'];

/* Footage yang diunduh dari Google Drive (lihat scripts/drive-download.mjs).
   Memetakan destinasi/hotel ke video lokal di /public/videos/<id>/.
   Dipakai sebagai cover autoplay di kartu destinasi (via coverMedia) dan di
   halaman detail; row DB destination_videos tetap menang bila karyawan set. */
export const FOOTAGE = {
  'nimo-tea-resort':     { aerial: '/videos/nimo-tea-resort/aerial.mp4',     ad: '/videos/nimo-tea-resort/ad.mp4' },
  'nimo-resort-ciater':  { aerial: '/videos/nimo-resort-ciater/aerial.mp4',  ad: '/videos/nimo-resort-ciater/ad.mp4' },
  'savia-hotel-resort':  { aerial: '/videos/savia-hotel-resort/aerial.mp4' },
  'pinaru-park':         { aerial: '/brand/pinaru-park/unnamed-1.jpg' },
  'punceling-park':      { aerial: '/brand/punceling-park/4320b925-e19f-458d-9c87-cd9f0036b6c4.jpg' },
};

/** Flat list of every room with its parent hotel folded in. */
export function allRooms() {
  return HOTELS.flatMap(h =>
    h.rooms.map(r => ({ ...r, hotelId: h.id, hotelName: h.name, area: h.area, facilities: h.facilities })),
  );
}

export const HERO_SLIDES = [
  { img:'/beranda-highlight.jpg', fb:'/beranda-highlight.jpg', alt:'' },
];

export const MOMENTS = [
  { img:RC(1),  fb:RC(1) },
  { img:PR(1),  fb:PR(1) },
];

export const GALLERY = [
  { img:TR(1),  fb:TR(1) },
  { img:TR(2),  fb:TR(2) },
  { img:RC(1),  fb:RC(1) },
  { img:RC(2),  fb:RC(2) },
  { img:RC(3),  fb:RC(3) },
  { img:SV(1),  fb:SV(1) },
  { img:SV(2),  fb:SV(2) },
  { img:SV(3),  fb:SV(3) },
  { img:GL(1),  fb:GL(1) },
  { img:GL(2),  fb:GL(2) },
  { img:PR(1),  fb:PR(1) },
  { img:PR(2),  fb:PR(2) },
  { img:NE(1),  fb:NE(1) },
  { img:NE(2),  fb:NE(2) },
  { img:NWF(1), fb:NWF(1) },
  { img:MSK(1), fb:MSK(1) },
  { img:ZOO(1), fb:ZOO(1) },
  { img:KLT(1), fb:KLT(1) },
  { img:AQ(1),  fb:AQ(1) },
  { img:PUN(1), fb:PUN(1) },
];

export function parseISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00');
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function toISODate(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

export const rupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');
