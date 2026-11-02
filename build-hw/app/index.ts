import { routes } from './routes';
import { add } from './utils';

console.log(add(2, 3));

const routeName = location.hash === '#about' ? 'about' : 'home';
const route = await routes[routeName]();

console.log(route.renderPage());
