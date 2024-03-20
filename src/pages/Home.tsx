interface Proptypes {
  setPage: (page: "home" | "multi") => void;
}

export default function Home(props: Proptypes) {
  return (
    <div className="home-page">
      <header>Liar's Dice</header>
      <div className="home-buttons">
        <button
          className="mentiroso-button"
          onClick={() => props.setPage("multi")}
          style={{ width: "12rem" }}
        >
          Play
        </button>
        <button className="mentiroso-button" style={{ width: "12rem" }}>
          Rules
        </button>
      </div>
    </div>
  );
}
