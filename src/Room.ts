import User from "./User";
import Card from "./Card";

enum State {
  Lobby,
  Revolution,
  Tax,
  Play
}

const CARD_ORDER = (a: number, b: number) => a - b;

export default class {
  name: string;
  users: User[];
  state: State;
  currentTurn: string;
  trickLead: string;
  currentCard: Card;
  currentCount: number;

  constructor(name: string) {
    this.name = name;
    this.users = [];
    this.state = State.Lobby;
    this.currentTurn = "";
    this.trickLead = "";
    this.currentCard = Card.Blank;
    this.currentCount = 0;
  }

  addUser(name: string) {
    if (this.users.map(user => user.name).includes(name)) {
      throw new Error("duplicate name");
    }
    if (name === "") {
      throw new Error("blank name");
    }
    this.users.push(new User(name));
    // console.log("new user added: " + name);
  }

  printUsers() {
    console.log(this.users);
  }

  changeReadyStatus(name: string, newStatus: boolean) {
    if (this.state !== State.Lobby) {
      throw new Error("need to be in lobby state to change ready status");
    }

    let user = this.getUserByName(name);
    user.ready = newStatus;

    // console.log("ready status change: " + name + " to " + newStatus);

    if (this.users.filter(user => !user.ready).length === 0 && this.users.length >= 4) {
      // console.log("everyone is ready");
      this.startGame();
    }
  }

  startGame(shuffleUsers = true) {
    if (this.state !== State.Lobby) {
      throw new Error("need to be in lobby state to start the game");
    }

    // shuffle users if someone doesnt have a place
    if (this.users.filter((user) => user.place === 0).length > 0 && shuffleUsers) {
      shuffle(this.users);
    } else {
      this.users.sort((a, b) => a.place - b.place);
    }

    // generate deck
    let maxCard = Card.Ten;
    if (this.users.length === 5) maxCard = Card.Eleven;
    else if (this.users.length >= 6) maxCard = Card.Twelve;
    let deck = generateDeck(maxCard);

    // distribute deck
    let perPerson = Math.floor(deck.length / this.users.length);
    let remainder = deck.length % this.users.length;

    for (let i = 0; i < this.users.length; i++) {
      let user: User = this.users[i];
      user.cards = deck.splice(0, perPerson);
      if (i < remainder) {
        user.cards.push(deck.splice(0, 1)[0]);
      }
      user.cards.sort(CARD_ORDER);
    }

    this.state = State.Revolution;
  }

  callRevolution(name: string) {
    let user = this.getUserByName(name);
    if (!user.hasCards([Card.Joker, Card.Joker])) {
      throw new Error("you don't have two jokers! silly");
    }
    if (this.users.indexOf(user) === this.users.length - 1) {
      this.users.forEach((user, index) => {
        if (index === 0) {
          // great dalmuti
          user.taxCards = [user.cards[0], user.cards[1]];
          user.taxSubmitted = true;
        } else if (index === 1) {
          // lesser dalmuti
          user.taxCards = [user.cards[0]];
          user.taxSubmitted = true;
        } else if (index === this.users.length - 2) {
          // lesser peon
          user.taxCards = [];
          user.taxSubmitted = false;
        } else if (index === this.users.length - 1) {
          // greater peon
          user.taxCards = [];
          user.taxSubmitted = false;
        } else {
          // merchant
          user.taxCards = [];
          user.taxSubmitted = true;
        }
      })
      this.state = State.Tax;
    } else {
      this.startPlay();
    }
  }

  noRevolution() {
    this.users.forEach((user, index) => {
      if (index === 0) {
        // great dalmuti
        user.taxCards = [];
        user.taxSubmitted = false;
      } else if (index === 1) {
        // lesser dalmuti
        user.taxCards = [];
        user.taxSubmitted = false;
      } else if (index === this.users.length - 2) {
        // lesser peon
        user.taxCards = [user.cards[0]];
        user.taxSubmitted = true;
      } else if (index === this.users.length - 1) {
        // greater peon
        user.taxCards = [user.cards[0], user.cards[1]];
        user.taxSubmitted = true;
      } else {
        // merchant
        user.taxCards = [];
        user.taxSubmitted = true;
      }
    })

    this.state = State.Tax;
  }

  payTax(name: string, cards: number[]) {
    let user = this.getUserByName(name);
    if (user.taxSubmitted) {
      throw new Error("tax already submitted!");
    }
    if ((this.users.indexOf(user) === 0 || this.users.indexOf(user) === this.users.length - 1) && cards.length !== 2) {
      throw new Error("great dalmuti/peon pays two cards");
    }
    if ((this.users.indexOf(user) === 1 || this.users.indexOf(user) === this.users.length - 2) && cards.length !== 1) {
      throw new Error("lesser dalmuti/peon pays one card");
    }
    if (!user.hasCards(cards)) {
      throw new Error("you don't have those cards");
    }

    user.taxCards = cards;
    user.taxSubmitted = true;
    if (this.users.filter(user => !user.taxSubmitted).length === 0) {
      // console.log("play is starting")
      // remove everyone's tax cards
      this.users.forEach(user => {
        user.taxCards.forEach(card => user.cards.splice(user.cards.indexOf(card), 1))
      })
      // great trade
      this.users[0].cards.push(...this.users[this.users.length - 1].taxCards);
      this.users[this.users.length - 1].cards.push(...this.users[0].taxCards);

      // lesser trade
      this.users[1].cards.push(...this.users[this.users.length - 2].taxCards);
      this.users[this.users.length - 2].cards.push(...this.users[1].taxCards);

      // sort their cards
      this.users.forEach(user => user.cards.sort(CARD_ORDER));

      this.startPlay();
    }
  }

  startPlay() {
    this.currentTurn = this.users[0].name;
    this.trickLead = this.users[0].name;
    this.state = State.Play;
  }

  play(name: string, cards: Card[]) {
    let user = this.getUserByName(name);

    cards.sort(CARD_ORDER); // mostly to ensure that jokers are at the end

    if (this.currentTurn !== name) {
      throw new Error("it's not your turn to play");
    }

    if (cards.length > 0) {
      // make sure chosen cards can be played
      if (this.currentCount !== 0 && this.currentCount !== cards.length) {
        throw new Error(`incorrect number of cards played (expected ${this.currentCount}, got ${cards.length})`);
      }

      let uniqueCards = [...new Set(cards)];
      if (uniqueCards.length > 2 || (uniqueCards.length == 2 && uniqueCards[1] !== Card.Joker)) {
        throw new Error("cards aren't all the same")
      }

      if (this.currentCount !== 0 && this.currentCard <= cards[0]) {
        throw new Error("cards aren't lower than current card")
      }

      if (!user.hasCards(cards)) {
        throw new Error("user doesn't have all the cards")
      }
    } else {
      if (this.currentTurn === this.trickLead) {
        throw new Error("can't pass when you are leading a trick")
      }
    }

    // COOL, it's valid

    // remove their cards
    cards.forEach(selectedCard => user.cards.splice(user.cards.indexOf(selectedCard), 1));

    // update the room
    if (cards.length > 0) {
      this.currentCard = cards[0];
      this.currentCount = cards.length;
      this.trickLead = name;

      // if out of cards, mark as won
      if (user.cards.length === 0) {
        user.place = Math.max(...this.users.map(user => user.place)) + 1;

        // if everyone won, end game
        if (Math.min(...this.users.map(user => user.place)) > 0) {
          // console.log("game is over!");
          this.state = State.Lobby;
          return;
        }
      }
    }

    // make it the next person's turn to play (TODO: make it skip players who won)
    let userIndex = this.users.map(user => user.name).indexOf(name);
    do {
      userIndex = userIndex === this.users.length - 1 ? 0 : userIndex + 1;
      this.currentTurn = this.users[userIndex].name;

      // if they're the trick leader, reset currentcard and currentcount
      if (this.currentTurn === this.trickLead) {
        this.currentCard = Card.Blank;
        this.currentCount = 0;
      }
    } while (this.users[userIndex].place !== 0);
  }

  getUserByName(name: string): User {
    let matchingUsers = this.users.filter(user => user.name === name);
    if (matchingUsers.length === 0) {
      throw new Error("yo this dude don't exist lol");
    }
    return matchingUsers[0];
  }
}

function generateDeck(maxCard: Card): Card[] {
  let deck: Card[] = [];
  let cardNumbers: Card[] = [
    Card.One,
    Card.Two,
    Card.Three,
    Card.Four,
    Card.Five,
    Card.Six,
    Card.Seven,
    Card.Eight,
    Card.Nine,
    Card.Ten,
    Card.Eleven,
    Card.Twelve
  ];
  cardNumbers = cardNumbers.filter(number => number <= maxCard);
  cardNumbers.forEach(card => {
    for (let i = 0; i < card; i++) {
      deck.push(card);
    }
  })
  deck.push(Card.Joker);
  deck.push(Card.Joker);
  shuffle(deck);
  return deck;
}

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
