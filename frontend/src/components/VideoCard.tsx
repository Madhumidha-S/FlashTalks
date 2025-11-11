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

import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function VideoCard({ video }: { video: Video }) {
  const { user, requireAuthRedirect } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return requireAuthRedirect();
    try {
      await api.post("/likes/toggle", { flashtalk_id: video.id });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const thumbnail =
    video.thumbnail_url ||
    video.video_url?.replace(/\?.*$/, "") + "/thumbnail.jpg" ||
    "";

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <Link to={`/video/${video.id}`}>
        <div className="relative">
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-44 object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 px-2 py-1"
            >
              <Heart
                size={16}
                className={video.liked_by_me ? "text-red-500" : "text-gray-500"}
              />
              <span className="text-xs">{video.like_count ?? 0}</span>
            </button>
          </div>
        </div>
      </Link>
      <div className="p-2">
        <Link
          to={`/video/${video.id}`}
          className="font-semibold block truncate"
        >
          {video.title}
        </Link>
        <p className="text-xs text-gray-500">{video.owner_name}</p>
      </div>
    </div>
  );
}
