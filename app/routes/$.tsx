import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  throw new Response("Página não encontrada", { status: 404 });
};

export default function CatchAllRoute() {
  return null;
}