import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Save } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Video {
  id: number;
  title: string;
  blurb: string;
  tags?: string[];
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
  thumbnail_url?: string;
}

export default function VideoCard({ video }: { video: Video }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/likes/toggle", { flashtalk_id: video.id });
      window.location.reload();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/saved/toggle", { flashtalk_id: video.id });
      window.location.reload();
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const thumbnail =
    video.thumbnail_url ||
    video.video_url?.replace(/\?.*$/, "") + "/thumbnail.jpg" ||
    "";

  return (
    <div className="bg-white rounded shadow overflow-hidden hover:shadow-md transition">
      <Link to={`/video/${video.id}`}>
        <div className="relative">
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-44 object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={handleLike}
              className="bg-white/80 rounded-full p-1 hover:bg-white"
              title="Like"
            >
              <Heart
                size={16}
                className={video.liked_by_me ? "text-red-500" : "text-gray-500"}
              />
              <span className="text-xs ml-1">{video.like_count ?? 0}</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-white/80 rounded-full p-1 hover:bg-white"
              title="Save"
            >
              <Save
                size={16}
                className={
                  video.saved_by_me ? "text-blue-600" : "text-gray-500"
                }
              />
            </button>
          </div>
        </div>
      </Link>
      <div className="p-2">
        <Link
          to={`/video/${video.id}`}
          className="font-semibold block truncate hover:underline"
        >
          {video.title}
        </Link>
        <p className="text-xs text-gray-500">{video.owner_name}</p>
      </div>
    </div>
  );
}
