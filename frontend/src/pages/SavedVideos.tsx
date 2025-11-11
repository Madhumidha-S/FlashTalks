import React, { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import Footer from "../components/Footer";

export default function SavedVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get("/saved/my");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching saved videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Saved Videos</h1>
        </header>

        <main className="flex-1 px-8 py-6">
          {loading ? (
            <p>Loading...</p>
          ) : videos.length === 0 ? (
            <p>You haven’t saved any videos yet.</p>
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
