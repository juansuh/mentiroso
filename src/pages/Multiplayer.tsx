import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import Lobby from "../components/Lobby";
import { Bet, Player, RoomState, RoundEndInfo } from "../models";
import Join from "../components/Join";
import Game from "../components/Game";
import * as Toast from "@radix-ui/react-toast";

interface PropTypes {
  setPage: (page: "home" | "multi") => void;
}

export default function Multiplayer(props: PropTypes) {
  const [room, setRoom] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [dice, setDice] = useState<number[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState<string>("");
  const [roomState, setRoomState] = useState<RoomState>("join");
  const [roundEndInfo, setRoundEndInfo] = useState<RoundEndInfo | undefined>();
  const [errorToastOpen, setErrorToastOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  //Connect socket, register socket event listeners
  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    function updateRoom(serverRoom: string) {
      console.log("updating room: ", serverRoom);
      setRoom(serverRoom);
    }

    function updateName(serverName: string) {
      setName(serverName);
    }

    function updateDice(serverDice: number[]) {
      setDice(serverDice);
    }

    function updateBets(serverBets: Bet[]) {
      setBets(serverBets);
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

    function updateRoundEndInfo(roundEndInfo: RoundEndInfo | undefined) {
      setRoundEndInfo(roundEndInfo);
    }

    function handleErrorMessage(serverError: string) {
      setError(serverError);
      setErrorToastOpen(true);
    }

    socket.on("update room", updateRoom);
    socket.on("update name", updateName);
    socket.on("update dice", updateDice);
    socket.on("update bets", updateBets);
    socket.on("update players", updatePlayers);
    socket.on("update active player", updateActivePlayer);
    socket.on("update room state", updateRoomState);
    socket.on("update winner", updateRoundEndInfo);
    socket.on("error message", handleErrorMessage);

    return () => {
      socket.off("update room", updateRoom);
      socket.off("update name", updateName);
      socket.off("update dice", updateDice);
      socket.off("update bets", updateBets);
      socket.off("update players", updatePlayers);
      socket.off("update active player", updateActivePlayer);
      socket.off("update room state", updateRoomState);
      socket.off("error message", handleErrorMessage);

      socket.disconnect();
    };
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      {(() => {
        if (roomState === "join") {
          return <Join setPage={props.setPage} />;
        } else if (roomState === "lobby") {
          return (
            <Lobby
              room={room}
              name={name}
              players={players.map((player) => player.name)}
            />
          );
        } else {
          return (
            <Game
              name={name}
              room={room}
              dice={dice}
              bets={bets}
              players={players}
              activePlayer={activePlayer}
              roundEndInfo={roundEndInfo}
            />
          );
        }
      })()}
      <Toast.Root open={errorToastOpen} onOpenChange={setErrorToastOpen}>
        <Toast.Title>{error}</Toast.Title>
        <Toast.Close />
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}
