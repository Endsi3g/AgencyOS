import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Agency OS - All-in-One Agency Management",
    description: "The complete operating system for creative agencies. CRM, project management, billing, and client portal in one unified platform.",
    keywords: ["agency management", "CRM", "project management", "billing", "client portal"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="light">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
                {children}
            </body>
        </html>
    );
}
