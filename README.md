# AgencyOS

An all-in-one Agency Management System aimed to streamline operations, project management, and client relationships.

## Features

- **Dashboard**: High-level overview of agency performance.
- **CRM**: Manage leads, clients, and pipelines.
- **Project Management**: Kanban-style task boards and project tracking.
- **Billing**: Invoicing and financial management.
- **Reports**: Data visualization and analytics.
- **Admin**: User management and system settings.
- **Authentication**: Secure login and access control powered by Supabase.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI / Shadcn-like components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/agency-os.git
   cd agency-os
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment Setup:
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: Application routes and pages.
- `/src/components`: Reusable UI components.
- `/src/lib`: Utilities and Supabase client configuration.
- `/public`: Static assets.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs the linter.

## License

[MIT](LICENSE)
