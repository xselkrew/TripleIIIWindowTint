import { defineMiddleware } from 'astro:middleware';

const CANONICAL_ORIGIN = 'https://www.cartintfortworth.com';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

export const onRequest = defineMiddleware(({ url }, next) => {
  if (url.hostname !== 'www.cartintfortworth.com' && !LOCAL_HOSTNAMES.has(url.hostname)) {
    const destination = new URL(`${url.pathname}${url.search}`, CANONICAL_ORIGIN);
    return Response.redirect(destination, 301);
  }

  return next();
});
