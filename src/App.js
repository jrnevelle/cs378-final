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
        <Route path="/" element={<Home/>}/>
        <Route path="/trip/:id/home" element={<TripHome/>}/>
        <Route path="/trip/:id/calendar" element={<Calendar />} />
        <Route path="/trip/:id/settings" element={<Settings />} />
        <Route path="/trip/:id/ideas" element={<Ideas />} />
        <Route path="/trip/:id/profile" element={<Profile/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
      {tripPage && <Navbar/>}
    </>
  );
}


export default App;
