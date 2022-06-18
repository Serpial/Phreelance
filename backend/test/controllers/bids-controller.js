const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");

const App = require("../../src/app");
const Auction = require("../../src/models/data/auction");
const Bid = require("../../src/models/data/bid");
const User = require("../../src/models/data/user");

chai.should();
chai.use(chaiHttp);

const URL_PREFIX = "/api/bids";

const SAMPLE_AUCTION = {
  title: "New Auction",
  description: "sample description",
  auctionType: "ENG",
  reservePrice: 40,
  startingPrice: 0,
  isPublic: true,
  created: new Date(Date.now()).toUTCString(),
  starting: new Date(Date.now()).toUTCString(),
  finishing: new Date(Date.now() + 100000000).toUTCString(),
};

const SAMPLE_BID = {
  description: "sample description",
  value: 10.01,
  timeEstimation: "1 days",
  created: new Date(Date.now()).toUTCString(),
  lastChange: new Date(Date.now()).toUTCString(),
};

const SAMPLE_USER = {
  name: "testUser",
  email: "T1@test.com",
  authId: "T1",
};

describe("Bids", () => {
  afterEach(async () => {
    try {
      await User.deleteMany({});
    } catch (err) {
      console.log("Could not complete clean-up");
    }

    try {
      await Auction.deleteMany({});
    } catch (err) {
      console.log("Could not complete clean-up");
    }

    try {
      await Bid.deleteMany({});
    } catch (err) {
      console.log("Could not complete clean-up");
    }
  });

  describe("/POST create bid on auction", () => {
    let auction, bidder;
    before(async () => {
      try {
        const creator = await addArbitraryUser();
        auction = await addArbitraryAuction(creator.id);
        bidder = await addArbitraryUser("T2");
      } catch (err) {
        console.log("Could not create set-up");
      }
    });
    it("should successfully add a new bid", (done) => {
      chai
        .request(App)
        .post(`${URL_PREFIX}/create/${auction.id}/${bidder.id}`)
        .send(SAMPLE_BID)
        .end((_err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("bid");
          res.body.bid.should.have.property("auction");
          res.body.bid.auction.should.equal(auction.id);
          res.body.bid.should.have.property("creator");
          res.body.bid.creator.should.equal(bidder.id);
          done();
        });
    });
  });

  describe("/POST creator's bid on its own auction", () => {
    let creator, auction;
    before(async () => {
      try {
        creator = await addArbitraryUser();
        auction = await addArbitraryAuction(creator.id);
      } catch (err) {
        console.log("Could not create set-up");
      }
    });
    it("should fail creating bid for creator", (done) => {
      chai
        .request(App)
        .post(`${URL_PREFIX}/create/${auction.id}/${creator.id}`)
        .send(SAMPLE_BID)
        .end((_err, res) => {
          res.should.have.status(422);
          res.body.message.should.equal(
            "Creator cannot bid on their own auction"
          );
          done();
        });
    });
  });

  describe("/POST create multiple bids on the same auction", () => {
    let user, auction;
    before(async () => {
      try {
        const creator = await addArbitraryUser();
        auction = await addArbitraryAuction(creator.id);
        user = await addArbitraryUser("T2");

        const newBid = new Bid({
          ...SAMPLE_BID,
          auction: auction.id,
          creator: user.id,
        });
        await newBid.save();
      } catch (err) {
        console.log("Could not create set-up");
      }
    });
    it("should not successfully create bid", (done) => {
      chai
        .request(App)
        .post(`${URL_PREFIX}/create/${auction.id}/${user.id}`)
        .send({ ...SAMPLE_BID, value: 5 })
        .end((_err, res) => {
          res.should.have.status(422);
          res.body.message.should.equal(
            "Bid already exists for this user in this auction. Please use patch."
          );
          done();
        });
    });
  });

  describe("/POST create bid higher than the current bid", () => {
    let user, auction;
    before(async () => {
      try {
        const creator = await addArbitraryUser();
        auction = await addArbitraryAuction(creator.id);
        const initialBidder = await addArbitraryUser("T2");
        user = await addArbitraryUser("T3");

        const newBid = new Bid({
          ...SAMPLE_BID,
          auction: auction.id,
          creator: initialBidder.id,
          value: 0.02,
        });
        await newBid.save();
      } catch (err) {
        throw new Error("Could not create set-up");
      }
    });
    it("should reject the bid", (done) => {
      chai
        .request(App)
        .post(`${URL_PREFIX}/create/${auction.id}/${user.id}`)
        .send({ ...SAMPLE_BID, value: 0.03 })
        .end((_err, res) => {
          res.should.have.status(422);
          res.body.message.should.equal(
            "Your bid is greater than the current winning bid"
          );
          done();
        });
    });
  });
});

const addArbitraryAuction = async (creator) => {
  const sampleMeaningfulId =
    SAMPLE_AUCTION.title.toLowerCase().split(" ").splice(0, 5).join("-") +
    "-" +
    new mongoose.Types.ObjectId().toString();
  const newAuction = new Auction({
    ...SAMPLE_AUCTION,
    meaningfulId: sampleMeaningfulId,
    creator: creator || new mongoose.Types.ObjectId(),
  });

  try {
    await newAuction.save();
  } catch (err) {
    throw err;
  }

  return newAuction;
};

const addArbitraryUser = async (userIdentifier) => {
  const newUser = new User({
    ...SAMPLE_USER,
    authId: userIdentifier || "T1",
    email: `${userIdentifier || "T1"}@test.com`,
  });

  try {
    await newUser.save();
  } catch (err) {
    throw err;
  }

  return newUser;
};
