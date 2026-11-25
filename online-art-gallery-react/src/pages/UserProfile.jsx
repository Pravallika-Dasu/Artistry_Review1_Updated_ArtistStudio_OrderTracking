import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import "./UserProfile.css";

function read(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function UserProfile() {
  const email = (localStorage.getItem("currentUserEmail") || "").toLowerCase();
  const name = localStorage.getItem("currentUserName") || "Gallery Member";
  const users = read("users");
  const user = users.find((item) => item.email?.toLowerCase() === email);

  const orders = useMemo(
    () => read("orders").filter((order) => order.email?.toLowerCase() === email),
    [email]
  );
  const wishlist = useMemo(
    () => read("wishlist").filter((item) => item.savedBy?.toLowerCase() === email || item.email?.toLowerCase() === email),
    [email]
  );
  const artist = read("artistProfiles").find((item) => item.email?.toLowerCase() === email);

  if (!email) return <Navigate to="/login" replace />;

  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className="user-profile-page">
      <section className="profile-hero">
        <div className="profile-hero-copy">
          <span className="profile-eyebrow">YOUR ARTISTRY ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your account, keep track of your collection and explore your artist journey.</p>
        </div>
        <div className="profile-avatar" aria-label="Profile initials">{initials || "U"}</div>
      </section>

      <div className="profile-content-grid">
        <section className="profile-card account-card">
          <div className="profile-card-heading">
            <div><span className="profile-eyebrow">ACCOUNT DETAILS</span><h2>Personal information</h2></div>
            <span className="profile-status">{user?.role === "admin" ? "Administrator" : "Member"}</span>
          </div>
          <div className="profile-detail-list">
            <div><span>Full name</span><strong>{user?.name || name}</strong></div>
            <div><span>Email address</span><strong>{user?.email || email}</strong></div>
            <div><span>Phone number</span><strong>{user?.phone || "Not added yet"}</strong></div>
            <div><span>Account type</span><strong>{user?.role === "admin" ? "Administrator" : "Customer account"}</strong></div>
          </div>
          <p className="profile-note">Your account details are shown here. Contact the gallery administrator if you need help changing registered information.</p>
        </section>

        <section className="profile-card profile-quick-stats">
          <span className="profile-eyebrow">YOUR ACTIVITY</span>
          <h2>Your gallery at a glance</h2>
          <div className="profile-stat-grid">
            <div><strong>{orders.length}</strong><span>Orders</span></div>
            <div><strong>{wishlist.length}</strong><span>Wishlist items</span></div>
            <div><strong>{artist ? artist.status : "—"}</strong><span>Artist status</span></div>
          </div>
        </section>

        <section className="profile-card profile-orders-card">
          <div className="profile-card-heading"><div><span className="profile-eyebrow">RECENT ACTIVITY</span><h2>My orders</h2></div><Link to="/orders">View all</Link></div>
          {orders.length ? (
            <div className="profile-recent-list">
              {orders.slice(-3).reverse().map((order, index) => (
                <div className="profile-recent-row" key={order.id || `${order.artwork}-${index}`}>
                  <div><strong>{order.artwork || "Artwork order"}</strong><span>{order.artist || "Artistry collection"}</span></div>
                  <strong>₹{order.price || "—"}</strong>
                </div>
              ))}
            </div>
          ) : <p className="profile-empty">You have not placed an order yet. Discover original pieces in our gallery.</p>}
        </section>

        <section className="profile-card profile-artist-card">
          <span className="profile-eyebrow">FOR CREATORS</span>
          <h2>{artist ? "Your artist application" : "Are you an artist?"}</h2>
          {artist ? (
            <>
              <p>Your artist profile is currently <strong className={`artist-status-${artist.status?.toLowerCase()}`}>{artist.status}</strong>.</p>
              <p className="profile-note">{artist.status === "Approved" ? "Your artist access is active. You can manage your artworks in Artist Studio." : artist.status === "Rejected" ? "Your application was not approved. Please contact the administrator for further guidance." : "The gallery admin is reviewing your artist profile. Artwork uploads become available after approval."}</p>
            </>
          ) : <p>Apply for an artist profile to showcase your work. Artwork uploads are enabled only after the gallery administrator approves your application.</p>}
          <Link className="profile-primary-link" to="/artist-profile">{artist ? "Open Artist Studio" : "Apply as an Artist"}</Link>
        </section>

        <section className="profile-card profile-shortcuts-card">
          <span className="profile-eyebrow">QUICK LINKS</span>
          <h2>Your collection</h2>
          <div className="profile-shortcuts">
            <Link to="/wishlist"><span>♡</span><div><strong>Wishlist</strong><small>Artworks you saved</small></div><b>→</b></Link>
            <Link to="/orders"><span>▤</span><div><strong>Order history</strong><small>Track your purchases</small></div><b>→</b></Link>
            <Link to="/my-bids"><span>♢</span><div><strong>My bids</strong><small>Your auction activity</small></div><b>→</b></Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserProfile;
