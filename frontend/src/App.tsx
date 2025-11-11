import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import VideoPlayer from "./pages/VideoPlayer";
import EditVideo from "./pages/EditVideo";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trending" element={<Dashboard />} />
        <Route path="/liked" element={<Dashboard />} />
        <Route path="/saved" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/edit/:id" element={<EditVideo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
