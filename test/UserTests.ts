import User from "../src/User";
import { expect } from "chai";
import Card from "../src/Card";

describe("user", () => {
  describe("generate move", () => {
    it("should throw when no cards", () => {
      let user = new User("test");
      user.cards = [];
      expect(() => user.generateMove(Card.Blank, 0)).to.throw();
    });

    describe("start of hand", () => {
      it("should pick higher double", () => {
        let user = new User("test");
        user.cards = [1, 2, 3, 3, 4, 5, 5, 6];
        let generatedMove = user.generateMove(Card.Blank, 0);
        expect(generatedMove).to.deep.equal([5, 5]);
      });

      it("shouldn't pick joker if it can", () => {
        let user = new User("test");
        user.cards = [1, 2, 2, 3, 99, 99];
        expect(user.generateMove(Card.Blank, 0)).to.deep.equal([2, 2]);
      });

      it("picks joker if that's the only one left", () => {
        let user = new User("test");
        user.cards = [99, 99];
        expect(user.generateMove(Card.Blank, 0)).to.deep.equal([99, 99]);
      });
    });

    describe("not start of hand", () => {
      it("prioritizes exact count matches", () => {
        let user = new User("test");
        user.cards = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 99];
        expect(user.generateMove(Card.Nine, 3)).to.deep.equal([3, 3, 3]);
      });

      it("then considers other matches", () => {
        let user = new User("test");
        user.cards = [1, 2, 2, 2, 99];
        expect(user.generateMove(Card.Three, 2)).to.deep.equal([2, 2]);
      });

      it("then considers jokers", () => {
        let user = new User("test");
        user.cards = [1, 2, 2, 2, 99];
        expect(user.generateMove(Card.Three, 4)).to.deep.equal([2, 2, 2, 99]);
      });

      it("works when joker is the trick", () => {
        let user = new User("test");
        user.cards = [1, 2, 2, 2, 99];
        expect(user.generateMove(Card.Joker, 2)).to.deep.equal([2, 2]);
      });
    });
  });

  describe("has cards", () => {
    it("works when they have the cards", () => {
      let user = new User("test");
      user.cards = [1, 2, 3, 4];
      expect(user.hasCards([1, 3])).to.be.true;
    });

    it("works when they don't have the cards", () => {
      let user = new User("test");
      user.cards = [1, 2, 3, 4];
      expect(user.hasCards([1, 3, 5])).to.be.false;
    });
  });
});
