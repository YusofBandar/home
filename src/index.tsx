import { hydrate, prerender as ssr } from "preact-iso";
import { Home } from "./Home";

export function App() {
  return <Home />;
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
