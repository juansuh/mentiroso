import { useState } from "react";
import Home from "./pages/Home";
import Multiplayer from "./pages/Multiplayer";

function App() {
  const [page, setPage] = useState<"home" | "multi">("home");

  return (
    <>
      <main>
        {page === "home" && <Home setPage={setPage} />}
        {page === "multi" && <Multiplayer />}
      </main>
    </>
  );
}

export default App;
