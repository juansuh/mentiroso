import {
  GiInvertedDice1,
  GiInvertedDice2,
  GiInvertedDice3,
  GiInvertedDice4,
  GiInvertedDice5,
  GiInvertedDice6,
} from "react-icons/gi";

export function sanitizeInput(input: string, charLimit: number) {
  //Remove non-alphabeticals, capitalize everything, limit characters
  return input
    .replace(/[^A-Za-z]+/g, "")
    .toUpperCase()
    .slice(0, charLimit);
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function diceValueToIcon(val: number) {
  const diceMaps = [
    0,
    <GiInvertedDice1 />,
    <GiInvertedDice2 />,
    <GiInvertedDice3 className="dice-3" />,
    <GiInvertedDice4 />,
    <GiInvertedDice5 />,
    <GiInvertedDice6 />,
  ];
  return diceMaps[val] ?? 0;
}
