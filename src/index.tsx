import { hydrate, LocationProvider, prerender as ssr } from "preact-iso";
import { Home } from "./Home";

export function App() {
  return (
    <LocationProvider scope="/home">
      <Home />
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
