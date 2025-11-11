import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, Volume2, Maximize } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import api from "../lib/api";

export default function VideoPlayer() {
  const { id } = useParams();
  const [talk, setTalk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        console.log("Fetching /flashtalks/" + id);
        const res = await api.get(`/flashtalks/${id}`);
        console.log("Got video:", res.data);
        setTalk(res.data);
      } catch (err: any) {
        console.error("Error fetching video:", err);
        setError("Video not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video && video.requestFullscreen) video.requestFullscreen();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading video...
      </div>
    );

  if (error || !talk)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        {error || "Video not found"}
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        <main className="flex-1 px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  src={talk.video_url}
                  className="w-full h-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={() => {
                    const video = videoRef.current;
                    if (video) {
                      setProgress((video.currentTime / video.duration) * 100);
                    }
                  }}
                >
                  Your browser does not support HTML5 video.
                </video>

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition"
                    >
                      <Play size={36} className="text-gray-900 ml-1" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button onClick={handlePlayPause} className="text-white">
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    <div className="flex-1 bg-gray-600 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <button className="text-white">
                      <Volume2 size={24} />
                    </button>
                    <button onClick={handleFullscreen} className="text-white">
                      <Maximize size={24} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-3">
                  {talk.title || "Untitled Video"}
                </h1>
                <p className="text-gray-700 mb-4">
                  {talk.blurb || "No description available."}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.post("/likes/toggle", {
                          flashtalk_id: talk.id,
                        });
                        const { liked_by_me, like_count } = res.data;
                        setTalk((prev: any) => ({
                          ...prev,
                          liked_by_me,
                          like_count,
                        }));
                      } catch (err) {
                        console.error("Error toggling like:", err);
                      }
                    }}
                    className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                      talk.liked_by_me
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{talk.liked_by_me ? "Liked" : "Like"}</span>
                    <span className="text-sm opacity-80">
                      {talk.like_count || 0}
                    </span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        const res = await api.post("/saved/toggle", {
                          flashtalk_id: talk.id,
                        });
                        const { saved_by_me, save_count } = res.data;
                        setTalk((prev: any) => ({
                          ...prev,
                          saved_by_me,
                          save_count,
                        }));
                      } catch (err) {
                        console.error("Error toggling save:", err);
                      }
                    }}
                    className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                      talk.saved_by_me
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{talk.saved_by_me ? "Saved" : "Save"}</span>
                    <span className="text-sm opacity-80">
                      {talk.save_count || 0}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
