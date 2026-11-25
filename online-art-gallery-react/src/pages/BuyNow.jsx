import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./BuyNow.css";

function BuyNow() {
  const navigate = useNavigate();
  const artwork = JSON.parse(localStorage.getItem("selectedArtwork") || "null");
  const [name, setName] = useState(localStorage.getItem("currentUserName") || "");
  const [email, setEmail] = useState(localStorage.getItem("currentUserEmail") || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({ house: "", street: "", city: "", state: "", pincode: "" });

  function updateAddress(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  function placeOrder(e) {
    e.preventDefault();
    if (!artwork) {
      alert("Please select an artwork first.");
      navigate("/gallery");
      return;
    }
    if (!localStorage.getItem("currentUserEmail")) {
      alert("Please login before placing an order.");
      navigate("/login");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = {
      id: `ART-${Date.now()}`,
      artwork: artwork.name || artwork.title || "Artwork",
      artist: artwork.artist || "Unknown Artist",
      price: Number(artwork.price) || 0,
      image: artwork.image || "",
      customerName: name,
      email,
      phone,
      address: `${address.house}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      addressDetails: address,
      date: new Date().toLocaleDateString(),
      status: "Pending",
      trackingHistory: [{ status: "Pending", date: new Date().toLocaleString(), note: "Order placed successfully" }]
    };
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    alert("Your order has been placed successfully!");
    localStorage.removeItem("selectedArtwork");
    navigate("/orders");
  }

  if (!artwork) return <div className="buy-page"><h2>No Artwork Selected</h2><Link to="/gallery">Explore Artworks</Link></div>;

  return (
    <div className="buy-page">
      <div className="buy-header"><h1>ARTISTRY</h1><p>Secure Your Artwork</p></div>
      <div className="buy-container">
        <h2>ORDER DETAILS</h2>
        <div className="selected-artwork">
          <img src={artwork.image?.startsWith("http") || artwork.image?.startsWith("/") || artwork.image?.startsWith("data:") ? artwork.image : "/images/" + artwork.image} alt={artwork.name || artwork.title} />
          <h3>{artwork.name || artwork.title}</h3>
          <p>Artist: {artwork.artist || "Unknown Artist"}</p>
          <h3>Price: ₹{artwork.price}</h3>
        </div>
        <h2>Customer & Delivery Details</h2>
        <form onSubmit={placeOrder}>
          <label>Customer Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Phone Number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} pattern="[0-9]{10}" maxLength="10" placeholder="Enter 10 digit phone number" required />
          <h3 className="address-heading">Delivery Address</h3>
          <label>House / Flat Number</label>
          <input name="house" value={address.house} onChange={updateAddress} placeholder="House or flat number" required />
          <label>Street / Area</label>
          <input name="street" value={address.street} onChange={updateAddress} placeholder="Street and area" required />
          <label>City</label>
          <input name="city" value={address.city} onChange={updateAddress} required />
          <label>State</label>
          <input name="state" value={address.state} onChange={updateAddress} required />
          <label>PIN Code</label>
          <input name="pincode" value={address.pincode} onChange={updateAddress} inputMode="numeric" pattern="[0-9]{6}" maxLength="6" placeholder="6 digit PIN code" required />
          <button type="submit">Place Order</button>
        </form>
        <Link to="/gallery" className="back-link">Back to Artworks</Link>
      </div>
    </div>
  );
}

export default BuyNow;
