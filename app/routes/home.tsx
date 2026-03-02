import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "StockAR" },
    { name: "description", content: "Welcome to StockAR!" },
  ];
}

export default function Home() {
  return (
    <h1>Home</h1>
  );
}
