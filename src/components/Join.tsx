import { ChangeEvent, useState } from "react";
import { socket } from "../utils/socket";
import { sanitizeInput } from "../utils/utils";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

interface PropTypes {
  setPage: (page: "home" | "multi") => void;
}

export default function Join(props: PropTypes) {
  const [room, setRoom] = useState<string>("");
  const [name, setName] = useState<string>("");

  function joinRoom() {
    socket.emit("join room", { name, room });
  }

  function createRoom() {
    socket.emit("create room", { name });
  }

  function handleRoomInput(e: ChangeEvent<HTMLInputElement>): void {
    const input = sanitizeInput(e.target.value, 4);
    setRoom(input);
  }

  function handleNameInput(e: ChangeEvent<HTMLInputElement>): void {
    const input = sanitizeInput(e.target.value, 12);
    setName(input);
  }

  return (
    <div className="join-room-page">
      <button
        className="mentiroso-button"
        onClick={() => props.setPage("home")}
      >
        <AiOutlineArrowLeft className="button-icon" size={40} /> Back
      </button>

      <div className="join-buttons">
        <label className="header-2" htmlFor="name">
          Name:
        </label>
        <input
          id="name"
          className="mentiroso-input"
          value={name}
          onChange={handleNameInput}
        />
        <button
          className="mentiroso-button"
          style={{
            width: "100%",
            margin: "20px 0",
          }}
          disabled={!name}
          onClick={createRoom}
        >
          Create Room
        </button>
        <div style={{ width: "100%" }}>
          <label className="header-2" htmlFor="room">
            Join Room:
          </label>
          <div className="join-room-button">
            <input
              className="mentiroso-input"
              id="room"
              value={room}
              onChange={handleRoomInput}
            />
            <button
              className="mentiroso-button"
              style={{ minWidth: "75px" }}
              disabled={room.length < 4 || !name}
              onClick={joinRoom}
              aria-label="join room"
            >
              <AiOutlineArrowRight size={40} className="button-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
