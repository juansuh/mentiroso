import { useEffect, useMemo, useState } from "react";
import { Bet, Player, RoundEndInfo } from "../models";
import { socket } from "../utils/socket";
import { GiPerspectiveDiceSixFacesTwo } from "react-icons/gi";
import { GiPerspectiveDiceSixFacesOne } from "react-icons/gi";
import { GiPerspectiveDiceSixFacesThree } from "react-icons/gi";
import { GiPerspectiveDiceSixFacesFour } from "react-icons/gi";
import { GiPerspectiveDiceSixFacesFive } from "react-icons/gi";
import { GiPerspectiveDiceSixFacesSix } from "react-icons/gi";
import { diceValueToIcon, shuffle } from "../utils/utils";

interface PropTypes {
  name: string;
  room: string;
  dice: number[];
  bets: Bet[];
  players: Player[];
  activePlayer: string;
  roundEndInfo?: RoundEndInfo;
}

const remainingLives = [
  (active: boolean) => (
    <GiPerspectiveDiceSixFacesOne
      size={20}
      className={active ? "life-bob" : ""}
    />
  ),
  (active: boolean) => (
    <GiPerspectiveDiceSixFacesTwo
      size={20}
      className={active ? "life-bob" : ""}
    />
  ),
  (active: boolean) => (
    <GiPerspectiveDiceSixFacesThree
      size={20}
      className={active ? "life-bob" : ""}
    />
  ),
  (active: boolean) => (
    <GiPerspectiveDiceSixFacesFour
      size={20}
      className={active ? "life-bob" : ""}
    />
  ),
  (active: boolean) => (
    <GiPerspectiveDiceSixFacesFive
      size={20}
      className={active ? "life-bob" : ""}
    />
  ),
  (active: boolean) => (
    <GiPerspectiveDiceSixFacesSix
      size={20}
      className={active ? "life-bob" : ""}
    />
  ),
];

export default function Game(props: PropTypes) {
  const [yourBetCount, setYourBetCount] = useState<number>(1);
  const [yourBetValue, setYourBetValue] = useState<number>(1);

  const lastBet: Bet = useMemo(
    () =>
      props.bets.length
        ? props.bets[props.bets.length - 1]
        : { count: 1, value: 2, player: "" },
    [props.bets]
  );

  useEffect(() => {
    setYourBetCount(lastBet.count);
    setYourBetValue(lastBet.value);
  }, [lastBet]);

  const canIncrementCount: boolean = useMemo(() => {
    //count cannot go above total dice
    if (
      yourBetCount >=
      props.players
        .map((player) => player.remainingDice)
        .reduce((prev, curr) => prev + curr, 0)
    )
      return false;
    return true;
  }, [props.players, yourBetCount]);

  const canDecrementCount: boolean = useMemo(() => {
    //count cannot be 0 or negative
    if (yourBetCount <= 1) return false;
    //count cannot be less than last bet
    if (yourBetCount <= lastBet.count) return false;
    //count cannot be equal to last bet if dice value has not been raised
    if (yourBetCount - 1 === lastBet.count && yourBetValue <= lastBet.value)
      return false;
    return true;
  }, [lastBet, yourBetCount, yourBetValue]);

  const canIncrementValue: boolean = useMemo(() => {
    //value cannot go above 6
    if (yourBetValue === 6) return false;
    return true;
  }, [yourBetValue]);

  const canDecrementValue: boolean = useMemo(() => {
    //value cannot be less than 2
    if (yourBetValue <= 2) return false;
    //if the count has not been raised, your value cannot be equal or less
    if (yourBetCount === lastBet.count && yourBetValue - 1 <= lastBet.value)
      return false;
    return true;
  }, [yourBetValue, yourBetCount, lastBet]);

  const canBet: boolean = useMemo(() => {
    if (yourBetCount === lastBet.count && yourBetValue === lastBet.value)
      return false;
    return true;
  }, [yourBetCount, yourBetValue, lastBet]);

  function handleBetCountIncrement() {
    if (canIncrementCount) setYourBetCount(yourBetCount + 1);
  }

  function handleBetCountDecrement() {
    if (canDecrementCount) setYourBetCount(yourBetCount - 1);
  }

  function handleBetValueIncrement() {
    if (canIncrementValue) setYourBetValue(yourBetValue + 1);
  }

  function handleBetValueDecrement() {
    if (canDecrementValue) setYourBetValue(yourBetValue - 1);
  }

  function bet() {
    if (canBet) {
      socket.emit("raise bet", {
        bet: { count: yourBetCount, value: yourBetValue, player: props.name },
        room: props.room,
      });
    }
  }

  function showDice() {
    if (props.bets.length !== 0) {
      socket.emit("show dice", {
        room: props.room,
        name: props.name,
      });
    }
  }

  function readyRound() {
    socket.emit("ready round", { room: props.room, name: props.name });
  }

  const isYourTurn: boolean = useMemo(
    () => props.activePlayer === props.name,
    [props.activePlayer, props.name]
  );

  return (
    <div className="game-page">
      {/* <p>Room: {props.room}</p> */}
      <div className="game-players">
        {props.players.map((player) => (
          <div
            className={`game-player ${
              player.name === props.activePlayer ? "game-player-active" : ""
            }`}
          >
            <p
              className={`game-player-name ${
                player.name === props.activePlayer
                  ? "game-player-name-active"
                  : ""
              }`}
            >
              {player.name}
            </p>
            <div className="game-player-lives">
              {shuffle(remainingLives)
                .slice(0, player.remainingDice)
                .map((diceIcon) =>
                  diceIcon(player.name === props.activePlayer)
                )}
            </div>
          </div>
        ))}
      </div>
      <p className="header-2">
        {lastBet.player} Bet: {lastBet.count} {diceValueToIcon(lastBet.value)}
      </p>
      <div>
        <p>Your Dice</p>
        <ul>
          {props.dice.map((die) => (
            <li>{die}</li>
          ))}
        </ul>
      </div>
      {isYourTurn && (
        <div>
          <div>
            <button
              onClick={handleBetCountIncrement}
              disabled={!canIncrementCount}
            >
              +
            </button>
            <button
              onClick={handleBetCountDecrement}
              disabled={!canDecrementCount}
            >
              -
            </button>
            <p>Count: {yourBetCount}</p>
            <button
              onClick={handleBetValueIncrement}
              disabled={!canIncrementValue}
            >
              +
            </button>
            <button
              onClick={handleBetValueDecrement}
              disabled={!canDecrementValue}
            >
              -
            </button>
            <p>Value: {yourBetValue}</p>
            <button
              className="mentiroso-button"
              onClick={bet}
              disabled={!canBet}
            >
              Bet
            </button>
          </div>
          <button className="mentiroso-button" onClick={showDice}>
            Show Your Dice
          </button>
        </div>
      )}
      {props.roundEndInfo && (
        <div>
          <p>Winner: {props.roundEndInfo.winner}</p>
          <div>
            <ul>
              {props.roundEndInfo.playersRevealed.map((player) => (
                <li>{`${player.name}: ${player.dice.toString()}`}</li>
              ))}
            </ul>
          </div>
          <button onClick={readyRound}>Next Round</button>
        </div>
      )}
    </div>
  );
}
