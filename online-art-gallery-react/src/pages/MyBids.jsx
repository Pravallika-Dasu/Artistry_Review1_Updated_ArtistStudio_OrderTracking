import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MyBids.css";

function MyBids() {

  const [myBids, setMyBids] = useState([]);

  useEffect(() => {
    const bids =
      JSON.parse(localStorage.getItem("auctionBids")) || [];

    const email = localStorage.getItem("currentUserEmail");

    const userBids = bids.filter(
      bid => bid.email === email
    );

    setMyBids(userBids);
  }, []);

  return (
    <div className="my-bids-page">

      <header className="my-bids-header">

        <div className="my-bids-header-content">
          <h1>MY BIDS</h1>
          <p>View the artworks you have bid on</p>
        </div>

        <div className="my-bids-top-links">
          <Link to="/home">Home</Link>
          <span>|</span>
          <Link to="/auction">Auction</Link>
        </div>

      </header>

      <main className="my-bids-main">

        <div className="my-bids-title">
          <h2>My Auction Bids</h2>
          <p>Here you can see all your placed bids.</p>
        </div>

        <div className="my-bids-list">

          {myBids.length === 0 ? (

            <div className="my-bids-empty">

              <h3>No Bids Yet</h3>

              <p>
                You have not placed any auction bids yet.
              </p>

              <p>
                Go to Auction and place a bid on an artwork.
              </p>

              <Link to="/auction" className="my-bids-button">
                Explore Auction
              </Link>

            </div>

          ) : (

            myBids.map((bid, index) => (

              <div className="my-bid-card" key={bid.id || index}>

                <h3>{bid.artwork}</h3>

                <p>
                  <strong>Artist:</strong> {bid.artist}
                </p>

                <p>
                  <strong>Your Bid:</strong> ₹{bid.bidAmount}
                </p>

                <p>
                  <strong>Auction Ends:</strong> {bid.endDate}
                </p>

                <p>
                  <strong>Bid Date:</strong> {bid.date}
                </p>

                <span className="my-bid-status">
                  {bid.status || "Active"}
                </span>

              </div>

            ))

          )}

        </div>

      </main>

      <footer className="my-bids-footer">
        <p>Online Art Gallery</p>
        <p>© 2026 Online Art Gallery. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default MyBids;