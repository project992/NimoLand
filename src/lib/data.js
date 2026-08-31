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
  legalName: 'PT Nimo Hotel & Resort',
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
const ECOGIF = n => `/brand/nimo-ecomarine/nimo-ecomarine-${String(n).padStart(2, '0')}.gif`;
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
    gallery:[NH(1), NH(2), NH(3), NH(4), NH(5), NH(7)] },

  { id:'nimo-eye', name:'Nimo Eye', type:'alam', area:'Banjarsari, Pangalengan, Bandung',
    tag:'Rekor MURI', img:NE(1), fb:NE(1),
    desc:'Bianglala dengan elevasi tertinggi di Indonesia, berada di ketinggian sekitar 1.400 mdpl dan memecahkan rekor MURI. Pemandangan kebun teh dari ketinggian ekstrem menjadikannya wahana wisata baru yang populer.',
    highlights:['Kabin Regular & VIP','Karaoke in the Sky','Dine in the Sky','360° view'],
    gallery:[NE(1), NE(2), NE(3), NE(4), NE(5), NE(6)] },

  { id:'nimo-water-forest', name:'Nimo Water Forest', type:'air', area:'Purwakarta, Jawa Barat',
    img:'/brand/nimo-water-forest/nwf-hero.jpg', fb:'/brand/nimo-water-forest/nwf-hero.jpg',
    desc:'Konsep pantai pertama di Purwakarta — perpaduan harmonis hutan tropis yang rimbun dengan petualangan air yang menyegarkan. Dirancang untuk keluarga, pencari sensasi, dan pecinta alam.',
    highlights:['Kolam anak','Wahana air','Area piknik','Nimo Zoo','Virtual Reality'],
    gallery:[NWF(1), NWF(2), NWF(3), NWF(4), NWF(5), NWF(6)] },

  { id:'bogor-aqua-game', name:'Bogor Aqua Game', type:'air', area:'Bogor, Jawa Barat',
    img:AQ(1), fb:AQ(1),
    desc:'Wahana watersport pertama di Indonesia yang menghadirkan permainan inflatable premium Wibit dari Jerman. Keseruan semakin lengkap dengan wahana interaktif seperti Boqu War, Caterpillar Race, paddle board, dan berbagai permainan menarik lainnya.',
    highlights:['Wibit inflatable','Boqu War','Caterpillar Race','Paddle Boat'],
    gallery:[AQ(1), AQ(2), AQ(3), AQ(4), AQ(5), AQ(6)] },

  { id:'malang-skyland', name:'Malang Skyland', type:'alam', area:'Kabupaten Malang, Jawa Timur',
    img:'/brand/malang-skyland/msk-hero.gif', fb:'/brand/malang-skyland/msk-hero.gif',
    desc:'Destinasi wisata modern di Kabupaten Malang yang menawarkan pengalaman di ketinggian dengan pemandangan alam serta gemerlap lampu Kota Malang dan Kota Batu. Terkenal dengan jembatan kaca (Glass Sky Bridge), wahana seperti ATV, dan kafe berkonsep futuristik — cocok untuk keluarga dan pasangan.',
    highlights:['Glass Sky Bridge','ATV','Kidszone','SkyZone','Cafe futuristik'],
    gallery:[MSK(1), MSK(2), MSK(3), '/brand/malang-skyland/malang-skyland-IMG_6941.jpg', MSK(5), MSK(8)] },

  { id:'pinaru-park', name:'Pinaru Park', type:'keluarga', area:'Ciater, Subang',
    img:'/brand/pinaru-park/pinaru-park-02.png', fb:'/brand/pinaru-park/pinaru-park-02.png',
    desc:'Destinasi ramah keluarga yang memadukan keseruan wahana modern dengan kesegaran alam pegunungan. Berada di bawah rindangnya pohon pinus, kami menghadirkan area bermain yang aman dan menyenangkan untuk segala usia — dari wahana yang memacu adrenalin di seluncuran pelangi ikonik hingga bersantai di udara segar.',
    highlights:['Rainbow Slide','Water Slide','ATV','Luge Car','Jacuzzi','Aviary & Mini Zoo'],
    gallery:[
      '/brand/pinaru-park/pinaru-park-02.png',
      '/brand/pinaru-park/pinaru-park-08.png',
      '/brand/pinaru-park/pinaru-park-06.jpg',
      '/brand/pinaru-park/pinaru-park-04.jpg',
      '/brand/pinaru-park/pinaru-park-05.jpg',
      '/brand/pinaru-park/pinaru-park-07.jpg'
    ] },

  { id:'nimo-kaldera-toba', name:'Nimo Kaldera Toba', type:'alam', area:'Danau Toba, Sumut',
    img:KLT(1), fb:KLT(1),
    desc:'Destinasi di kawasan kaldera Danau Toba, danau vulkanik terbesar di dunia. Saat kabut menyapu, keindahan Danau Toba terbentang luas — nikmati pesona alam yang menenangkan di ketinggian, unik dan luar biasa.',
    highlights:['Pemandangan danau','Spot foto','Udara sejuk','Calandra berkuda'],
    gallery:[KLT(1), KLT(3), KLT(5), KLT(6), KLT(7), '/brand/nimo-kaldera-toba/nimo-kaldera-toba-02.png'] },

  { id:'nimo-zoo', name:'Nimo Zoo', type:'keluarga', area:'Area Nimo Highland',
    img:ZOO(1), fb:ZOO(1),
    desc:'Area edukasi satwa dengan interactive storytelling dan sesi feeding time yang aman untuk anak.',
    highlights:['Interactive storytelling','Feeding time','Edukasi satwa'],
    gallery:[ZOO(1), ZOO(2), ZOO(3), ZOO(4), ZOO(5), ZOO(6)] },

  { id:'punceling-park', name:'Punceling Park', type:'air', area:'Ciwidey, Bandung',
    img:'/brand/punceling-park/4320b925-e19f-458d-9c87-cd9f0036b6c4.jpg', fb:'/brand/punceling-park/4320b925-e19f-458d-9c87-cd9f0036b6c4.jpg',
    desc:'Oase ketenangan di Ciwidey, Bandung — destinasi dengan udara sejuk khas pegunungan. Nikmati fasilitas water boom slided usai berkemah atau bersantai, dan lepas penat menikmati alam hijau pegunungan.',
    highlights:['Waterboom','Camping','Kolam air panas','Hutan pinus','Tempat ibadah'],
    gallery:[PUN(1), PUN(3), PUN(4), PUN(5), PUN(6), PUN(7)] },

  { id:'nimo-ecomarine', name:'Nimo Ecomarine', type:'air', area:'Bali',
    img:ECO(1), fb:ECO(1),
    desc:'Petualangan air tak terlupakan di destinasi rekreasi terbaru kami di Bali. Sebagai bagian dari keluarga besar Nimo yang sukses dengan Nimo Highland dan Nimo Water Forest, kami hadirkan Nimo Ecomarine dengan wahana Wibit inflatable water park yang inovatif untuk segala usia, berlokasi strategis di tengah keindahan Nusa Penida dan Pantai Sanur.',
    highlights:['Wibit inflatable','Wahana air inovatif','Nusa Penida & Sanur','Baru dibuka'],
    gallery:[ECO(1), ECO(2), ECO(3), ECO(4), ECOGIF(5), ECO(6)] },
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
  'nimo-highland':       { aerial: '/videos/nimo-tea-resort/aerial.mp4' },
  'nimo-eye':            { aerial: '/videos/nimo-tea-resort/ad.mp4' },
  'nimo-water-forest':   { aerial: '/videos/nimo-resort-ciater/ad.mp4' },
  'bogor-aqua-game':     { aerial: '/videos/new-dgyp-resort/ad.mp4' },
  'malang-skyland':      { aerial: '/videos/savia-hotel-resort/aerial.mp4' },
  'pinaru-park':         { aerial: '/videos/pinaru-park/aerial.MOV' },
  'nimo-kaldera-toba':   { aerial: '/videos/nimo-tea-resort/aerial.mp4' },
  'nimo-zoo':            { aerial: '/videos/nimo-tea-resort/ad.mp4' },
  'punceling-park':      { aerial: '/videos/new-dgyp-resort/aerial.mp4' },
  'nimo-ecomarine':      { aerial: '/videos/new-dgyp-resort/ad.mp4' },
  // Hotel / Resort video footage
  'nimo-tea-resort':     { aerial: '/videos/nimo-tea-resort/aerial.mp4',     ad: '/videos/nimo-tea-resort/ad.mp4' },
  'nimo-resort-ciater':  { aerial: '/videos/nimo-resort-ciater/aerial.mp4',  ad: '/videos/nimo-resort-ciater/ad.mp4' },
  'savia-hotel-resort':  { aerial: '/videos/savia-hotel-resort/aerial.mp4' },
  'new-dgyp-resort':     { aerial: '/videos/new-dgyp-resort/aerial.mp4',     ad: '/videos/new-dgyp-resort/ad.mp4' },
  'glamping-nimoza':     { aerial: '/videos/nimo-tea-resort/aerial.mp4' },
};

/** Flat list of every room with its parent hotel folded in. */
export function allRooms() {
  return HOTELS.flatMap(h =>
    h.rooms.map(r => ({ ...r, hotelId: h.id, hotelName: h.name, area: h.area, facilities: h.facilities })),
  );
}

export const HERO_SLIDES = [
  { img:'/beranda-hero-ultra-hd.jpg', fb:'/beranda-hero-ultra-hd.jpg', alt:'Nimo Sky Bridge & Tea Plantation' },
];

export const MOMENTS = [
  { img:'/moments/tentang-01-glamping.jpg',   fb:'/moments/tentang-01-glamping.jpg' },
  { img:'/moments/tentang-02-cottage.jpg',    fb:'/moments/tentang-02-cottage.jpg' },
  { img:'/moments/tentang-03-skybridge.jpg',  fb:'/moments/tentang-03-skybridge.jpg' },
  { img:'/moments/tentang-04-malang.jpg',     fb:'/moments/tentang-04-malang.jpg' },
  { img:'/moments/tentang-05-nimoeye.jpg',    fb:'/moments/tentang-05-nimoeye.jpg' },
];

export const GALLERY = [
  // Nimo Tea Resort
  { img:TR(2),  fb:TR(2) },
  { img:TR(4),  fb:TR(4) },
  // Nimo Resort Ciater
  { img:RC(1),  fb:RC(1) },
  { img:RC(9),  fb:RC(9) },
  // Savia Hotel Resort
  { img:SV(2),  fb:SV(2) },
  { img:SV(6),  fb:SV(6) },
  // Glamping Nimoza
  { img:GL(1),  fb:GL(1) },
  { img:GL(3),  fb:GL(3) },
  // Pinaru Park
  { img:'/brand/pinaru-park/unnamed-1.jpg', fb:'/brand/pinaru-park/unnamed-1.jpg' },
  { img:PR(5),  fb:PR(5) },
  // Nimo Eye
  { img:NE(1),  fb:NE(1) },
  { img:NE(6),  fb:NE(6) },
  // Nimo Water Forest
  { img:'/brand/nimo-water-forest/nwf-hero.jpg', fb:'/brand/nimo-water-forest/nwf-hero.jpg' },
  { img:NWF(4), fb:NWF(4) },
  // Malang Skyland
  { img:MSK(1), fb:MSK(1) },
  { img:MSK(5), fb:MSK(5) },
  // Nimo Zoo
  { img:ZOO(2), fb:ZOO(2) },
  { img:ZOO(5), fb:ZOO(5) },
  // Nimo Kaldera Toba
  { img:KLT(1), fb:KLT(1) },
  { img:KLT(3), fb:KLT(3) },
  // Aqua Game
  { img:AQ(1),  fb:AQ(1) },
  { img:AQ(4),  fb:AQ(4) },
  // Nimo Ecomarine
  { img:ECO(2), fb:ECO(2) },
  // Punceling Park
  { img:PUN(2), fb:PUN(2) },
];

/* Curated "best of" row shown above the full grid on the Galeri page. Distinct from GALLERY. */
export const GALLERY_FEATURED = [
  { img:NWF(5), fb:NWF(5) },
  { img:PR(3),  fb:PR(3) },
  { img:MSK(7), fb:MSK(7) },
  { img:NE(3),  fb:NE(3) },
  { img:KLT(2), fb:KLT(2) },
  { img:RC(2),  fb:RC(2) },
];

/* ------------------------------------------------------------------
   NEWS & MEDIA COVERAGE (VERIFIED FACTUAL NATIONAL COVERAGE)
------------------------------------------------------------------ */
export const NEWS_SPOTLIGHT = {
  badge: 'Pemenang CNN Indonesia Awards 2024',
  award: 'Extraordinary Service Innovation Initiative',
  title: 'Nimo Highland Dianugerahi Extraordinary Service Innovation Initiative',
  source: 'CNN Indonesia',
  sourceColor: '#CC0000',
  author: 'Dias Saraswati',
  date: '17 September 2024',
  time: '20:18 WIB',
  readTime: '3 mnt baca',
  location: 'Grand Ballroom The Trans Luxury Hotel, Bandung',
  lead: 'Penghargaan bergengsi diserahkan langsung oleh Abdul Aziz selaku Direktur Utama Detik Network kepada CEO Nimo Land Group, Ilham Sunaryanto, pada ajang CNN Indonesia Awards Jawa Barat 2024 bertema "Jawa Barat Menyala untuk Indonesia Maju".',
  desc: 'Apresiasi tingkat nasional ini dianugerahkan atas daya tarik panorama alam 360 derajat, keindahan kebun teh Pangalengan, jembatan ikonik huruf U berstandar internasional, dan kepeloporan inovasi pelayanan pariwisata terintegrasi berkelanjutan.',
  quote: '"Penghargaan ini menjadi motivasi besar bagi Nimo Land Group untuk terus menghadirkan destinasi kelas dunia yang mengedepankan inovasi layanan dan keberlanjutan lingkungan di seluruh Indonesia." — Ilham Sunaryanto, CEO Nimo Land Group',
  url: 'https://www.cnnindonesia.com/gaya-hidup/20240917131307-275-1145148/nimo-highland-dianugerahi-extraordinary-service-innovation-initiative',
  img: '/brand/cnn-awards-2024.png',
  fb: '/brand/cnn-awards-2024.png',
};

export const NEWS_ARTICLES = [
  {
    id: 'news-kompas-panduan',
    title: 'Nimo Highland Bandung: Jam Buka, Tiket Masuk, dan Aktivitas',
    source: 'Kompas Travel',
    sourceColor: '#F58220',
    category: 'Panduan Wisata Ikonik',
    date: '9 Januari 2023',
    readTime: '3 mnt baca',
    lead: 'Panduan lengkap menikmati jembatan kaca Sky Bridge 360 derajat, wahana ATV, spot foto ala Santorini, dan panorama kebun teh Malabar di ketinggian Gunung Nini Pangalengan.',
    url: 'https://travel.kompas.com/read/2023/01/09/070500527/nimo-highland-bandung--jam-buka-tiket-masuk-dan-aktivitas',
    img: '/brand/nimo-highland/nh-01.jpg',
    fb: '/brand/nimo-highland/nh-01.jpg',
  },
  {
    id: 'news-detik-daya-tarik',
    title: 'Nimo Highland: Daya Tarik, Fasilitas Umum, dan Harga Tiket Masuk',
    source: 'detikTravel',
    sourceColor: '#0055A5',
    category: 'Destinasi Favorit Bandung',
    date: '8 Agustus 2024',
    readTime: '3 mnt baca',
    lead: 'Ulasan komprehensif destinasi wisata favorit di Bandung dengan wahana ikonik Nimo Eye berrekor MURI, Glass Sky Bridge, Flying Fox, serta fasilitas rekreasi alam terlengkap.',
    url: 'https://travel.detik.com/domestic-destination/d-7478750/nimo-highland-daya-tarik-fasilitas-umum-dan-harga-tiket-masuk',
    img: '/brand/nimo-eye/nimo-eye-01.jpg',
    fb: '/brand/nimo-eye/nimo-eye-01.jpg',
  },
  {
    id: 'news-kompas-bandung',
    title: 'Nimo Highland Bandung: Harga Tiket, Jam Buka, dan Daya Tarik',
    source: 'Kompas Bandung',
    sourceColor: '#F58220',
    category: 'Pariwisata Daerah',
    date: '22 Mei 2022',
    readTime: '3 mnt baca',
    lead: 'Destinasi hits di kawasan Pangalengan yang menghadirkan jembatan kaca melingkar di atas kebun teh tertua di Jawa Barat dan lanskap spektakuler danau Situ Cileunca.',
    url: 'https://bandung.kompas.com/read/2022/05/22/211257478/nimo-highland-bandung-harga-tiket-jam-buka-dan-daya-tarik?page=all',
    img: '/brand/nimo-highland/nh-02.jpg',
    fb: '/brand/nimo-highland/nh-02.jpg',
  },
  {
    id: 'news-babel-toba',
    title: 'NIMO Land Group Kembangkan NIMO Kaldera Jadi Destinasi Wisata Premium',
    source: 'Babel Insight',
    sourceColor: '#084D77',
    category: 'Ekspansi Skala Nasional',
    date: '2024',
    readTime: '4 mnt baca',
    lead: 'NIMO Land Group mengembangkan NIMO Kaldera di Toba Caldera Resort (TCR) dengan konsep modern natural tourism guna memperkuat kawasan Danau Toba dan meningkatkan durasi kunjungan wisatawan.',
    url: 'https://www.babelinsight.id/nimo-land-group-kembangkan-nimo-kaldera-toba',
    img: '/brand/nimo-kaldera-toba/nimo-kaldera-toba-01.jpg',
    fb: '/brand/nimo-kaldera-toba/nimo-kaldera-toba-01.jpg',
  },
  {
    id: 'news-indoglobe-waterforest',
    title: 'Menjadi Cabang ke-9 Milik Nimo Land Group, Nimo Water Forest Menambah Destinasi Wisata',
    source: 'Indoglobe News',
    sourceColor: '#16A34A',
    category: 'Ekspansi Jaringan Wisata',
    date: '2024',
    readTime: '3 mnt baca',
    lead: 'Nimo Water Forest resmi menjadi destinasi ke-9 jaringan Nimo Land Group, menghadirkan inovasi rekreasi pantai pasir putih buatan dan kolam ombak di tengah rindangnya hutan Purwakarta.',
    url: 'https://indoglobenews.id/blog/Menjadi-Cabang-ke-9-Milik-Nimo-Land-Group-Nimo-Water-Forest-Menambah-Destinasi--Wisata',
    img: '/brand/nimo-water-forest/nimo-water-forest-01.jpg',
    fb: '/brand/nimo-water-forest/nimo-water-forest-01.jpg',
  },
  {
    id: 'news-detik-malang',
    title: 'Daya Tarik Malang Skyland: Sky Bridge, Spot Sunset & Citylight Menghadap Gunung Arjuno',
    source: 'Detik Jatim',
    sourceColor: '#0055A5',
    category: 'Wisata Ketinggian',
    date: '17 Mei 2023',
    readTime: '3 mnt baca',
    lead: 'Destinasi wisata ketinggian berkonsep modern di Karangploso Malang yang menyajikan panorama 360 derajat gemerlap citylight Malang Raya, Glass Sky Bridge, dan wahana petualangan keluarga.',
    url: 'https://www.detik.com/jatim/wisata/d-6725357/daya-tarik-malang-skyland-jam-buka-harga-tiket-dan-fasilitas',
    img: '/brand/malang-skyland/malang-skyland-01.jpg',
    fb: '/brand/malang-skyland/malang-skyland-01.jpg',
  },
  {
    id: 'news-pinaru-ciater',
    title: 'Pinaru Park Ciater: Sensasi Rainbow Slide & Wisata Ramah Keluarga di Hutan Pinus Subang',
    source: 'Detik Jabar',
    sourceColor: '#0055A5',
    category: 'Ekowisata & Resort',
    date: '2024',
    readTime: '3 mnt baca',
    lead: 'Memadukan keseruan wahana modern seluncuran pelangi di bawah naungan pohon pinus serta resort mewah bernuansa alam pegunungan Ciater Subang.',
    url: 'https://travel.detik.com/domestic-destination/d-7478750/nimo-highland-daya-tarik-fasilitas-umum-dan-harga-tiket-masuk',
    img: '/brand/pinaru-park/pinaru-park-02.png',
    fb: '/brand/pinaru-park/pinaru-park-02.png',
  },
  {
    id: 'news-bogor-aqua-game',
    title: 'Bogor Aquagame: Wahana Rintangan Air Terapung Berstandar Internasional di Kota Bogor',
    source: 'Tiket / Detik',
    sourceColor: '#0055A5',
    category: 'Wahana Air Petualangan',
    date: '2024',
    readTime: '3 mnt baca',
    lead: 'Wahana air terapung di atas danau seluas 1,2 hektar dengan rintangan bertaraf internasional dari Jerman yang membentuk formasi tulisan BOGOR dari ketinggian.',
    url: 'https://travel.detik.com/domestic-destination/d-7478750/nimo-highland-daya-tarik-fasilitas-umum-dan-harga-tiket-masuk',
    img: '/brand/aqua-game/aqua-game-01.jpg',
    fb: '/brand/aqua-game/aqua-game-01.jpg',
  },
];



export const MEDIA_VIDEOS = [
  {
    id: 'video-company-profile',
    title: 'Tourism Company - Nimo Land Group',
    channel: 'NIMO LAND GROUP Official',
    badge: 'Official Company Profile',
    date: 'Official Video',
    views: 'YouTube Official',
    youtubeId: '4vwvbq6QWpA',
    url: 'https://youtu.be/4vwvbq6QWpA?si=Z4imBhODeZvuBL8y',
    thumbnail: '/videos/video-company-profile.jpg',
    fb: 'https://i.ytimg.com/vi/4vwvbq6QWpA/hqdefault.jpg',
    desc: 'Profil resmi ekosistem pariwisata terintegrasi Nimo Land Group yang berfokus pada inovasi destinasi alam modern, energi terbarukan, dan dampak sosial.',
  },
  {
    id: 'video-social-impact',
    title: 'WE GREW UP IN THE COMMUNITY AROUND',
    channel: 'NIMO LAND GROUP Official',
    badge: 'Social Impact & CSR',
    date: 'Official Video',
    views: 'YouTube Official',
    youtubeId: 'SYMZjjT0k3E',
    url: 'https://youtu.be/SYMZjjT0k3E?si=H4PbA_NXQ2WkVQmF',
    thumbnail: '/videos/video-social-impact.jpg',
    fb: 'https://i.ytimg.com/vi/SYMZjjT0k3E/hqdefault.jpg',
    desc: 'Dokumentasi komitmen Nimo Land Group tumbuh bersama masyarakat, memberdayakan UMKM lokal, dan menghadirkan dampak positif di sekitar kawasan destinasi.',
  },
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

/* ------------------------------------------------------------------
   10/10 CORPORATE HOLDING GROUP DATA
------------------------------------------------------------------ */

export const FLAGSHIP_DESTINATIONS = [
  {
    id: 'nimo-highland',
    name: 'Nimo Highland',
    category: 'Sky Bridge & Iconic Highland',
    area: 'Pangalengan, Bandung · 1.400 MDPL',
    tag: 'Flagship Destination',
    img: '/brand/nimo-highland/nh-hero.jpg',
    fb: '/brand/nimo-highland/nh-01.jpg',
    video: '/videos/nimo-tea-resort/aerial.mp4',
    desc: 'Destinasi ikonik berketinggian 1.400 MDPL dengan Glass Sky Bridge berbentuk U 150 meter pertama di Indonesia di atas hamparan kebun teh Malabar.',
    highlights: ['Glass Sky Bridge 150M', 'Panorama 360° Kebun Teh', 'ATV & Paintball Adventure', 'Santorini Sky Walk'],
  },
  {
    id: 'nimo-kaldera-toba',
    name: 'NIMO Kaldera',
    category: 'Integrated Nature Tourism',
    area: 'Toba Caldera Resort (TCR), Sumatera Utara',
    tag: 'Super Priority Expansion',
    img: '/brand/nimo-kaldera-toba/nimo-kaldera-toba-01.jpg',
    fb: '/brand/nimo-kaldera-toba/nimo-kaldera-toba-01.jpg',
    video: '/videos/nimo-tea-resort/aerial.mp4',
    desc: 'Kawasan wisata alam modern terpadu di Destinasi Pariwisata Super Prioritas (DPSP) Kaldera Danau Toba bekerja sama dengan BPODT.',
    highlights: ['Danau Vulkanik Terbesar', 'Calandra Horse Riding', 'Iconic Viewpoint TCR', 'Modern Eco Tourism'],
  },
  {
    id: 'nimo-water-forest',
    name: 'Nimo Water Forest',
    category: 'Tropical Water Park & Beach',
    area: 'Bungursari, Purwakarta, Jawa Barat',
    tag: 'Water Theme Park',
    img: '/brand/nimo-water-forest/nwf-hero.jpg',
    fb: '/brand/nimo-water-forest/nwf-hero.jpg',
    video: '/videos/nimo-resort-ciater/ad.mp4',
    desc: 'Konsep pantai pasir putih tropis buatan pertama di tengah rindangnya hutan alam Purwakarta dengan kolam ombak dan wahana petualangan keluarga.',
    highlights: ['Pantai Pasir Putih Buatan', 'Kolam Ombak Alami', 'Waterfall Resto', 'ATV Forest Track'],
  },
  {
    id: 'malang-skyland',
    name: 'Malang Skyland',
    category: 'Highland Nature & Citylight',
    area: 'Karangploso, Kabupaten Malang, Jawa Timur',
    tag: 'East Java Flagship',
    img: '/brand/malang-skyland/malang-skyland-01.jpg',
    fb: '/brand/malang-skyland/malang-skyland-01.jpg',
    video: '/videos/savia-hotel-resort/aerial.mp4',
    desc: 'Destinasi wisata ketinggian berkonsep modern di lereng Gunung Arjuno yang menyajikan pemandangan gemerlap citylight Malang Raya 360 derajat.',
    highlights: ['Glass Sky Bridge', 'Sky Net & Sunset Deck', 'Citylight Malang Raya', 'Futuristic Cafe'],
  },
  {
    id: 'nimo-eye',
    name: 'Nimo Eye',
    category: 'Highest Elevation Ferris Wheel',
    area: 'Gunung Nini, Pangalengan · 1.400 MDPL',
    tag: 'Rekor MURI Nasional',
    img: '/brand/nimo-eye/nimo-eye-01.jpg',
    fb: '/brand/nimo-eye/nimo-eye-01.jpg',
    video: '/videos/nimo-tea-resort/ad.mp4',
    desc: 'Bianglala dengan elevasi tertinggi di Indonesia yang tercatat resmi di Rekor MURI, melayang di atas kabut kebun teh Malabar dari ketinggian 1.400 MDPL.',
    highlights: ['Elevasi Tertinggi 1.400 MDPL', 'VIP & Regular Cabins', 'Dine & Karaoke in Sky', '360° Mist Panorama'],
  },
  {
    id: 'nimo-resort-ciater',
    name: 'Nimo Resort & DGYP Ciater',
    category: 'Nordic Resort & Eco Lodging',
    area: 'Ciater, Subang, Jawa Barat',
    tag: 'Hospitality Cluster',
    img: '/brand/nimo-resort-ciater/nimo-resort-ciater-01.png',
    fb: '/brand/pinaru-park/pinaru-park-02.png',
    video: '/videos/pinaru-park/aerial.MOV',
    desc: 'Kawasan resort terpadu berkonsep Nordic European dan vila kayu alami dengan kolam air panas, berdampingan dengan wahana Pinaru Park.',
    highlights: ['Hot Spring Mineral Pool', 'Nordic European Cabins', 'Pinaru Park Rainbow Slide', 'Pine Forest Glamping'],
  },
];

export const PRESENCE_REGIONS = [
  {
    id: 'sumut-toba',
    name: 'Danau Toba, Sumatera Utara',
    island: 'Sumatera',
    coords: { x: '18%', y: '32%' },
    destinations: ['NIMO Kaldera Toba'],
    tag: 'DPSP Danau Toba (TCR)',
    desc: 'Destinasi Pariwisata Super Prioritas Danau Toba bersama BPODT.',
    img: '/brand/nimo-kaldera-toba/nimo-kaldera-toba-01.jpg',
  },
  {
    id: 'jabar-bandung',
    name: 'Bandung Raya (Pangalengan & Ciwidey)',
    island: 'Jawa Barat',
    coords: { x: '35%', y: '68%' },
    destinations: ['Nimo Highland', 'Nimo Eye', 'Nimo Tea Resort', 'Nimo Zoo', 'Punceling Park', 'Glamping Nimoza'],
    tag: 'Flagship Highland Cluster',
    desc: 'Klaster wisata ketinggian kebun teh, rekor MURI, dan resort alam.',
    img: '/brand/nimo-highland/nh-hero.jpg',
  },
  {
    id: 'jabar-subang',
    name: 'Subang (Ciater)',
    island: 'Jawa Barat',
    coords: { x: '37%', y: '65%' },
    destinations: ['Nimo Resort Ciater', 'Pinaru Park', 'New DGYP Resort', 'Savia Hotel & Resort'],
    tag: 'Hospitality & Wellness',
    desc: 'Klaster resort Nordic, private onsen air panas, dan taman rekreasi pinus.',
    img: '/brand/pinaru-park/pinaru-park-02.png',
  },
  {
    id: 'jabar-purwakarta',
    name: 'Purwakarta',
    island: 'Jawa Barat',
    coords: { x: '34%', y: '64%' },
    destinations: ['Nimo Water Forest'],
    tag: 'Tropical Water Park',
    desc: 'Pantai buatan pasir putih dan kolam ombak di hutan tropis.',
    img: '/brand/nimo-water-forest/nwf-hero.jpg',
  },
  {
    id: 'jabar-bogor',
    name: 'Bogor',
    island: 'Jawa Barat',
    coords: { x: '33%', y: '66%' },
    destinations: ['Bogor Aqua Game'],
    tag: 'Watersport Adventure',
    desc: 'Wahana inflatable terapung standar internasional Wibit Jerman.',
    img: '/brand/aqua-game/aqua-game-01.jpg',
  },
  {
    id: 'jatim-malang',
    name: 'Malang & Batu, Jawa Timur',
    island: 'Jawa Timur',
    coords: { x: '52%', y: '75%' },
    destinations: ['Malang Skyland'],
    tag: 'Highland & Citylight',
    desc: 'Wisata ketinggian modern dengan panorama Arjuno dan citylight.',
    img: '/brand/malang-skyland/malang-skyland-01.jpg',
  },
  {
    id: 'bali',
    name: 'Bali (Sanur & Nusa Penida)',
    island: 'Bali',
    coords: { x: '60%', y: '78%' },
    destinations: ['Nimo Ecomarine'],
    tag: 'Marine Tourism',
    desc: 'Petualangan wisata air ramah lingkungan dan marine park.',
    img: '/brand/nimo-ecomarine/nimo-ecomarine-01.jpg',
  },
];

export const HOSPITALITY_COLLECTION = [
  {
    id: 'nimo-resort-ciater',
    name: 'Nimo Resort Ciater',
    type: 'Nordic European Resort',
    location: 'Ciater, Subang, Jawa Barat',
    startingRate: 'Rp 650.000',
    img: '/brand/nimo-resort-ciater/nimo-resort-ciater-01.png',
    fb: '/brand/pinaru-park/pinaru-park-02.png',
    features: ['Kolam Air Panas Alami', 'Nordic Wooden Architecture', 'Akses Eksklusif Ciater Park'],
  },
  {
    id: 'new-dgyp-resort',
    name: 'New DGYP Resort',
    type: 'Rustic Villa & Family Glamping',
    location: 'Ciater, Subang, Jawa Barat',
    startingRate: 'Rp 550.000',
    img: '/brand/dgyp/junior-private-pool-1.jpg',
    fb: '/brand/dgyp/junior-suite-1.jpg',
    features: ['Private Onsen Jacuzzi', 'Vila Bambu & Modern Woody', 'Satu Kawasan Pinaru Park'],
  },
  {
    id: 'nimo-tea-resort',
    name: 'Nimo Tea Resort',
    type: 'Mountain View Tea Resort',
    location: 'Pangalengan, Bandung',
    startingRate: 'Rp 950.000',
    img: '/brand/nimo-tea-resort/nimo-tea-resort-01.png',
    fb: '/brand/nimo-highland/nh-01.jpg',
    features: ['Balkon 360° Kebun Teh', 'Sunrise Point Gunung Nini', 'Akses Nimo Highland & Nimo Eye'],
  },
  {
    id: 'savia-hotel-resort',
    name: 'Savia Hotel & Resort',
    type: 'Hillside Modern Cabins',
    location: 'Ciater, Subang, Jawa Barat',
    startingRate: 'Rp 600.000',
    img: '/brand/savia-hotel-resort/savia-hotel-resort-01.png',
    fb: '/brand/savia-hotel-resort/savia-hotel-resort-02.jpg',
    features: ['Modern Cabin Glass Wall', 'Cottage Mezzanine Suite', 'Corporate Gathering Venue'],
  },
];

export const ABOUT_PILLARS = [
  {
    id: 'who-we-are',
    title: 'Who We Are',
    subtitle: 'Leading Integrated Tourism & Hospitality Group',
    content: 'Nimo Land Group (PT Nimo Hotel & Resort) adalah kelompok usaha pariwisata terintegrasi nasional yang berfokus pada pembangunan destinasi ikonik modern, perhotelan bernuansa alam, dan pemberdayaan ekonomi lokal berbasis keberlanjutan.',
  },
  {
    id: 'what-we-build',
    title: 'What We Build',
    subtitle: 'Iconic Theme Parks, Sky Attractions & Eco Resorts',
    content: 'Kami merancang dan mengoperasikan portofolio destinasi berstandar dunia — mulai dari jembatan kaca Sky Bridge 150M, bianglala elevasi tertinggi 1.400 MDPL (Rekor MURI), taman wisata air ramah keluarga, hingga resort berarsitektur khas Nordic dan rustic di seluruh Indonesia.',
  },
  {
    id: 'where-were-going',
    title: "Where We're Going",
    subtitle: 'National Expansion Across Super Priority Destinations',
    content: 'Menuju ekosistem pariwisata nasional terpadu, Nimo Land Group berekspansi ke Destinasi Pariwisata Super Prioritas (DPSP) Danau Toba, Bali, Jawa Timur, dan pulau-pulau utama Nusantara dengan komitmen ESG dan inovasi energi ramah lingkungan.',
  },
];

export const CORPORATE_VISION = {
  statement: 'To become one of Indonesia’s leading integrated tourism and hospitality groups.',
  statementId: 'Menjadi salah satu grup pariwisata dan perhotelan terintegrasi terdepan di Indonesia yang berdaya saing global dan berdampak nyata bagi masyarakat.',
};

export const IMPACT_METRICS = {
  headline: 'Tourism That Creates Impact',
  subheadline: 'Pariwisata berkelanjutan yang memberdayakan ekonomi lokal, UMKM, dan ribuan tenaga kerja daerah di seluruh ekosistem destinasi kami.',
  stats: [
    { value: '5.000+', label: 'MSMEs Empowered', desc: 'Mitra UMKM lokal kuliner, kerajinan, dan jasa di sekitar destinasi.' },
    { value: '600+', label: 'Local Workforce', desc: 'Tenaga kerja lokal yang terlatih dengan standar hospitality profesional.' },
    { value: '100.000+', label: 'Monthly Visitors', desc: 'Pengunjung domestik & mancanegara yang menggerakkan perputaran ekonomi daerah.' },
  ],
  photos: [
    { img: '/brand/nimo-highland/nh-02.jpg', caption: 'Pemberdayaan UMKM lokal perkebunan teh Pangalengan' },
    { img: '/brand/pinaru-park/pinaru-park-02.png', caption: 'Kolaborasi ekonomi masyarakat hutan pinus Ciater' },
    { img: '/brand/malang-skyland/malang-skyland-01.jpg', caption: 'Ekosistem kuliner & talenta lokal Jawa Timur' },
  ],
};

export const PARTNERSHIP_AREAS = [
  {
    id: 'property-resort',
    title: 'Property & Resort Partnership',
    desc: 'Pengembangan dan pengelolaan bersama hotel, vila, dan glamping resort dengan standar manajemen hospitality terpadu.',
    icon: 'building-2',
  },
  {
    id: 'destination-dev',
    title: 'Tourism Destination Development',
    desc: 'Master planning, pembangunan wahana tematik, dan operasionalisasi kawasan wisata alam berkonsep modern.',
    icon: 'mountain',
  },
  {
    id: 'land-collaboration',
    title: 'Land & Asset Collaboration',
    desc: 'Optimalisasi lahan strategis BUMN, pemerintah daerah, maupun pemilik lahan swasta menjadi aset produktif bernilai tinggi.',
    icon: 'map-pin',
  },
  {
    id: 'strategic-investment',
    title: 'Strategic Investment Partnership',
    desc: 'Kemitraan investasi institusional berkelanjutan untuk ekspansi portofolio pariwisata skala nasional di Indonesia.',
    icon: 'trending-up',
  },
];

export const LEADERSHIP = {
  title: 'Executive Leadership',
  subtitle: 'Dipimpin oleh figur berpengalaman yang berdedikasi membangun destinasi kelas dunia berdaya saing global.',
  founder: {
    name: 'Ilham Sunaryanto',
    role: 'Founder & Chief Executive Officer (CEO)',
    award: 'Penerima CNN Indonesia Awards 2024 (Extraordinary Service Innovation Initiative)',
    bio: 'Visioner di balik transformasi pariwisata alam modern terintegrasi di Indonesia, memimpin ekspansi Nimo Land Group dari Jawa Barat hingga skala nasional ke Danau Toba dan Bali.',
    img: '/brand/cnn-awards-2024.png',
  },
  executives: [
    {
      name: 'Board of Directors',
      role: 'Hospitality & Asset Development',
      dept: 'PT Nimo Hotel & Resort',
      desc: 'Mengawasi perancangan arsitektur, standar konstruksi berkelanjutan, dan manajemen portofolio resort terpadu.',
    },
    {
      name: 'Operations Leadership',
      role: 'Theme Park & Guest Experience',
      dept: 'Nimo Land Group Operations',
      desc: 'Memastikan standar keselamatan internasional wahana, keunggulan layanan, dan kepuasan ratusan ribu pengunjung.',
    },
    {
      name: 'Strategic Partnership & ESG',
      role: 'Institutional Relations & Community Impact',
      dept: 'Corporate Affairs',
      desc: 'Menjalin kolaborasi institusional dengan kementerian/otorita, BUMN, mitra investasi, dan 5.000+ UMKM lokal.',
    },
  ],
};

export const NIMO_JOURNEY = [
  {
    year: '2021',
    title: 'Foundation & Strategic Vision',
    desc: 'Pendirian holding group dengan misi mentransformasikan pariwisata alam Indonesia menjadi destinasi kelas dunia yang ramah lingkungan.',
  },
  {
    year: '2022',
    title: 'First Iconic Destination: Nimo Highland',
    desc: 'Peluncuran Nimo Highland di Pangalengan Bandung dengan Glass Sky Bridge 150 meter yang langsung menjadi landmark pariwisata nasional.',
  },
  {
    year: '2023',
    title: 'Regional Theme Park Scale',
    desc: 'Ekspansi ke Jawa Timur melalui Malang Skyland dan wahana petualangan air internasional Bogor Aqua Game.',
  },
  {
    year: '2024',
    title: 'MURI Record & Hospitality Cluster',
    desc: 'Peresmian Nimo Eye (Rekor MURI Bianglala Tertinggi 1.400 MDPL), Nimo Water Forest Purwakarta, dan peluncuran klaster resort Ciater Subang.',
  },
  {
    year: '2025',
    title: 'Super Priority National Destinations',
    desc: 'Pengembangan NIMO Kaldera di Toba Caldera Resort (TCR) Sumatera Utara bersama BPODT serta ekspansi Nimo Ecomarine Bali.',
  },
  {
    year: '2026+',
    title: 'Future of Integrated Tourism',
    desc: 'Memperluas jaringan holding pariwisata berkelanjutan ke seluruh penjuru Nusantara dengan teknologi ramah lingkungan dan dampak sosial terukur.',
  },
];

export const RECOGNITION_PARTNERS = [
  { name: 'CNN Indonesia', logoText: 'CNN INDONESIA', note: 'Awards 2024 Winner' },
  { name: 'MURI', logoText: 'REKOR MURI', note: 'Bianglala Tertinggi Indonesia' },
  { name: 'BPODT', logoText: 'BPODT KEMENPAR', note: 'Toba Caldera Strategic Partner' },
  { name: 'Kompas.com', logoText: 'KOMPAS.com', note: 'National Media Partner' },
  { name: 'detikcom', logoText: 'detikTravel', note: 'National Press Coverage' },
];

