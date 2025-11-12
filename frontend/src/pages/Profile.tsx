import { useState, useEffect } from "react";
import { User, Upload as UploadIcon, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import Footer from "../components/Footer";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Video {
  id: number;
  title: string;
  blurb: string;
  video_url: string;
  thumbnail_url?: string;
  owner_name?: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        if (!user) return;
        const res = await api.get("/users/me/videos");
        console.log("My videos:", res.data);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching user videos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, [user]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Videos</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/upload"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Upload
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-8 py-6">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-600">
              Loading your videos...
            </div>
          ) : videos.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-24 flex flex-col items-center justify-center max-w-3xl w-full">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <UploadIcon size={40} className="text-blue-700" />
                </div>
                <Link
                  to="/upload"
                  className="text-blue-700 text-lg font-medium hover:underline"
                >
                  Upload a video
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
