import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";

import Home from "./pages/home/Home.jsx";
import Timeline from "./pages/timeline/Timeline.jsx";
import Projects from "./pages/projects/Projects.jsx";
import Calendar from "./pages/calendar/Calendar.jsx";
import Login from "./pages/login/Login.jsx";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Auth routes (no sidebar/navbar) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* App routes (with sidebar/navbar) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="projects" element={<Projects />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
