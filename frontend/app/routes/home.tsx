import type { Route } from "./+types/home";
import { Home } from "../pages/home";

export function meta({ }: Route.MetaArgs) {
  const title = "Kaffe: Your AI Branding & Content Studio";
  const description =
    "Transform any artwork or product image into a complete marketing toolkit in seconds. Stop spending hours on content creation—let AI handle your marketing while you focus on what you do best.";
  const image = "/coffee.png"; // Placeholder image

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export default function HomeRoute() {
  return <Home />;
}
