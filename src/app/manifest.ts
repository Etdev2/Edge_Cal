import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Edge Calculator",
    short_name: "Edge Cal",
    description: "Analysis-only NBA player-prop historical evidence comparator.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "en-US",
    categories: ["sports", "education"],
  };
}
