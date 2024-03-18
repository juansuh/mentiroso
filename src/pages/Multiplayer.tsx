import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import Lobby from "../components/Lobby";
import { Player, RoomState } from "../models";
import Join from "../components/Join";
import Game from "../components/Game";

export default function Multiplayer() {
  const [room, setRoom] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [dice, setDice] = useState<number[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState<string>("");
  const [roomState, setRoomState] = useState<RoomState>("join");

  //Connect socket, register socket event listeners
  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    function updateRoom(serverRoom: string) {
      setRoom(serverRoom);
    }

    function updateName(serverName: string) {
      setName(serverName);
    }

    function updateDice(serverDice: number[]) {
      setDice(serverDice);
    }

    function updatePlayers(serverPlayers: Player[]) {
      setPlayers(serverPlayers);
    }

    function updateActivePlayer(serverActivePlayer: string) {
      setActivePlayer(serverActivePlayer);
    }

    function updateRoomState(serverRoomState: RoomState) {
      setRoomState(serverRoomState);
    }

    socket.on("update room", updateRoom);
    socket.on("update name", updateName);
    socket.on("update dice", updateDice);
    socket.on("update players", updatePlayers);
    socket.on("update active player", updateActivePlayer);
    socket.on("update room state", updateRoomState);

    return () => {
      socket.off("update room", updateRoom);
      socket.off("update name", updateName);
      socket.off("update dice", updateDice);
      socket.off("update players", updatePlayers);
      socket.off("update active player", updateActivePlayer);
      socket.off("update room state", updateRoomState);

      socket.disconnect();
    };
  }, []);

  if (roomState === "join") {
    return <Join />;
  } else if (roomState === "lobby") {
    return (
      <Lobby
        room={room}
        name={name}
        players={players.map((player) => player.name)}
        leave={() => setRoomState("join")}
      />
    );
  } else {
    return (
      <Game
        dice={dice}
        name={name}
        players={players}
        activePlayer={activePlayer}
      />
    );
  }
}
