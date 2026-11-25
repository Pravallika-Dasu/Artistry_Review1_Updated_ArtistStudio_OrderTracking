import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SiteLayout.css";

function SiteLayout() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const userName = localStorage.getItem("currentUserName") || "";

    function logout() {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loggedInRole");
        localStorage.removeItem("currentUserEmail");
        localStorage.removeItem("currentUserName");
        navigate("/login");
    }

    const links = [
        ["Home", "/home"],
        ["Artworks", "/gallery"],
        ["Artists", "/artists"],
        ["Exhibitions", "/exhibitions"],
        ["Auctions", "/auction"],
        ["Artist Studio", "/artist-profile"]
    ];

    return (
        <div className="app-shell">
            <header className="global-header">
                <NavLink to="/home" className="brand-mark" onClick={() => setMenuOpen(false)}>
                    <span className="brand-symbol">A.</span>
                    <span className="brand-copy">
                        <strong>ARTISTRY</strong>
                        <small>THE ONLINE ART GALLERY</small>
                    </span>
                </NavLink>

                <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
                    <span></span><span></span><span></span>
                </button>

                <nav className={`global-nav ${menuOpen ? "is-open" : ""}`}>
                    {links.map(([label, path]) => (
                        <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="header-actions">
                    <NavLink to="/wishlist" className="header-icon-link" aria-label="Wishlist" title="Wishlist">♡</NavLink>
                    <NavLink to="/orders" className="header-icon-link" aria-label="Orders" title="My orders">▤</NavLink>
                    <NavLink to="/my-bids" className="header-icon-link" aria-label="My bids" title="My bids">♢</NavLink>
                    <NavLink to="/profile" className="header-icon-link" aria-label="My profile" title="My profile">♙</NavLink>
                    {userName && <span className="header-user">Hi, {userName.split(" ")[0]}</span>}
                    <button className="header-logout" onClick={logout}>Sign out</button>
                </div>
            </header>

            <main className="global-main">
                <Outlet />
            </main>

            <footer className="global-footer">
                <div className="footer-main">
                    <div className="footer-brand-block">
                        <div className="footer-brand"><span>A.</span> ARTISTRY</div>
                        <p>A curated space to discover original artworks, meet creative minds and bring meaningful art into your world.</p>
                    </div>
                    <div className="footer-column">
                        <h4>EXPLORE</h4>
                        <NavLink to="/gallery">Artworks</NavLink>
                        <NavLink to="/artists">Our artists</NavLink>
                        <NavLink to="/exhibitions">Exhibitions</NavLink>
                    </div>
                    <div className="footer-column">
                        <h4>COLLECT</h4>
                        <NavLink to="/auction">Auctions</NavLink>
                        <NavLink to="/wishlist">Wishlist</NavLink>
                        <NavLink to="/orders">My orders</NavLink>
                        <NavLink to="/profile">My profile</NavLink>
                        <NavLink to="/artist-profile">Artist Studio</NavLink>
                    </div>
                    <div className="footer-note">
                        <span className="footer-eyebrow">ART, WITH A STORY</span>
                        <p>Every piece has a perspective.<br />Find the one that speaks to you.</p>
                    </div>
                </div>
                <div className="footer-bottom-line">
                    <span>© 2026 Artistry Online Art Gallery. All rights reserved.</span>
                    <span>Made for art lovers.</span>
                </div>
            </footer>
        </div>
    );
}

export default SiteLayout;
