import type { Route } from "./+types/app.processing";
import { Processing } from "../pages/processing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Processing - Kaffe" },
    { name: "description", content: "Processing your image and generating marketing content..." },
  ];
}

export default function ProcessingRoute() {
  return <Processing />;
}

