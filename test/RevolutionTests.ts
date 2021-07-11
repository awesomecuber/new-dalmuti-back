import User from "../src/User";
import Room from "../src/Room";
import { expect } from "chai";

describe("revolution", () => {
  it("throws when there they don't have jokers", () => {
    let room = new Room("test");
    room.users = [
      new User("A"),
      new User("B"),
      new User("C"),
      new User("D"),
      new User("E"),
    ];
    room.startGame(false);
    room.users[0].cards = [1];
    expect(() => room.callRevolution("A")).to.throw();
  });

  describe("no revolution to tax", () => {
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
      room.noRevolution();
      return room;
    }

    it("should put everyone in the right tax state", () => {
      let room = getRoom();
      expect(room.users[0].taxCards).to.deep.equal([]);
      expect(room.users[0].taxSubmitted).to.deep.equal(false);
      expect(room.users[1].taxCards).to.deep.equal([]);
      expect(room.users[1].taxSubmitted).to.deep.equal(false);
      expect(room.users[2].taxCards).to.deep.equal([]);
      expect(room.users[2].taxSubmitted).to.deep.equal(true);
      expect(room.users[3].taxCards).to.deep.equal([room.users[3].cards[0]]);
      expect(room.users[3].taxSubmitted).to.deep.equal(true);
      expect(room.users[4].taxCards).to.deep.equal([
        room.users[4].cards[0],
        room.users[4].cards[1],
      ]);
      expect(room.users[4].taxSubmitted).to.deep.equal(true);
    });

    it("should allow people to tax", () => {
      let room = getRoom();
      room.payTax("A", [room.users[0].cards[0], room.users[0].cards[1]]);
      room.payTax("B", [room.users[1].cards[0]]);
      expect(room.state).to.equal(3); // play
    });
  });

  describe("standard revolution", () => {
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
      room.users[0].cards.push(99, 99);
      room.callRevolution("A");
      return room;
    }

    it("should start play stage immediately", () => {
      let room = getRoom();
      expect(room.state).to.equal(3); // play
    });
  });

  describe("greater revolution", () => {
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
      room.users[4].cards.push(99, 99);
      room.callRevolution("E");
      return room;
    }

    it("should put everyone in the right tax state", () => {
      let room = getRoom();
      expect(room.users[4].taxCards).to.deep.equal([]);
      expect(room.users[4].taxSubmitted).to.deep.equal(false);
      expect(room.users[3].taxCards).to.deep.equal([]);
      expect(room.users[3].taxSubmitted).to.deep.equal(false);
      expect(room.users[2].taxCards).to.deep.equal([]);
      expect(room.users[2].taxSubmitted).to.deep.equal(true);
      expect(room.users[1].taxCards).to.deep.equal([room.users[1].cards[0]]);
      expect(room.users[1].taxSubmitted).to.deep.equal(true);
      expect(room.users[0].taxCards).to.deep.equal([
        room.users[0].cards[0],
        room.users[0].cards[1],
      ]);
      expect(room.users[0].taxSubmitted).to.deep.equal(true);
    });

    it("should allow people to tax", () => {
      let room = getRoom();
      room.payTax("E", [room.users[4].cards[0], room.users[4].cards[1]]);
      room.payTax("D", [room.users[3].cards[0]]);
      expect(room.state).to.equal(3); // play
    });
  });
});
