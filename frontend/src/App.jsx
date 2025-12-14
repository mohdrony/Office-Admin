import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Projects from "./pages/Projects";
import People from "./pages/People";
import Events from "./pages/Events";
import TimeEntries from "./pages/TimeEntries";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex">
        <nav className="w-48 bg-gray-100 p-4 space-y-2">
          <NavLink to="/projects" className="block">Projects</NavLink>
          <NavLink to="/people" className="block">People</NavLink>
          <NavLink to="/events" className="block">Events</NavLink>
          <NavLink to="/time" className="block">Time</NavLink>
        </nav>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/projects" element={<Projects />} />
            <Route path="/people" element={<People />} />
            <Route path="/events" element={<Events />} />
            <Route path="/time" element={<TimeEntries />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
