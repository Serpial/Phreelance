const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");

const App = require("../../src/app");
const Auction = require("../../src/models/data/auction");
const User = require("../../src/models/data/user");

chai.should();
chai.use(chaiHttp);

const URL_PREFIX = "/api/auctions";

const SAMPLE_AUCTION = {
  title: "New Auction",
  description: "sample description",
  auctionType: "eng",
  isPublic: true,
  created: new Date(Date.now()).toUTCString(),
  starting: new Date(Date.now()).toUTCString(),
  finishing: new Date(Date.now() + 100000000).toUTCString(),
};

const SAMPLE_USER = {
  name: "test",
  email: "test@test.com",
  authId: "testauth",
};

describe("Auctions", () => {
  let userId;

  beforeEach(async () => {
    try {
      userId = (await new User(SAMPLE_USER).save()).id.toString();
    } catch (err) {
      console.log("beforeEach failed : " + err);
    }
  });

  afterEach(async () => {
    try {
      const auctions = await Auction.find({});
      await User.deleteMany({});
      if (auctions.length > 0) {
        await Auction.deleteMany({});
      }
    } catch (err) {
      console.log("afterEach failed : " + err);
    }
  });

  describe("/GET empty list of public auctions.", () => {
    it("should return a warning that no public auctions could be found", (done) => {
      chai
        .request(App)
        .get(URL_PREFIX + "/")
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          done();
        });
    });
  });

  describe("/GET auctions", () => {
    before(async () => {
      for (let i = 0; i < 3; i++) {
        await addArbitraryAuction();
      }
    });
    it("should show one auction", (done) => {
      chai
        .request(App)
        .get(URL_PREFIX + "/")
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.not.have.property("message");
          res.body.auctions.length.should.be.eql(3);
          done();
        });
    });
  });

  describe("/GET auction by ID", () => {
    let auction;
    before(async () => {
      auction = await addArbitraryAuction();
    });
    it("given arbitrary auctions, get the auction", (done) => {
      chai
        .request(App)
        .get(URL_PREFIX + "/" + auction.id)
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.not.have.property("message");
          res.body.should.have.property("auction");
          res.body.auction.should.have.property("id");
          res.body.auction.id.should.equal(auction.id.toString());
          done();
        });
    });
  });

  describe("/GET auction by creator ID", () => {
    let userId;
    before(async () => {
      userId = new mongoose.Types.ObjectId();
      await addArbitraryAuction(userId);
      await addArbitraryAuction(userId);

      for (let i = 0; i < 3; i++) {
        await addArbitraryAuction();
      }
    });
    it("given 5 auctions, get the two auctions created by user", (done) => {
      chai
        .request(App)
        .get(URL_PREFIX + "/creator/" + userId)
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.not.have.property("message");
          res.body.auctions.length.should.be.eql(2);
          done();
        });
    });
  });

  describe("/POST a new auction.", () => {
    it("can create a new auction", (done) => {
      chai
        .request(App)
        .post(URL_PREFIX + "/" + userId)
        .send(SAMPLE_AUCTION)
        .end((_err, res) => {
          res.should.have.status(201);
          res.body.auction.should.have.property("attachments");
          res.body.auction.should.have.property("isPublic");
          res.body.auction.should.have.property("isSealed");
          res.body.auction.should.have.property("creator");
          res.body.auction.should.have.property("created");
          done();
        });
    });
  });

  describe("/POST a new auction without a title", () => {
    it("should NOT be created successfully", (done) => {
      chai
        .request(App)
        .post(URL_PREFIX + "/" + userId)
        .send({ ...SAMPLE_AUCTION, title: "" })
        .end((_err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });

  describe("/POST a new auction without a description", () => {
    it("should NOT be created successfully", (done) => {
      chai
        .request(App)
        .post(URL_PREFIX + "/" + userId)
        .send({ ...SAMPLE_AUCTION, description: "" })
        .end((_err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });

  describe("/POST a new auction with an invalid auction type", () => {
    it("should NOT be created successfully", (done) => {
      chai
        .request(App)
        .post(URL_PREFIX + "/" + userId)
        .send({ ...SAMPLE_AUCTION, auctionType: "asdf" })
        .end((_err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });

  describe("/POST a new auction with a start time before creation time", () => {
    it("should NOT be created successfully", (done) => {
      chai
        .request(App)
        .post(URL_PREFIX + "/" + userId)
        .send({ ...SAMPLE_AUCTION, starting: new Date(0).toUTCString() })
        .end((_err, res) => {
          res.should.have.status(422);
          res.body.should.have.property("message");
          done();
        });
    });
  });

  describe("/POST a new auction with a start time 3 months after creation time", () => {
    it("should NOT be created successfully", (done) => {
      const moreThanThreeMonths = 8540200000;
      chai
        .request(App)
        .post(URL_PREFIX + "/" + userId)
        .send({
          ...SAMPLE_AUCTION,
          starting: new Date(
            Date.now() + moreThanThreeMonths + 1000
          ).toUTCString(),
        })
        .end((_err, res) => {
          res.should.have.status(422);
          res.body.should.have.property("message");
          done();
        });
    });
  });

  describe("/POST a new auction with a finish time a year after start time", () => {
    it("should NOT be created successfully", (done) => {
      const decade = 316224000000;
      chai
        .request(App)
        .post(URL_PREFIX + "/" + userId)
        .send({
          ...SAMPLE_AUCTION,
          finishing: new Date(Date.now() + decade).toUTCString(),
        })
        .end((_err, res) => {
          res.should.have.status(422);
          res.body.should.have.property("message");
          done();
        });
    });
  });

  describe("/DELETE auction by ID", () => {
    let auction;
    before(async () => {
      auction = await addArbitraryAuction();
    });
    it("given arbitrary auctions, get the auction", (done) => {
      chai
        .request(App)
        .delete(URL_PREFIX + "/" + auction.id)
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message");
          res.body.message.should.equal("Auction deleted!");
          done();
        });
    });
  });
});

const addArbitraryAuction = async (creator) => {
  const newAuction = new Auction({
    ...SAMPLE_AUCTION,
    creator: creator || new mongoose.Types.ObjectId(),
  });

  try {
    await newAuction.save();
  } catch (err) {
    throw err;
  }

  return newAuction;
};