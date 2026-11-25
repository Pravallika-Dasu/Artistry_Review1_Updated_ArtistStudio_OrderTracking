
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";

function Gallery() {
    const navigate = useNavigate();

    const defaultArtworks = [
        { id: "default1", title: "Nature Painting", artist: "Ravi", price: 5000, offer: "10% OFF", rating: 4.5, buyers: 128, image: "painting1.jpg" },
        { id: "default2", title: "Modern Art", artist: "Priya", price: 7000, offer: "15% OFF", rating: 4.2, buyers: 96, image: "painting2.jpg" },
        { id: "default3", title: "Portrait Painting", artist: "Arun", price: 6000, offer: "5% OFF", rating: 4.7, buyers: 154, image: "painting3.jpg" },
        { id: "default4", title: "Abstract Art", artist: "Meena", price: 8000, offer: "20% OFF", rating: 4.4, buyers: 87, image: "painting4.jpg" },
        { id: "default5", title: "Landscape Painting", artist: "Kiran", price: 5500, offer: "10% OFF", rating: 4.6, buyers: 112, image: "painting5.jpg" },
        { id: "default6", title: "Traditional Art", artist: "Anjali", price: 6500, offer: "12% OFF", rating: 4.8, buyers: 176, image: "painting6.jpg" },
        { id: "default7", title: "Flower Painting", artist: "Sneha", price: 4500, offer: "10% OFF", rating: 4.3, buyers: 78, image: "painting7.jpg" },
        { id: "default8", title: "Village Scenery", artist: "Rahul", price: 7500, offer: "15% OFF", rating: 4.6, buyers: 105, image: "painting8.jpg" },
        { id: "default9", title: "Indian Classical Art", artist: "Divya", price: 9000, offer: "10% OFF", rating: 4.9, buyers: 190, image: "painting9.jpg" },
        { id: "default10", title: "Wildlife Painting", artist: "Suresh", price: 5800, offer: "5% OFF", rating: 4.5, buyers: 92, image: "painting10.jpg" },
        { id: "default11", title: "Beautiful Seascape", artist: "Neha", price: 6800, offer: "12% OFF", rating: 4.7, buyers: 134, image: "painting11.jpg" },
        { id: "default12", title: "Buddha Painting", artist: "Varun", price: 8500, offer: "20% OFF", rating: 4.8, buyers: 160, image: "painting12.jpg" }
    ];

    const [artworks, setArtworks] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const uploaded = JSON.parse(
            localStorage.getItem("artistArtworks")
        ) || [];

        const artistArtworks = uploaded.map((art, index) => ({
            id: art.id || "uploaded_" + index,
            title: art.title || "Untitled Artwork",
            artist: art.artist || "Unknown Artist",
            price: Number(art.price) || 0,
            offer: art.offer || "Special Offer",
            rating: Number(art.rating) || 0,
            buyers: Number(art.buyers) || 0,
            image: art.image || "painting1.jpg"
        }));

        setArtworks([...defaultArtworks, ...artistArtworks]);

        const savedWishlist = JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];

        setWishlist(savedWishlist);
    }, []);

    function imagePath(image) {
        if (!image) return "/images/painting1.jpg";

        if (image.startsWith("http") || image.startsWith("/")) {
            return image;
        }

        return "/images/" + image;
    }

    function toggleWishlist(artwork) {
        const exists = wishlist.some(
            item => String(item.id) === String(artwork.id)
        );

        let updated;

        if (exists) {
            updated = wishlist.filter(
                item => String(item.id) !== String(artwork.id)
            );

            setMessage(artwork.id, "Removed from Wishlist", "red");
        } else {
            updated = [...wishlist, artwork];

            setMessage(artwork.id, "♥ Added to Wishlist", "green");
        }

        setWishlist(updated);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(updated)
        );
    }

    function setMessage(id, message, color) {
        setMessages(previous => ({
            ...previous,
            [id]: { message, color }
        }));

        setTimeout(() => {
            setMessages(previous => ({
                ...previous,
                [id]: null
            }));
        }, 2000);
    }

    function createStars(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;

        let stars = "★".repeat(full);

        if (half) stars += "★";

        while (stars.length < 5) {
            stars += "☆";
        }

        return stars;
    }

    function buyNow(artwork) {
        localStorage.setItem(
            "selectedArtwork",
            JSON.stringify(artwork)
        );

        navigate("/buy-now");
    }

    return (
        <div className="gallery-list-page">

            <div className="header">

                <div className="header-title">
                    <h1>ONLINE ART GALLERY</h1>
                    <p>Explore Our Artworks</p>
                </div>

                <div className="top-links">
                    <a href="/home">Home</a>
                    <span>|</span>
                    <a href="/artists">Artists</a>
                    <span>|</span>
                    <a href="/wishlist">Wishlist</a>
                </div>

            </div>

            <div className="page-title">
                <h2>AVAILABLE ARTWORKS</h2>
            </div>

            <div className="artworks" id="artworksContainer">

                {artworks.length === 0 ? (

                    <div className="empty">
                        <h2>No Artworks Available</h2>
                        <p>There are no artworks available right now.</p>
                    </div>

                ) : (

                    artworks.map(artwork => {

                        const active = wishlist.some(
                            item => String(item.id) === String(artwork.id)
                        );

                        return (
                            <div className="artwork" key={artwork.id}>

                                <button
                                    className={`heart-button ${active ? "active" : ""}`}
                                    onClick={() => toggleWishlist(artwork)}
                                >
                                    {active ? "♥" : "♡"}
                                </button>

                                <img
                                    src={imagePath(artwork.image)}
                                    alt={artwork.title}
                                />

                                <h3>{artwork.title}</h3>

                                <p className="artist">
                                    <strong>Artist:</strong> {artwork.artist}
                                </p>

                                <p className="price">₹{artwork.price}</p>

                                <p className="offer">
                                    🎁 {artwork.offer}
                                </p>

                                <div className="rating">
                                    <span className="stars">
                                        {createStars(artwork.rating)}
                                    </span>
                                    <br />
                                    <span className="rating-number">
                                        {artwork.rating} / 5 Rating
                                    </span>
                                </div>

                                <p className="sold">
                                    👥 {artwork.buyers} people purchased this artwork
                                </p>

                                <div
                                    className="wishlist-message"
                                    style={{
                                        color: messages[artwork.id]?.color || "green"
                                    }}
                                >
                                    {messages[artwork.id]?.message || ""}
                                </div>

                                <button
                                    className="buy-button"
                                    onClick={() => buyNow(artwork)}
                                >
                                    Buy Now
                                </button>

                            </div>
                        );
                    })

                )}

            </div>

        </div>
    );
}

export default Gallery;

