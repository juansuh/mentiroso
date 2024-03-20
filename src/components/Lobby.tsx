import { AiOutlineArrowLeft } from "react-icons/ai";
import { socket } from "../utils/socket";
import {
  GiInvertedDice1,
  GiInvertedDice2,
  GiInvertedDice3,
  GiInvertedDice4,
  GiInvertedDice5,
  GiInvertedDice6,
} from "react-icons/gi";
import { useMemo } from "react";

interface PropTypes {
  room: string;
  name: string;
  players: string[];
}

const diceMaps = [
  <GiInvertedDice1 />,
  <GiInvertedDice2 />,
  <GiInvertedDice3 className="dice-3" />,
  <GiInvertedDice4 />,
  <GiInvertedDice5 />,
  <GiInvertedDice6 />,
];

export default function Lobby({ name, room, players }: PropTypes) {
  function leaveRoom() {
    socket.emit("leave room", { name, room });
  }

  function startGame() {
    socket.emit("start game", { room });
  }

  const canStart = useMemo(
    () => players[0] === name && players.length > 1,
    [players, name]
  );

  return (
    <div className="lobby-page">
      <button className="mentiroso-button" onClick={leaveRoom}>
        <AiOutlineArrowLeft className="button-icon" size={40} />
        Leave
      </button>
      <div className="lobby-main-content">
        <p className="header-2">
          Room Code: <span style={{ fontWeight: 500 }}>{room}</span>
        </p>
        <div className="lobby-players">
          {players.map((player, i) => (
            <div className="lobby-player">
              {diceMaps[i]}
              <span style={{ marginTop: "-3px" }}>{player}</span>
            </div>
          ))}
        </div>
        <button
          disabled={canStart}
          className="mentiroso-button"
          onClick={startGame}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
