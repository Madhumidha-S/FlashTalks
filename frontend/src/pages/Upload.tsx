import React, { useState } from "react";
import { Upload as UploadIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return alert("Please select a video file");
    setLoading(true);

    try {
      const fileNameEncoded = encodeURIComponent(video.name);
      const videoRes = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/upload/upload-url?fileName=${fileNameEncoded}&fileType=${encodeURIComponent(
          video.type
        )}`,
        { credentials: "include" }
      );
      if (!videoRes.ok) {
        const body = await getJson(videoRes);
        throw new Error(
          `Failed to get upload URL (video): ${videoRes.status} ${
            body?.error || JSON.stringify(body) || ""
          }`
        );
      }
      const videoData = await videoRes.json();
      if (!videoData?.uploadUrl || !videoData?.videoUrl) {
        console.error("videoData:", videoData);
        throw new Error("Backend did not return uploadUrl/videoUrl for video");
      }
      const putVideoRes = await fetch(videoData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": video.type,
        },
        body: video,
      });
      if (!putVideoRes.ok) {
        throw new Error(
          `Upload to S3 failed for video: ${putVideoRes.status} ${putVideoRes.statusText}`
        );
      }
      const finalVideoUrl = videoData.videoUrl;

      let finalThumbnailUrl = "";
      if (thumbnail) {
        const thumbFileName = encodeURIComponent(thumbnail.name);
        const thumbRes = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/upload/upload-url?fileName=${thumbFileName}&fileType=${encodeURIComponent(
            thumbnail.type
          )}`,
          { credentials: "include" }
        );
        if (!thumbRes.ok) {
          const b = await getJson(thumbRes);
          throw new Error(
            `Failed to get upload URL (thumbnail): ${thumbRes.status} ${
              b?.error || ""
            }`
          );
        }
        const thumbData = await thumbRes.json();
        if (!thumbData?.uploadUrl || !thumbData?.videoUrl) {
          console.error("thumbData:", thumbData);
          throw new Error(
            "Backend did not return uploadUrl/videoUrl for thumbnail"
          );
        }
        const putThumbRes = await fetch(thumbData.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": thumbnail.type },
          body: thumbnail,
        });
        if (!putThumbRes.ok) {
          throw new Error(
            `Upload to S3 failed for thumbnail: ${putThumbRes.status}`
          );
        }
        finalThumbnailUrl = thumbData.videoUrl;
      }

      const saveRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload/save`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            videoUrl: finalVideoUrl,
            tags: tags
              ? tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : [],
            thumbnailUrl: finalThumbnailUrl || undefined,
          }),
        }
      );

      if (!saveRes.ok) {
        const errBody = await getJson(saveRes);
        throw new Error(
          `Saving metadata failed: ${saveRes.status} ${
            errBody?.error || JSON.stringify(errBody)
          }`
        );
      }

      alert("Video uploaded and saved successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upload Video</h1>
          <Link
            to="/profile"
            className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition-colors"
          >
            <User size={20} className="text-white" />
          </Link>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="max-w-4xl">
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-2xl p-12 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors cursor-pointer">
                <UploadIcon size={48} className="text-blue-700 mb-4" />
                <p className="text-blue-700 font-medium mb-2">
                  Drop or Upload a video
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Supported formats: MP4, MOV, AVI
                  <br />
                  Maximum size: 500MB
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="Video Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Video Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200"
                />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files?.[0] || null)}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Publish"}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
