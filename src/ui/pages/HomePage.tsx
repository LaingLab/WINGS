import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12">
      <h1 className="text-6xl font-medium tracking-tight">GLIDE_Test</h1>
      <div className="flex gap-3">
        <Link
          to="/some-other-path"
          className="rounded-full border border-white/20 bg-white/20 p-8 py-3 text-xl text-white/90 duration-150 hover:bg-white hover:text-black hover:shadow-xl"
        >
          Default
        </Link>
        <Link
          to="/recording"
          className="rounded-full border border-white/20 bg-red-500/20 p-8 py-3 text-xl text-white/90 duration-150 hover:bg-red-500 hover:text-white hover:shadow-xl"
        >
          Recording
        </Link>
      </div>
    </div>
  );
}
