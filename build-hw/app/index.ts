import { loadRoute, type RouteName } from './routes';
import { formatGreeting, sumNumbers } from './utils';

const routeName: RouteName = location.hash === '#about' ? 'about' : 'home';
const total = sumNumbers([4, 7, 9]);

document.body.innerHTML = `
  <main>
    <h1>${formatGreeting('esbuild')}</h1>
    <p>Сумма чисел: ${total}</p>
    <p id="route-content">Загружаем страницу...</p>
  </main>
`;

const route = await loadRoute(routeName);
const routeContent = document.querySelector('#route-content');

if (routeContent) {
  routeContent.textContent = route.renderPage();
}
