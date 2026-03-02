"use client";

import Link from "next/link";

export default function NotFound() {
  // Intentionally no `from` query handling here; simplified not-found page.

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-8xl font-light text-[#1f1f54] mb-4 tracking-tighter">404</h1>
        <h2 className="text-xl font-normal text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The requested URL <br/>
         does not exist.
        </p>
        <div className="text-sm">
          <Link
            href="/"
            className="text-[#1f1f54] hover:text-[#1f1f54] transition-colors border-b border-transparent hover:border-[#1f1f54]"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
