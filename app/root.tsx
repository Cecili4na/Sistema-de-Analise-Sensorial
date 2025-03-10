// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
 } from "@remix-run/react";
 import type { LinksFunction } from "@remix-run/node";
 
 import "./tailwind.css";
 
 export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
 ];
 
 export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Plataforma de Análise Sensorial de Laticínios Caprinos</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50 font-inter">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
 }
 
 export default function App() {
  return <Outlet />;
 }