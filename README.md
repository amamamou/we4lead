We4Lead Frontend
=================

Next.js + TypeScript frontend for secure incident reporting and administrative management.

This frontend provides the user-facing UI and admin panel for the We4Lead system. It integrates with Supabase for authentication and with the We4Lead backend REST API for data and management.

We4Lead enables to:

- Browse institutions and staff
- Submit and track incident reports (harassment, discrimination, violence, misconduct)
- Sign in using Supabase Auth (JWT)
- Admin dashboard for managing users, institutions and reports

Features
--------

- Responsive Next.js app with App Router
- Supabase Auth integration (client-side) for secure JWT auth
- Role-based UI flows (students, teachers, staff, admins)
- Connects to the We4Lead backend via environment-configured API URL
- Tailwind CSS + shadcn/ui primitives for UI components

Tech Stack
----------

Layer    | Technology
-------- | -------------------------
Language | TypeScript
Framework| Next.js (App Router)
UI       | React, Tailwind CSS, shadcn/ui
Auth     | Supabase Auth (client)
API      | REST calls to We4Lead Backend

Prerequisites
-------------

- Node 18+ (recommended)
- npm
- A Supabase project (for Auth) or access to your Supabase instance

Environment
-----------

Create a `.env.local` in the project root and provide the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_BACKEND_URL=https://your-backend.example.com   # defaults to http://localhost:8080 in code
```

Notes:
- `NEXT_PUBLIC_SUPABASE_*` are used by the Supabase client in `lib/supabaseClient.ts`.
- `NEXT_PUBLIC_BACKEND_URL` is used across services (e.g., `services/*`, `hooks/*`) to call the backend API. If not set, parts of the app fall back to `http://localhost:8080`.

Quick Start
-----------

1. Clone the repository

```bash
git clone https://github.com/amamamou/we4lead.git
cd we4lead
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local` (see Environment above)

4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Build & Production
------------------

Build the app:

```bash
npm run build
```

Run the built app:

```bash
npm start
```

Project Scripts
---------------

- `npm run dev` — start development server
- `npm run build` — production build
- `npm start` — start production server
- `npm run lint` — run ESLint

Deployment
----------

The app deploys well on Vercel (recommended) or any platform that supports Next.js. Remember to set the same environment variables in your deployment environment.

Contributing
------------

Contributions are welcome. Please open issues or pull requests for bugs and improvements.

License
-------

This project is provided under the same license as the repository. See the `LICENSE` file for details.

Credits
-------

Frontend built with Next.js, Supabase and Tailwind CSS. Backend powered by the We4Lead Spring Boot REST API.

Enjoy ❤️
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
