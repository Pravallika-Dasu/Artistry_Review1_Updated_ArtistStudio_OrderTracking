import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

const trackingSteps = ["Pending", "Approved", "Shipped", "Out for Delivery", "Delivered"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [expanded, setExpanded] = useState({});

  function loadOrders() {
    const email = localStorage.getItem("currentUserEmail");
    setCurrentEmail(email || "");
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(allOrders.filter(order => order.email === email));
  }

  useEffect(() => {
    loadOrders();
    window.addEventListener("focus", loadOrders);
    return () => window.removeEventListener("focus", loadOrders);
  }, []);

  const approved = orders.filter(order => order.status === "Approved").length;
  const rejected = orders.filter(order => order.status === "Rejected").length;
  const pending = orders.filter(order => order.status === "Pending").length;

  function toggleDetails(id) {
    setExpanded(previous => ({ ...previous, [id]: !previous[id] }));
  }

  function getStatusClass(status) {
    if (status === "Approved" || status === "Delivered") return "approved";
    if (status === "Rejected") return "rejected";
    return "pending";
  }

  return (
    <div className="orders-page">
      <header className="orders-header">
        <div className="orders-header-title"><h1>MY ORDERS</h1><p>Check Your Purchase & Delivery Status</p></div>
        <div className="orders-top-links"><Link to="/home">Home</Link><span>|</span><Link to="/gallery">Artworks</Link></div>
      </header>
      <main className="orders-main"><div className="orders-container">
        <div className="orders-description"><h2>Your Orders</h2><p>View your purchases, delivery address and order tracking updates.</p></div>
        {!currentEmail ? <div className="order-empty"><h2>Please login to view your orders.</h2><Link to="/login" className="browse-button">Login</Link></div> : <>
          <div className="status-boxes">
            <div className="status-box"><h3>Total Orders</h3><p>{orders.length}</p></div>
            <div className="status-box"><h3>Approved</h3><p>{approved}</p></div>
            <div className="status-box"><h3>Pending</h3><p>{pending}</p></div>
            <div className="status-box"><h3>Rejected</h3><p>{rejected}</p></div>
          </div>
          {orders.length === 0 ? <div className="order-empty"><h2>No Orders Yet</h2><p>You have not placed any orders yet.</p><Link to="/gallery" className="browse-button">Browse Artworks</Link></div> : orders.map(order => {
            const currentStep = trackingSteps.indexOf(order.status);
            const history = order.trackingHistory || [{ status: order.status || "Pending", date: order.date || "", note: "Current order status" }];
            return <div className="order-card" key={order.id}>
              <div className="order-title"><h2>{order.artwork || "Artwork"}</h2><span className={getStatusClass(order.status)}>{order.status || "Pending"}</span></div>
              <p><b>Order ID:</b> {order.id}</p><p><b>Artist:</b> {order.artist || "Not Available"}</p><p><b>Price:</b> ₹{order.price || "0"}</p><p><b>Order Date:</b> {order.date || "Not Available"}</p>
              <div className="tracking-section"><h3>Delivery Tracking</h3>
                {order.status === "Rejected" ? <p className="rejected">This order was rejected. Please contact the gallery administrator.</p> : <div className="tracking-steps">{trackingSteps.map((step, index) => <div className={`tracking-step ${currentStep >= index ? "step-done" : ""}`} key={step}><span className="step-dot">{currentStep >= index ? "✓" : index + 1}</span><span>{step}</span></div>)}</div>}
                <div className="tracking-history"><b>Latest Updates</b>{history.slice().reverse().map((item, index) => <p key={`${item.status}-${index}`}><strong>{item.status}</strong> — {item.note} <small>{item.date}</small></p>)}</div>
              </div>
              <button className="view-button" onClick={() => toggleDetails(order.id)}>{expanded[order.id] ? "Hide Details" : "View Delivery Details"}</button>
              {expanded[order.id] && <div className="order-details"><p><b>Customer:</b> {order.customerName}</p><p><b>Email:</b> {order.email}</p><p><b>Phone:</b> {order.phone}</p><p><b>Delivery Address:</b> {order.address || "Not Available"}</p></div>}
            </div>;
          })}
        </>}
      </div></main>
      <footer className="orders-footer"><p>© 2026 Artistry. All rights reserved.</p></footer>
    </div>
  );
}

export default Orders;
