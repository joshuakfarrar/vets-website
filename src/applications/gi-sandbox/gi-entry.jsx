import 'platform/polyfills';
import './sass/gi-sandbox.scss';

import startApp from 'platform/startup/router';
import { buildRoutes } from './routes';
import reducer from '../gi/reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  routes: buildRoutes(),
  reducer,
  entryName: manifest.entryName,
});
