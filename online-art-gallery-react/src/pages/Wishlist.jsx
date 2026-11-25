
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Wishlist.css";
import { Link } from "react-router-dom";
function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        loadWishlist();
    }, []);

    function loadWishlist() {
        const items = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(items);
    }

    function removeFromWishlist(id) {
        const updated = wishlist.filter(
            item => String(item.id) !== String(id)
        );

        localStorage.setItem("wishlist", JSON.stringify(updated));
        setWishlist(updated);
    }

    function createStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        return "★".repeat(fullStars) + (halfStar ? "½" : "");
    }

    function buyNow(artwork) {
        localStorage.setItem("selectedArtwork", JSON.stringify(artwork));
        navigate("/buy-now");
    }

    return (
        <div className="wishlist-page">

            <div className="header">
                <div className="header-title">
                    <h1>ONLINE ART GALLERY</h1>
                    <p>My Wishlist</p>
                </div>

                <div className="top-links">
                    <a href="/home">Home</a>
                    <span>|</span>
                    <Link to="/gallery">Artworks</Link>
                </div>
            </div>

            <div className="main">

                <div className="page-title">
                    <h2>MY WISHLIST ❤️</h2>
                </div>

                <div className="artworks">

                    {wishlist.length === 0 ? (

                        <div className="empty">
                            <h2>Your Wishlist is Empty ❤️</h2>
                            <p>
                                Go to Artworks and click the ❤️
                                to save your favorite artworks.
                            </p>
                            <a href="/gallery">Explore Artworks</a>
                        </div>

                    ) : (

                        wishlist.map(artwork => (

                            <div className="artwork" key={artwork.id}>

                                <button
                                    className="heart-button"
                                    onClick={() => removeFromWishlist(artwork.id)}
                                >
                                    ♥
                                </button>

                                <img
                                    src={
                                        artwork.image?.startsWith("/")
                                            ? artwork.image
                                            : "/images/" + artwork.image
                                    }
                                    alt={artwork.name || artwork.title}
                                />

                                <h3>{artwork.name || artwork.title}</h3>

                                <p>
                                    <strong>Artist:</strong> {artwork.artist}
                                </p>

                                <p>
                                    <strong>₹{artwork.price}</strong>
                                </p>

                                <div className="rating">
                                    {createStars(artwork.rating || 4.5)}

                                    <span className="rating-number">
                                        ({artwork.rating || 4.5}/5 -
                                        {" "}{artwork.ratingCount || 0} ratings)
                                    </span>
                                </div>

                                <p className="purchase-count">
                                    🛒 {artwork.purchased || 0}
                                    {" "}people purchased this
                                </p>

                                <p className="offer">
                                    🔥 {artwork.offer || "Special Offer"}
                                </p>

                                <button
                                    className="buy-button"
                                    onClick={() => buyNow(artwork)}
                                >
                                    Buy Now
                                </button>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>
    );
}

export default Wishlist;

