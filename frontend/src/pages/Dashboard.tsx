interface Video {
  id: number;
  title: string;
  blurb: string;
  tags: string[];
  duration_min?: number;
  owner_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  video_url: string;
  owner_name?: string;
  owner_avatar?: string;
  like_count?: number;
  save_count?: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
}

import React, { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import Footer from "../components/Footer";
import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const res = await api.get("/flashtalks/published", {
          params: {
            q: searchQuery,
            tags: selectedFilter === "All" ? "" : selectedFilter,
          },
        });
        //setVideos(Array.isArray(res.data) ? res.data : res.data.results || []);
        console.log("API response:", res.data);
        setVideos(res.data.results || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [searchQuery, selectedFilter]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full bg-blue-50 border-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 placeholder-gray-400"
              />
              <Search
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <Link
            to="/profile"
            className="ml-6 w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition-colors"
          >
            <User size={20} className="text-white" />
          </Link>
        </header>

        <main className="flex-1 px-8 py-6">
          <div className="mb-6">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              <option>All</option>
              <option>Education</option>
              <option>Technology</option>
              <option>Business</option>
              <option>Creative</option>
            </select>
          </div>

          {videos.length === 0 ? (
            <p>No videos available.</p>
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
