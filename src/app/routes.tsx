import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProductDetail } from './pages/ProductDetail';
import { MyTasks } from './pages/MyTasks';
import { AdminPage } from './pages/AdminPage';
import { StylistePage } from './pages/StylistePage';
import { MarketingPage } from './pages/MarketingPage';
import { IngenieurPage } from './pages/IngenieurPage';
import { QualitePage } from './pages/QualitePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { path: 'dashboard', Component: Dashboard },
      { path: 'my-tasks', Component: MyTasks },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'admin', Component: AdminPage },
      { path: 'styliste', Component: StylistePage },
      { path: 'marketing', Component: MarketingPage },
      { path: 'ingenieur', Component: IngenieurPage },
      { path: 'qualite', Component: QualitePage },
    ],
  },
]);
