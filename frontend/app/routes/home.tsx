import type { Route } from "./+types/home";
import { Home } from "../pages/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kaffe: Your AI Branding & Content Studio" },
    {
      name: "description",
      content:
        "Transform any artwork or product image into a complete marketing toolkit in seconds. Stop spending hours on content creation—let AI handle your marketing while you focus on what you do best.",
    },
  ];
}

export default function HomeRoute() {
  return <Home />;
}
