import { Link } from "react-router-dom";
import { Play, CheckCircle, TrendingUp } from "lucide-react";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-black">
            FlashTalks
          </Link>
          <nav className="flex items-center gap-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-black transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <section
        id="home"
        className="relative pt-40 pb-28 lg:pb-40 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f1ff] via-[#c1d6ff] to-[#9cb8ff]" />

        <div className="container relative z-10 mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h1 className="text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight tracking-tight">
              Spark a <br /> Discovery
            </h1>
            <p className="text-lg text-gray-800 mb-10 leading-relaxed max-w-lg">
              FlashTalks is a micro-talk video hub where creators share powerful
              10–15 minute sessions. Learn fast, share your voice, and connect
              with a world of curious minds.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="text-black hover:underline flex items-center gap-2 font-medium"
              >
                Login →
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end items-center">
            <div className="absolute w-[700px] h-[700px] bg-blue-400/30 blur-[150px] rounded-full -z-10"></div>

            <img
              src="/assets/hero-play.png"
              alt="FlashTalks hero"
              className="w-[420px] lg:w-[600px] xl:w-[750px] drop-shadow-[0_25px_50px_rgba(50,100,255,0.45)] animate-float"
            />
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-black mb-6">
            Everything you need
          </h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-16 leading-relaxed">
            Discover talks, learn faster, and connect with innovators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-blue-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play size={28} className="text-white fill-white" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Explore talks from across domains—technology, design, and more.
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={28} className="text-white" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Share your own ideas in bite-sized, impactful sessions.
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={28} className="text-white" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Learn from the community and see what’s trending.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">Contact us</h2>
          <p className="max-w-2xl mx-auto mb-10 leading-relaxed">
            Have ideas or feedback? We’d love to hear from you.
          </p>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Contact us
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
