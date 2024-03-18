interface Proptypes {
  setPage: (page: "home" | "multi") => void;
}

export default function Home(props: Proptypes) {
  return (
    <div>
      <title>Liars Dice</title>
      <div>
        <button onClick={() => props.setPage("multi")}>Play</button>
        <button>Rules</button>
      </div>
    </div>
  );
}
