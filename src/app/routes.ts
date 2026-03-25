import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { CampaignDetail } from './pages/CampaignDetail';
import { CreateCampaign } from './pages/CreateCampaign';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { SuperAdmin } from './pages/SuperAdmin';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RegisterIndividual } from './pages/RegisterIndividual';
import { RegisterBusiness } from './pages/RegisterBusiness';
import { RegisterParent } from './pages/RegisterParent';
import { RegisterStudent } from './pages/RegisterStudent';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'browse', Component: Browse },
      { path: 'campaign/:id', Component: CampaignDetail },
      { path: 'create', Component: CreateCampaign },
      { path: 'dashboard', Component: Dashboard },
      { path: 'admin', Component: Admin },
      { path: 'how-it-works', Component: Home },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'register/individual', Component: RegisterIndividual },
      { path: 'register/business', Component: RegisterBusiness },
      { path: 'register/parent', Component: RegisterParent },
      { path: 'register/student', Component: RegisterStudent },
    ],
  },
  // Super Admin is a standalone route (no Navbar/Footer wrapper)
  { path: '/super-admin', Component: SuperAdmin },
]);