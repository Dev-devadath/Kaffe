import type { Route } from "./+types/app.dashboard";
import { Dashboard } from "../pages/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Kaffe" },
    {
      name: "description",
      content: "Review and customize your marketing content for each platform.",
    },
  ];
}

export default function DashboardRoute() {
  return <Dashboard />;
}

