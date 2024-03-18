import { Player } from "../models";

interface PropTypes {
  name: string;
  dice: number[];
  players: Player[];
  activePlayer: string;
}

export default function Game(props: PropTypes) {
  return <div>{props.activePlayer}</div>;
}
