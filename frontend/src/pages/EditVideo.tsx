import { useState } from "react";
import { Upload as UploadIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function EditVideo() {
  const [title, setTitle] = useState("Amazing Tech Talk");
  const [description, setDescription] = useState(
    "A comprehensive guide to modern web development"
  );
  const [tags, setTags] = useState("tech,tutorial,webdev");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Videos</h1>
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
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Video Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Enter video description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., education, tech, tutorial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Upload Thumbnail
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setThumbnail(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {thumbnail ? (
                        <p className="text-sm text-gray-600">
                          {thumbnail.name}
                        </p>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-gray-200 rounded-lg mb-3"></div>
                          <p className="text-sm text-gray-500">
                            Click to change thumbnail
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                >
                  Save changes
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
