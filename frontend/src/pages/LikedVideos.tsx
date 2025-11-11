import React, { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import Footer from "../components/Footer";

interface Video {
  id: number;
  title: string;
  blurb: string;
  video_url: string;
  owner_name?: string;
  owner_avatar?: string;
  like_count?: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
}

export default function LikedVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        console.log("Fetching liked videos...");
        const res = await api.get<Video[]>("/likes/my");
        console.log("Response:", res.data);
        setVideos(res.data || []);
      } catch (err: any) {
        console.error(
          "Error fetching liked videos:",
          err.response?.data || err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Liked Videos</h1>
        </header>

        <main className="flex-1 px-8 py-6">
          {loading ? (
            <p>Loading...</p>
          ) : videos.length === 0 ? (
            <p>You haven’t liked any videos yet.</p>
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
