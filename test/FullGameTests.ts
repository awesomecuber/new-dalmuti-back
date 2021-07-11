import User from "../src/User";
import Room from "../src/Room";
import { expect } from "chai";
import Card from "../src/Card";

describe("play full games", () => {
  function startGameDebug(): Room {
    let room = new Room("test");
    room.users = [
      new User("Nico"),
      new User("very cute girl"),
      new User("person 3"),
      new User("person 4"),
    ];
    room.users[0].cards = [2, 2, 3, 4, 6, 7, 7, 7];
    room.users[1].cards = [3, 4, 5, 5, 6, 6, 6, 7];
    room.users[2].cards = [1, 5, 5, 5, 6, 6, 99];
    room.users[3].cards = [3, 4, 4, 7, 7, 7, 99];

    room.currentTurn = "Nico";
    room.trickLead = "Nico";
    room.state = 3; // play

    return room;
  }

  it("should work", () => {
    let myRoom = startGameDebug();
    myRoom.play("Nico", [Card.Seven, Card.Seven, Card.Seven]);
    // Nico = [2, 2, 3, 4, 6]

    myRoom.play("very cute girl", [Card.Six, Card.Six, Card.Six]);
    // very cute girl = [3, 4, 5, 5, 7]

    myRoom.play("person 3", []);
    // person 3 = [1, 5, 5, 5, 6, 6, 99]

    myRoom.play("person 4", []);
    // person 4 = [3, 4, 4, 7, 7, 7, 99]

    myRoom.play("Nico", []);
    // Nico = [2, 2, 3, 4, 6]

    myRoom.play("very cute girl", [Card.Five, Card.Five]);
    // very cute girl = [3, 4, 7]

    myRoom.play("person 3", []);
    // person 3 = [1, 5, 5, 5, 6, 6, 99]

    myRoom.play("person 4", [Card.Four, Card.Four]);
    // person 4 = [3, 7, 7, 7, 99]

    myRoom.play("Nico", [Card.Two, Card.Two]);
    // Nico = [3, 4, 6]

    myRoom.play("very cute girl", []);
    // very cute girl = [3, 4, 7]

    myRoom.play("person 3", [Card.One, Card.Joker]);
    // person 3 = [5, 5, 5, 6, 6]

    myRoom.play("person 4", []);
    // person 4 = [3, 7, 7, 7, 99]

    myRoom.play("Nico", []);
    // Nico = [3, 4, 6]

    myRoom.play("very cute girl", []);
    // very cute girl = [3, 4, 7]

    myRoom.play("person 3", [Card.Six, Card.Six]);
    // person 3 = [5, 5, 5]

    myRoom.play("person 4", []);
    // person 4 = [3, 7, 7, 7, 99]

    myRoom.play("Nico", []);
    // Nico = [3, 4, 6]

    myRoom.play("very cute girl", []);
    // very cute girl = [3, 4, 7]

    myRoom.play("person 3", [Card.Five, Card.Five, Card.Five]);
    // person 3 = []

    myRoom.play("person 4", []);
    // person 4 = [3, 7, 7, 7, 99]

    myRoom.play("Nico", []);
    // Nico = [3, 4, 6]

    myRoom.play("very cute girl", []);
    // very cute girl = [3, 4, 7]

    myRoom.play("person 4", [Card.Joker]);
    // person 4 = [3, 7, 7, 7]

    myRoom.play("Nico", [Card.Six]);
    // Nico = [3, 4]

    myRoom.play("very cute girl", [Card.Three]);
    // very cute girl = [4, 7]

    myRoom.play("person 4", []);
    // person 4 = [3, 7, 7, 7]

    myRoom.play("Nico", []);
    // Nico = [3, 4]

    myRoom.play("very cute girl", [Card.Seven]);
    // very cute girl = [4]

    myRoom.play("person 4", [Card.Three]);
    // person 4 = [7, 7, 7]

    myRoom.play("Nico", []);
    // Nico = [3, 4]

    myRoom.play("very cute girl", []);
    // very cute girl = [4]

    myRoom.play("person 4", [Card.Seven, Card.Seven, Card.Seven]);
    // person 4 = []

    myRoom.play("Nico", []);
    // Nico = [3, 4]

    myRoom.play("very cute girl", []);
    // very cute girl = [4]

    myRoom.play("Nico", [Card.Four]);
    // Nico = [3]

    myRoom.play("very cute girl", []);
    // very cute girl = [4]

    myRoom.play("Nico", [Card.Three]);
    // Nico = []

    myRoom.play("very cute girl", []);
    // very cute girl = [4]

    myRoom.play("very cute girl", [4]);
    // very cute girl = []

    // everyone is out of cards
  });

  it("should work with robots", () => {
    for (let i = 0; i < 100; i++) {
      let myRoom = new Room("Very cool room");
      myRoom.addUser("A");
      myRoom.addUser("B");
      myRoom.addUser("C");
      myRoom.addUser("D");
      myRoom.addUser("E");
      myRoom.startGame();
      myRoom.startPlay();

      // console.log("");

      // myRoom.users.forEach(user => console.log(user.name + ": " + user.cards));

      // while the game is in play
      while (myRoom.state === 3) {
        let currentPlayer = myRoom.getUserByName(myRoom.currentTurn);
        let playerMove = currentPlayer.generateMove(myRoom.currentCard, myRoom.currentCount);

        myRoom.play(currentPlayer.name, playerMove);
      }
    }
  })
});
