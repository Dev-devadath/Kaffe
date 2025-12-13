import type { Route } from "./+types/app";
import { App } from "../pages/app";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kaffe App - Your AI Branding & Content Studio" },
    {
      name: "description",
      content:
        "Upload your artwork and transform it into a complete marketing toolkit.",
    },
  ];
}

export default function AppRoute() {
  return <App />;
}
