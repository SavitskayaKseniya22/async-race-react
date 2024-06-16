function getRandomNumber(max: number) {
  const rand = -0.5 + Math.random() * (max + 1);
  return Math.round(rand);
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  return ["#"]
    .concat(
      new Array(6).fill(1).map(() => {
        return letters[Math.floor(Math.random() * 16)];
      }),
    )
    .join("");
}

export type CarsNamesJSONType = { [x: string]: string[] };

export function getRandomName(carNames: CarsNamesJSONType | undefined) {
  if (carNames !== undefined) {
    const carTypeNum = getRandomNumber(Object.keys(carNames).length - 1);
    const carType = Object.keys(carNames)[carTypeNum];
    const carNameNum = getRandomNumber(Object.values(carNames)[carTypeNum].length - 1);
    const carModel = Object.values(carNames)[carTypeNum][carNameNum];
    return `${carType} ${carModel}`;
  }

  return `Car ${getRandomNumber(100000)}`;
}

export function generateId() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
}
