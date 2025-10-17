import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-tradey-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* TRADEY Logo/Text */}
        <h1 className="font-fayte text-8xl md:text-9xl text-tradey-white mb-8 tracking-tight uppercase">
          TRADEY
        </h1>

        {/* 404 Message */}
        <h2 className="font-fayte text-4xl md:text-5xl text-tradey-red mb-6 uppercase">
          404
        </h2>

        <p className="font-garamond text-xl text-tradey-white/80 mb-12">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-block px-8 py-4 border-2 border-tradey-white text-tradey-white font-sans font-semibold uppercase tracking-wide hover:bg-tradey-white hover:text-tradey-black transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
