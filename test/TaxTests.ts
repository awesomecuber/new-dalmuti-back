import User from "../src/User";
import Room from "../src/Room";
import { expect } from "chai";

describe("tax", () => {
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
    room.users.forEach(user => {
      user.cards = [1, 2, 3, 4, 5, 99]
    })
    room.noRevolution();
    return room;
  }

  it("taxes the peons correctly", () => {
    let room = getRoom();
    expect(room.users[3].taxCards).to.deep.equal([1]);
    expect(room.users[4].taxCards).to.deep.equal([1, 2]);
    expect(room.users[3].taxSubmitted).to.be.true;
    expect(room.users[4].taxSubmitted).to.be.true;
  })

  it("doesn't tax the merchant", () => {
    let room = getRoom();
    expect(room.users[2].taxCards).to.deep.equal([]);
    expect(room.users[2].taxSubmitted).to.be.true;
  })

  it("allows dalmutis to tax", () => {
    let room = getRoom();
    expect(room.users[0].taxCards).to.deep.equal([]);
    expect(room.users[1].taxCards).to.deep.equal([]);
    expect(room.users[0].taxSubmitted).to.be.false;
    expect(room.users[1].taxSubmitted).to.be.false;
    room.payTax("A", [4, 5]);
    expect(room.users[0].taxCards).to.deep.equal([4, 5]);
    expect(room.users[0].taxSubmitted).to.be.true;
    room.payTax("B", [5]);
    expect(room.users[1].taxCards).to.deep.equal([5]);
    expect(room.users[1].taxSubmitted).to.be.true;
  })

  it("trades the cards after taxing complete", () => {
    let room = getRoom();
    room.payTax("A", [4, 5]);
    room.payTax("B", [4]);
    expect(room.users[0].cards).to.deep.equal([1, 1, 2, 2, 3, 99]);
    expect(room.users[1].cards).to.deep.equal([1, 1, 2, 3, 5, 99]);
    expect(room.users[2].cards).to.deep.equal([1, 2, 3, 4, 5, 99]);
    expect(room.users[3].cards).to.deep.equal([2, 3, 4, 4, 5, 99]);
    expect(room.users[4].cards).to.deep.equal([3, 4, 4, 5, 5, 99]);
    expect(room.state).to.equal(3); // play
  })

  it("throws when user doesn't exist", () => {
    let room = getRoom();
    expect(() => room.payTax("fu", [1, 2])).to.throw;
  })

  it("throws when user already paid tax", () => {
    let room = getRoom();
    expect(() => room.payTax("C", [1, 2])).to.throw;
    room.payTax("A", [1, 2]);
    expect(() => room.payTax("A", [1, 2])).to.throw;
  })

  it("throws when number of cards is wrong", () => {
    let room = getRoom();
    expect(() => room.payTax("A", [1])).to.throw;
    expect(() => room.payTax("A", [1, 2, 3])).to.throw;
    expect(() => room.payTax("B", [])).to.throw;
    expect(() => room.payTax("B", [1, 2])).to.throw;
  })

  it("throws when user doesnt have the cards", () => {
    let room = getRoom();
    expect(() => room.payTax("A", [1, 6])).to.throw;
    expect(() => room.payTax("B", [6])).to.throw;
  })
});