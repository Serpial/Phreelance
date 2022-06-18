const auctionRoutes = (socket) => {
  socket.on("join-room", ({ auctionId }) => {
    socket.join(auctionId);
  });

  socket.on("posting-bid", ({ auctionId }) => {
    socket.to(auctionId).emit("posted-bid");
  });
};

module.exports = auctionRoutes;
