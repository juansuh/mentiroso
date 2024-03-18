import { ChangeEvent, useState } from "react";
import { socket } from "../utils/socket";
import { sanitizeInput } from "../utils/utils";

export default function Join() {
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
    <div>
      <div>
        <p>Name: </p>
        <input value={name} onChange={handleNameInput} />
      </div>
      <div>
        <p>Join a room: </p>
        <div>
          <input value={room} onChange={handleRoomInput} />
          <button disabled={room.length < 4 || !name} onClick={joinRoom}>
            Enter
          </button>
        </div>
      </div>
      <p>or</p>
      <button disabled={!name} onClick={createRoom}>
        Create a room
      </button>
    </div>
  );
}
