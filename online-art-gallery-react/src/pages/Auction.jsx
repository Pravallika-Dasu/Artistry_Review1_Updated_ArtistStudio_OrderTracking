import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auction.css";

function Auction() {

  const auctions = [
    {
      id: 1,
      artwork: "Nature Painting",
      artist: "Ravi",
      endDate: "20 April 2026",
      startingBid: 5000,
      image: "painting1.jpg"
    },
    {
      id: 2,
      artwork: "Modern Art",
      artist: "Priya",
      endDate: "5 May 2026",
      startingBid: 7000,
      image: "painting2.jpg"
    },
    {
      id: 3,
      artwork: "Portrait",
      artist: "Arun",
      endDate: "18 May 2026",
      startingBid: 6000,
      image: "painting3.jpg"
    },
    {
      id: 4,
      artwork: "Abstract Art",
      artist: "Priya",
      endDate: "2 June 2026",
      startingBid: 8000,
      image: "featured-abstract.jpg"
    }
  ];

  const [amounts, setAmounts] = useState({});
  const [messages, setMessages] = useState({});

  const savedBids =
    JSON.parse(localStorage.getItem("auctionBids")) || [];

  const [currentBids, setCurrentBids] = useState(() => {
    const bids = {};

    auctions.forEach(auction => {
      const auctionBids = savedBids.filter(
        bid => bid.auctionId === auction.id
      );

      bids[auction.id] = Math.max(
        auction.startingBid,
        ...auctionBids.map(bid => Number(bid.bidAmount))
      );
    });

    return bids;
  });

  function placeBid(auction) {

    const amount = amounts[auction.id];

    if (
      localStorage.getItem("loggedIn") !== "true" &&
      !localStorage.getItem("currentUserEmail")
    ) {
      setMessages({
        ...messages,
        [auction.id]: {
          text: "Please login before placing a bid.",
          color: "red"
        }
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessages({
        ...messages,
        [auction.id]: {
          text: "Please enter your bid amount.",
          color: "red"
        }
      });
      return;
    }

    const bidAmount = Number(amount);
    const current = currentBids[auction.id];

    if (bidAmount <= current) {
      setMessages({
        ...messages,
        [auction.id]: {
          text: `Your bid must be higher than ₹${current}.`,
          color: "red"
        }
      });
      return;
    }

    const email = localStorage.getItem("currentUserEmail") || "";

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email);

    const newBid = {
      id: Date.now(),
      auctionId: auction.id,
      artwork: auction.artwork,
      artist: auction.artist,
      bidAmount: bidAmount,
      bidderName: user?.name || localStorage.getItem("currentUserName") || "",
      email: email,
      endDate: auction.endDate,
      status: "Active",
      date: new Date().toLocaleString()
    };

    const existingBids =
      JSON.parse(localStorage.getItem("auctionBids")) || [];

    existingBids.push(newBid);

    localStorage.setItem(
      "auctionBids",
      JSON.stringify(existingBids)
    );

    setCurrentBids({
      ...currentBids,
      [auction.id]: bidAmount
    });

    setAmounts({
      ...amounts,
      [auction.id]: ""
    });

    setMessages({
      ...messages,
      [auction.id]: {
        text: "Bid placed successfully.",
        color: "green"
      }
    });
  }

  return (
    <div className="auction-page">

      <header className="auction-header">

        <div className="auction-header-content">
          <h1>ART AUCTION</h1>
          <p>Bid on artworks from talented artists</p>
        </div>

        <div className="auction-top-links">
          <Link to="/home">Home</Link>
          <span>|</span>
          <Link to="/my-bids">My Bids</Link>
        </div>

      </header>

      <main className="auction-main">

        <div className="auction-intro">
          <h2>Live Auctions</h2>
          <p>
            Place your bid and get a chance to own
            your favorite artwork.
          </p>
        </div>

        <div className="auction-grid">

          {auctions.map(auction => (

            <div className="auction-card" key={auction.id}>

              <img
                src={`/images/${auction.image}`}
                className="auction-image"
                alt={auction.artwork}
              />

              <h2>{auction.artwork}</h2>

              <p>Artist: {auction.artist}</p>

              <p>Auction Ends: {auction.endDate}</p>

              <div className="auction-current-bid">
                Current Bid: ₹
                <strong>{currentBids[auction.id]}</strong>
              </div>

              <div className="auction-bid-form">

                <input
                  type="number"
                  placeholder="Enter your bid"
                  value={amounts[auction.id] || ""}
                  onChange={e =>
                    setAmounts({
                      ...amounts,
                      [auction.id]: e.target.value
                    })
                  }
                />

                <button
                  className="auction-bid-button"
                  onClick={() => placeBid(auction)}
                >
                  Place Bid
                </button>

                {messages[auction.id] && (
                  <p
                    className="auction-message"
                    style={{
                      color: messages[auction.id].color
                    }}
                  >
                    {messages[auction.id].text}
                  </p>
                )}

              </div>

            </div>

          ))}

        </div>

      </main>

      <footer className="auction-footer">
        <p>Online Art Gallery</p>
        <p>© 2026 Online Art Gallery. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Auction;