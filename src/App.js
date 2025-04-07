// ✅ src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import PastTrips from './pages/PastTrips';
import PlanNewTrip from './pages/PlanNewTrip';
import TripHome from './pages/TripHome';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Ideas from './pages/Ideas';
import NewIdea from './pages/NewIdea';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CreateTripPage from './pages/CreateTripPage';
import WelcomePage from './pages/WelcomePage';
import { IdeaProvider } from './data/IdeaContext';
import './App.css';
import IdeaDetails from './pages/IdeaDetails';
function App() {
  return (
    <Router>
      <IdeaProvider>
        <Layout />
      </IdeaProvider>
    </Router>
  );
}

function Layout() {
  const tripPage = useLocation().pathname.startsWith('/trip/');

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/plan-new-trip" element={<CreateTripPage />} />
        <Route path="/past-trips" element={<PastTrips />} />
        <Route path="plan-new-trip" element={<PlanNewTrip />} />
        <Route path="/trip/:id/home" element={<TripHome />} />
        <Route path="/trip/:id/calendar" element={<Calendar />} />
        <Route path="/trip/:id/settings" element={<Settings />} />
        <Route path="/trip/:id/ideas" element={<Ideas />} />
        <Route path="/trip/:id/profile" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trip/:id/ideas/new" element={<NewIdea />} />
        <Route path="/trip/:tripId/ideas/:ideaId" element={<IdeaDetails/>} />
      </Routes>
      {tripPage && <Navbar />}
    </>
  );
}

export default App;
