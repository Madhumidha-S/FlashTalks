import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const [talk, setTalk] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, requireAuthRedirect } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/flashtalks/published", {
          params: { limit: 100 },
        });
        const found = (res.data.results || []).find(
          (t: any) => String(t.id) === String(id)
        );
        setTalk(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleLike = async () => {
    if (!user) return requireAuthRedirect();
    try {
      await api.post("/likes/toggle", { flashtalk_id: id });
      const res = await api.get("/flashtalks/published", {
        params: { limit: 100 },
      });
      const found = (res.data.results || []).find(
        (t: any) => String(t.id) === String(id)
      );
      setTalk(found || null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSave = async () => {
    if (!user) return requireAuthRedirect();
    try {
      await api.post("/saved/toggle", { flashtalk_id: id });
      const res = await api.get("/flashtalks/published", {
        params: { limit: 100 },
      });
      const found = (res.data.results || []).find(
        (t: any) => String(t.id) === String(id)
      );
      setTalk(found || null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!talk) return <div className="p-8">Video not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="aspect-video bg-black">
          <video
            src={talk.video_url}
            controls
            className="w-full h-full"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{talk.title}</h1>
          <div className="flex gap-3">
            <button
              onClick={toggleLike}
              className={`px-4 py-2 rounded ${
                talk.liked_by_me ? "bg-red-600 text-white" : "bg-gray-100"
              }`}
            >
              {talk.liked_by_me ? "Liked" : "Like"} ({talk.like_count || 0})
            </button>
            <button
              onClick={toggleSave}
              className={`px-4 py-2 rounded ${
                talk.saved_by_me ? "bg-green-600 text-white" : "bg-gray-100"
              }`}
            >
              {talk.saved_by_me ? "Saved" : "Save"} ({talk.save_count || 0})
            </button>
          </div>
          <p className="mt-4 text-gray-700">{talk.blurb}</p>
        </div>
      </div>
    </div>
  );
}
