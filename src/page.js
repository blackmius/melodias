import { z, page } from './2ombular';

const NotFound = n => z._h1(n);

const routes = {}
let p, l;
export function register(route, fn) {
    routes[route] = fn;
    if (page.route == route) {
        p = fn();
        l = document.location.hash;
        page.update();
    }
}

const Page = z._(_ => {
    if (l !== document.location.hash) {
        const fn = routes[page.route];
        if (!fn) p = NotFound(page.route);
        else p = fn();
        l = document.location.hash;
    }
    return p;
});

export default Object.assign(Page, { register });
