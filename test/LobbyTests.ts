import User from "../src/User";
import Room from "../src/Room";
import { expect } from "chai";

describe("lobby", () => {
  describe("add user", () => {
    it("can add users", () => {
      let room = new Room("test");
      room.addUser("A");
      let user = new User("A");
      expect(room.users[0]).to.deep.equal(user);
      room.addUser("B");
      let user2 = new User("B")
      expect(room.users[1]).to.deep.equal(user2);
    })

    it("throws when empty name", () => {
      let room = new Room("test");
      expect(() => room.addUser("")).to.throw();
    })

    it("throws when duplicate name", () => {
      let room = new Room("test");
      room.addUser("A")
      expect(() => room.addUser("A")).to.throw();
    })
  })

  describe("change ready status", () => {
    it("can change ready status", () => {
      let room = new Room("test");
      room.addUser("A");
      room.changeReadyStatus("A", true);
      expect(room.users[0].ready).to.be.true;
    })

    it("throws when the user doesn't exist", () => {
      let room = new Room("test");
      room.addUser("A");
      expect(() => room.changeReadyStatus("B", true)).to.throw();
    })

    it("starts game when people are ready", () => {
      let room = new Room("test");
      room.addUser("A");
      room.addUser("B");
      room.addUser("C");
      room.addUser("D");
      room.addUser("E");
      room.changeReadyStatus("A", true);
      room.changeReadyStatus("B", true);
      room.changeReadyStatus("C", true);
      room.changeReadyStatus("D", true);
      expect(room.state).to.equal(0); // lobby
      room.changeReadyStatus("E", true);
      expect(room.state).to.equal(1); // revolution
    })

    it("doesn't start if there's less than four people", () => {
      let room = new Room("test");
      room.addUser("A");
      room.addUser("B");
      room.addUser("C");
      room.changeReadyStatus("A", true);
      room.changeReadyStatus("B", true);
      room.changeReadyStatus("C", true);
      expect(room.state).to.equal(0); // lobby
    })
  })
})