
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Home.css";

function Home() {
    const navigate = useNavigate();

    const [slide, setSlide] = useState(0);
    const [search, setSearch] = useState("");
    const [searchMessage, setSearchMessage] = useState("");
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [userProfile, setUserProfile] = useState({});
    const featuredArtworks = [
        {
            id: "nature",
            image: "/images/featured-nature.jpg",
            title: "Serene Nature",
            artist: "Ravi",
            price: "₹5,000",
            description: "A beautiful nature landscape painting showing peaceful mountains and greenery.",
            info: "Ravi is a talented artist who creates beautiful nature and landscape paintings.",
            reviews: [
                "Beautiful painting and excellent colours.",
                "Very peaceful and attractive artwork."
            ]
        },
        {
            id: "abstract",
            image: "/images/featured-abstract.jpg",
            title: "Beautiful Art",
            artist: "Priya",
            price: "₹7,000",
            description: "A creative artwork displayed in our online art gallery.",
            info: "Priya is a creative artist who enjoys different painting styles.",
            reviews: [
                "Very creative artwork.",
                "Nice design and colour combination."
            ]
        },
        {
            id: "portrait",
            image: "/images/featured-portrait.jpg",
            title: "Traditional Portrait",
            artist: "Arun",
            price: "₹6,000",
            description: "A traditional portrait painting with beautiful artistic details.",
            info: "Arun is an artist who creates detailed and expressive portraits.",
            reviews: [
                "Amazing portrait painting.",
                "The artwork looks beautiful."
            ]
        }
    ];

    const banners = [
        {
            image: "/images/art-banner-1.jpg",
            title: "Welcome to Online Art Gallery",
            text: "Discover beautiful artworks and creative ideas from talented artists."
        },
        {
            image: "/images/art-banner-2.jpg",
            title: "Explore Creative Artworks",
            text: "Find paintings that bring beauty and inspiration to your space."
        },
        {
            image: "/images/art-banner-3.jpg",
            title: "Meet Talented Artists",
            text: "Support artists and discover unique creations."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setSlide(previous => (previous + 1) % banners.length);
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    function searchArtwork() {
        const value = search.toLowerCase().trim();

        if (!value) {
            setSearchMessage("Please enter artwork name.");
            return;
        }

        const found = featuredArtworks.some(art =>
            art.title.toLowerCase().includes(value) ||
            art.artist.toLowerCase().includes(value)
        );

        setSearchMessage(found ? "Artwork found!" : "Artwork not found.");
    }

    function addReview(event) {
        event.preventDefault();

        const type = event.target.reviewType.value;
        const rating = event.target.reviewRating.value;
        const review = event.target.reviewText.value.trim();

        if (!type || !rating || !review) {
            alert("Please fill all fields.");
            return;
        }

        const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

        reviews.push({
            type,
            rating,
            review
        });

        localStorage.setItem("reviews", JSON.stringify(reviews));

        alert("Review submitted successfully!");
        event.target.reset();
    }
    function openUserProfile() {
    const email = localStorage.getItem("currentUserEmail");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email);

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const userOrder = orders.find(o => o.email === email);

    setUserProfile({
        name: user?.name || localStorage.getItem("currentUserName") || "User",
        email: email || "Not Available",
        phone: user?.phone || userOrder?.phone || "Not Available",
        address: user?.address || userOrder?.address || "Not Available"
    });

    setShowUserProfile(true);
}
    function logout() {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loggedInRole");
        localStorage.removeItem("currentUserEmail");
        localStorage.removeItem("currentUserName");
        navigate("/login");
    }

    return (
        <div className="gallery-home">

            {/* HEADER */}
            <div className="header">

                <div className="logo">
                    <Link to="/home">
                        <h2>ART GALLERY</h2>
                    </Link>
                </div>

                <div className="search">
                    <input
                        type="text"
                        placeholder="Search artwork"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <input
                        type="button"
                        value="Search"
                        onClick={searchArtwork}
                    />

                    <p id="searchMessage">{searchMessage}</p>
                </div>

                <div className="links">
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        openUserProfile();
                    }}>
                        User Profile
                    </a> |

                    <Link to="/artist-profile">Artist Profile</Link> |

                    <Link to="/wishlist">Wishlist</Link> |

                    <a href="#" onClick={logout}>Logout</a>
                </div>

            </div>

            {/* MENU */}
            <div className="menu">
                <Link to="/home">Home</Link>
                <Link to="/gallery">Gallery</Link>
                <Link to="/artists">Artists</Link>
                <Link to="/exhibitions">Exhibitions</Link>
                <Link to="/auction">Auction</Link>
                <a href="#reviews">Reviews</a>
                <Link to="/orders">My Orders</Link>
            </div>

            {/* BANNER SLIDER */}
            <div className="hero-slider">

                {banners.map((banner, index) => (
                    <div
                        className={`hero-slide ${slide === index ? "active" : ""}`}
                        key={index}
                    >
                        <img src={banner.image} alt={banner.title} />

                        <div className="hero-caption">
                            <h1>{banner.title}</h1>
                            <p>{banner.text}</p>
                        </div>
                    </div>
                ))}

                <button
                    className="slider-button slider-prev"
                    onClick={() => setSlide((slide - 1 + banners.length) % banners.length)}
                >
                    &#10094;
                </button>

                <button
                    className="slider-button slider-next"
                    onClick={() => setSlide((slide + 1) % banners.length)}
                >
                    &#10095;
                </button>

                <div className="slider-dots">
                    {banners.map((banner, index) => (
                        <span
                            key={index}
                            className={`slider-dot ${slide === index ? "active" : ""}`}
                            onClick={() => setSlide(index)}
                        ></span>
                    ))}
                </div>

            </div>

            {/* FEATURED ARTWORKS */}
            <div className="featured-heading">
                <h2>FEATURED ARTWORKS</h2>
                <p>Explore our selected artworks.</p>
            </div>

            <div className="featured-gallery">

                {featuredArtworks.map(art => (
                    <div className="featured-card" key={art.id}>

                        <img src={art.image} alt={art.title} />

                        <h3>{art.title}</h3>

                        <p>Artist: {art.artist}</p>

                        <p>Price: {art.price}</p>

                        <button
                            className="details-button"
                            onClick={() => setSelectedArtwork(art)}
                        >
                            View Details
                        </button>

                    </div>
                ))}

            </div>

            {/* ARTWORK DETAILS POPUP */}
            {selectedArtwork && (
                <div
                    className="details-overlay"
                    onClick={() => setSelectedArtwork(null)}
                    style={{ display: "block" }}
                >
                    <div
                        className="details-box"
                        onClick={e => e.stopPropagation()}
                    >
                        <span
                            className="details-close"
                            onClick={() => setSelectedArtwork(null)}
                        >
                            &times;
                        </span>

                        <img
                            src={selectedArtwork.image}
                            alt={selectedArtwork.title}
                        />

                        <h2>{selectedArtwork.title}</h2>

                        <p><strong>Artist:</strong> {selectedArtwork.artist}</p>

                        <p><strong>Price:</strong> {selectedArtwork.price}</p>

                        <p><strong>About:</strong> {selectedArtwork.description}</p>

                        <h3>Artist Information</h3>
                        <p>{selectedArtwork.info}</p>

                        <h3>Customer Reviews</h3>

                        {selectedArtwork.reviews.map((review, index) => (
                            <div className="details-review" key={index}>
                                {review}
                            </div>
                        ))}

                        <Link className="details-link" to="/gallery">
                            Explore All Artworks
                        </Link>

                        <a
                            className="details-link"
                            href="#reviews"
                            onClick={() => setSelectedArtwork(null)}
                        >
                            Write a Review
                        </a>
                    </div>
                </div>
            )}

            {/* REVIEWS */}
            <div className="reviews" id="reviews">

                <h2>Share Your Experience</h2>

                <form className="review-form" onSubmit={addReview}>

                    <label>Review Type</label>

                    <select name="reviewType" required>
                        <option value="">Select Review Type</option>
                        <option value="Artwork">Artwork</option>
                        <option value="Artist">Artist</option>
                        <option value="Gallery">Gallery</option>
                    </select>

                    <label>Rating</label>

                    <select name="reviewRating" required>
                        <option value="">Select Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>

                    <label>Your Review</label>

                    <textarea
                        name="reviewText"
                        placeholder="Write your review..."
                        required
                    ></textarea>

                    <button type="submit">Submit Review</button>

                </form>

            </div>
            {/* USER PROFILE POPUP */}

{showUserProfile && (
    <div
        className="user-profile-overlay"
        onClick={() => setShowUserProfile(false)}
    >
        <div
            className="user-profile-panel"
            onClick={(e) => e.stopPropagation()}
        >

            <div className="user-profile-header">
                <h2>MY USER PROFILE</h2>

                <span onClick={() => setShowUserProfile(false)}>
                    &times;
                </span>
            </div>

            <div className="user-profile-content">

                <div className="user-profile-avatar">
                    {userProfile.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <h2>{userProfile.name}</h2>

                <div className="user-profile-details">

                    <p>
                        <b>Name:</b> {userProfile.name}
                    </p>

                    <p>
                        <b>Email:</b> {userProfile.email}
                    </p>

                    <p>
                        <b>Phone:</b> {userProfile.phone}
                    </p>

                    <p>
                        <b>Address:</b> {userProfile.address}
                    </p>

                </div>

                <Link
                    to="/orders"
                    className="user-profile-orders"
                    onClick={() => setShowUserProfile(false)}
                >
                    My Orders
                </Link>

                <button
                    className="user-profile-logout"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </div>
    </div>
)}
            {/* FOOTER */}
            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-section">
                        <h3>About Us</h3>
                        <p>Welcome to Online Art Gallery. Explore beautiful artworks from talented artists.</p>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <p>Home | Gallery | Artists | Exhibitions</p>
                    </div>

                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p>Email: onlineartgallery@gmail.com</p>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>2026 Online Art Gallery. All rights reserved.</p>
                </div>

            </footer>

        </div>
    );
}

export default Home;

