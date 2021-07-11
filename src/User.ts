import Card from "./Card";

export default class {
  name: string;
  cards: Card[];
  ready: boolean;
  place: number; // 0 for not finished, 1 for 1st place, etc
  taxCards: Card[];
  taxSubmitted: boolean;

  constructor(name: string) {
    this.name = name;
    this.cards = [];
    this.ready = false;
    this.place = 0;
    this.taxCards = [];
    this.taxSubmitted = false;
  }

  generateMove(currentCard: Card, currentCount: number): Card[] {
    if (this.cards.length === 0) {
      throw new Error("you don't have any cards");
    }

    // you are trick lead
    if (currentCard === Card.Blank) {
      // only card left is joker
      if (Math.min(...this.cards) === 99) {
        return [...this.cards];
      }

      let counts: Map<Card, number> = new Map();
      let uniqueCards = [...new Set(this.cards.filter(card => card < Card.Joker))];
      uniqueCards.forEach(uniqueCard => {
        counts.set(uniqueCard, this.cards.filter(card => card === uniqueCard).length);
      });

      let maxCount = Math.max(...[...counts].map(entry => entry[1]));
      let maxValue: Card = Math.max(...[...counts].filter(entry => entry[1] === maxCount).map(entry => entry[0]));

      let toReturn: Card[] = [];
      for (let i = 0; i < maxCount; i++) {
        toReturn.push(maxValue);
      }
      return toReturn;
    }

    let uniqueCards = [...new Set(this.cards.filter(card => card < Card.Joker))];

    // pass 1: look for exact number matches
    let highestCard = Card.Blank;
    uniqueCards.forEach(uniqueCard => {
      if (
        uniqueCard < currentCard &&
        this.cards.filter(card => card === uniqueCard).length == currentCount
      ) {
        highestCard = uniqueCard;
      }
    });
    if (highestCard !== Card.Blank) {
      let toReturn: Card[] = [];
      for (let i = 0; i < currentCount; i++) {
        toReturn.push(highestCard);
      }
      return toReturn;
    }

    // pass 2: look for general number matches
    uniqueCards.forEach(uniqueCard => {
      if (
        uniqueCard < currentCard &&
        this.cards.filter(card => card === uniqueCard).length >= currentCount
      ) {
        highestCard = uniqueCard;
      }
    });
    if (highestCard !== Card.Blank) {
      let toReturn: Card[] = [];
      for (let i = 0; i < currentCount; i++) {
        toReturn.push(highestCard);
      }
      return toReturn;
    }

    // pass 3: include jokers
    let numJokers = 0;
    uniqueCards.forEach(uniqueCard => {
      if (
        uniqueCard < currentCard &&
        this.cards.filter(card => card === uniqueCard || card === Card.Joker).length >= currentCount
      ) {
        highestCard = uniqueCard;
        numJokers = currentCount - this.cards.filter(card => card === uniqueCard).length;
      }
    });
    if (highestCard !== Card.Blank) {
      let toReturn: Card[] = [];
      for (let i = 0; i < currentCount - numJokers; i++) {
        toReturn.push(highestCard);
      }
      for (let i = 0; i < numJokers; i++) {
        toReturn.push(Card.Joker);
      }
      return toReturn;
    }

    return [];
  }

  hasCards(cards: Card[]): boolean {
    let cardsCopy = [...this.cards];
    let toReturn = true;
    cards.forEach(selectedCard => {
      let selectedCardIndex = cardsCopy.indexOf(selectedCard);
      if (selectedCardIndex === -1) {
        toReturn = false;
      }
      cardsCopy.splice(selectedCardIndex, 1);
    });
    return toReturn;
  }
}