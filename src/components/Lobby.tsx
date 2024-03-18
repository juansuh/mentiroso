import { socket } from "../utils/socket";

interface PropTypes {
  room: string;
  name: string;
  players: string[];
  leave: () => void;
}

export default function Lobby(props: PropTypes) {
  function leaveRoom() {
    console.log("woops");
    socket.emit("leave room");
    props.leave();
  }

  function startGame() {
    console.log("trying to emit");
    socket.emit("start game", props.room);
  }
  return (
    <div>
      <p>Room Code: {props.room}</p>
      <ul>
        {props.players.map((player) => (
          <li>{player}</li>
        ))}
      </ul>
      <div>
        <button onClick={leaveRoom}>Leave Room</button>
        <button onClick={startGame}>Start Game</button>
      </div>
    </div>
  );
}
