import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import Home from "./pages/Home"
import TripHome from "./pages/TripHome"
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar";
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Ideas from './pages/Ideas';
import './App.css';

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

function Layout() {
  const tripPage = useLocation().pathname.startsWith("/trip/");
  return (
    <>
      <Routes>
        <Route path="cs378-final/" element={<Home/>}/>
        <Route path="cs378-final/trip/:id/home" element={<TripHome/>}/>
        <Route path="cs378-final/trip/:id/calendar" element={<Calendar />} />
        <Route path="cs378-final/trip/:id/settings" element={<Settings />} />
        <Route path="cs378-final/trip/:id/ideas" element={<Ideas />} />
        <Route path="cs378-final/trip/:id/profile" element={<Profile/>}/>
        <Route path="cs378-final/profile" element={<Profile/>}/>
      </Routes>
      {tripPage && <Navbar/>}
    </>
  );
}


export default App;
