import { useState } from "react";
import Home from "./pages/Home";
import Multiplayer from "./pages/Multiplayer";
import "./styles/styles.css";

function App() {
  const [page, setPage] = useState<"home" | "multi">("home");

  return (
    <main className="main">
      {page === "home" && <Home setPage={setPage} />}
      {page === "multi" && <Multiplayer setPage={setPage} />}
    </main>
  );
}

export default App;
