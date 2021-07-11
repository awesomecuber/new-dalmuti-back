import User from "../src/User";
import Room from "../src/Room";
import { expect } from "chai";

describe("play", () => {
  function getRoom(): Room {
    let room = new Room("test");
    room.users = [
      new User("A"),
      new User("B"),
      new User("C"),
      new User("D"),
      new User("E"),
    ];
    room.startGame(false);
    room.startPlay();
    room.users[0].cards = [2, 2, 3, 4, 6, 7, 7, 7, 99];
    room.users[1].cards = [3, 4, 5, 5, 6, 6, 6, 7];
    room.users[2].cards = [1, 5, 5, 5, 6, 6, 99];
    room.users[3].cards = [3, 4, 4, 7, 7, 7, 99];
    return room;
  }

  it("throws if player doesn't exist", () => {
    let room = getRoom();
    expect(() => room.play("fu", [])).to.throw();
  })

  it("throws if it's not your turn", () => {
    let room = getRoom();
    expect(() => room.play("B", [6, 6, 6])).to.throw();
  })

  describe("trick lead", () => {
    it("throws if cards aren't all the same", () => {
      let room = getRoom();
      expect(() => room.play("A", [6, 7, 7])).to.throw();
      expect(() => room.play("A", [2, 2, 3])).to.throw();
      expect(() => room.play("A", [7, 7, 99])).to.not.throw();
    })

    it("throws if user doesn't have the cards", () => {
      let room = getRoom();
      expect(() => room.play("A", [6, 6])).to.throw();
    })

    it("removes the cards from the hand", () => {
      let room = getRoom();
      room.play("A", [7, 7, 7])
    })
  })
})