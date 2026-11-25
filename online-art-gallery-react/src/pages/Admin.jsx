
import { useState } from "react";
import "./Admin.css";

function Admin() {
  const [artists, setArtists] = useState(
    JSON.parse(localStorage.getItem("artistProfiles")) || []
  );

  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("orders")) || []
  );

  function updateArtist(index, status) {
    const updatedArtists = [...artists];
    updatedArtists[index].status = status;

    localStorage.setItem("artistProfiles", JSON.stringify(updatedArtists));
    setArtists(updatedArtists);
  }

  function updateOrder(index, status) {
    const updatedOrders = [...orders];
    const order = { ...updatedOrders[index] };

    order.status = status;
    order.trackingHistory = [
      ...(order.trackingHistory || []),
      {
        status,
        date: new Date().toLocaleString(),
        note: `Order status updated to ${status}`
      }
    ];

    updatedOrders[index] = order;

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  }

  function getStatusClass(status) {
    if (status === "Approved" || status === "Delivered") return "approve";
    if (status === "Rejected") return "reject";
    return "pending";
  }

  // Open uploaded certificate or artwork
  function openUploadedFile(file) {
    if (!file || !file.data) {
      alert("File not found!");
      return;
    }

    try {
      const response = atob(file.data.split(",")[1]);
      const bytes = new Uint8Array(response.length);

      for (let i = 0; i < response.length; i++) {
        bytes[i] = response.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: file.type || "application/pdf"
      });

      const fileURL = URL.createObjectURL(blob);
      const newTab = window.open(fileURL, "_blank");

      if (!newTab) {
        URL.revokeObjectURL(fileURL);
        alert("Please allow pop-ups to view this file.");
        return;
      }

      newTab.onload = () => {
        URL.revokeObjectURL(fileURL);
      };
    } catch (error) {
      console.error("File preview error:", error);
      alert("Unable to open this file. Please check the uploaded file.");
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>ONLINE ART GALLERY</h1>
        <p>ADMIN DASHBOARD</p>
      </header>

      <div className="admin-container">

        {/* USER PURCHASES */}

        <section className="admin-section orders-section">
          <h2>USER PURCHASES / ORDERS</h2>

          {orders.length === 0 ? (
            <p>No user purchases available.</p>
          ) : (
            orders.map((order, index) => (
              <div className="admin-order" key={order.id || index}>
                <h3>Order {index + 1}</h3>

                <p><b>Artwork:</b> {order.artwork}</p>
                <p><b>Artist:</b> {order.artist}</p>
                <p><b>Price:</b> ₹{order.price}</p>

                <hr />

                <h3>Customer Details</h3>

                <p><b>Name:</b> {order.customerName}</p>
                <p><b>Email:</b> {order.email}</p>
                <p><b>Phone:</b> {order.phone}</p>
                <p><b>Delivery Address:</b> {order.address}</p>
                <p><b>Order ID:</b> {order.id}</p>

                <p>
                  Status:{" "}
                  <span className={getStatusClass(order.status)}>
                    {order.status || "Pending"}
                  </span>
                </p>

                <div className="admin-order-actions">
                  {[
                    "Approved",
                    "Shipped",
                    "Out for Delivery",
                    "Delivered",
                    "Rejected"
                  ].map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrder(index, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* ARTIST PROFILE APPROVAL */}

        <section className="admin-section artists-section">
          <h2>ARTIST PROFILE APPROVAL</h2>

          {artists.length === 0 ? (
            <p>No artist profiles available.</p>
          ) : (
            artists.map((artist, index) => (
              <div className="admin-artist" key={artist.email || index}>
                <h3>Artist Profile {index + 1}</h3>

                {artist.profilePhoto && (
                  <img
                    className="admin-artist-photo"
                    src={artist.profilePhoto}
                    alt={`${artist.name} profile`}
                  />
                )}

                <p><b>Name:</b> {artist.name}</p>
                <p><b>Email:</b> {artist.email}</p>
                <p><b>Phone:</b> {artist.phone}</p>
                <p><b>Specialization:</b> {artist.specialization}</p>
                <p><b>Bio:</b> {artist.bio}</p>

                <div className="admin-upload-review">
                  <h4>Artist Certificates / Awards</h4>

                  {(artist.certificates || []).length === 0 ? (
                    <p>No certificates uploaded.</p>
                  ) : (
                    artist.certificates.map((file, fileIndex) => (
                      <div key={`${file.name}-${fileIndex}`}>
                        <p>{file.name || `Certificate ${fileIndex + 1}`}</p>

                        <button
                          type="button"
                          onClick={() => openUploadedFile(file)}
                        >
                          View Certificate
                        </button>
                      </div>
                    ))
                  )}

                  <h4>Artwork Samples</h4>

                  {(artist.sampleArtworks || []).length === 0 ? (
                    <p>No artwork samples uploaded.</p>
                  ) : (
                    <div className="admin-sample-grid">
                      {artist.sampleArtworks.map((file, fileIndex) => (
                        <div key={`${file.name}-${fileIndex}`}>
                          <img
                            src={file.data}
                            alt={file.name || "Artist sample"}
                          />

                          <p>{file.name}</p>

                          <button
                            type="button"
                            onClick={() => openUploadedFile(file)}
                          >
                            View Artwork
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p>
                  Status:{" "}
                  <span className={getStatusClass(artist.status)}>
                    {artist.status || "Pending"}
                  </span>
                </p>

                <button onClick={() => updateArtist(index, "Approved")}>
                  Approve Artist
                </button>

                <button onClick={() => updateArtist(index, "Rejected")}>
                  Reject Artist
                </button>
              </div>
            ))
          )}
        </section>

      </div>

      <footer className="admin-footer">
        <p>Admin - Online Art Gallery</p>
      </footer>
    </div>
  );
}

export default Admin;
