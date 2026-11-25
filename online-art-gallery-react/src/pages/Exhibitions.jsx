import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Exhibitions.css";

function Exhibitions() {
  const navigate = useNavigate();

  const exhibitions = [
    {
      name: "Modern Art Exhibition",
      description: "Explore creative and modern artworks from talented artists.",
      date: "20 April 2026",
      venue: "Online Art Gallery Hall",
      time: "10:00 AM - 5:00 PM"
    },
    {
      name: "Nature & Life Exhibition",
      description: "A collection of beautiful artworks inspired by nature and life.",
      date: "5 May 2026",
      venue: "Online Art Gallery Hall",
      time: "11:00 AM - 6:00 PM"
    },
    {
      name: "Traditional Art Exhibition",
      description: "Experience traditional paintings and cultural artwork from different artists.",
      date: "18 May 2026",
      venue: "Online Art Gallery Hall",
      time: "10:00 AM - 4:00 PM"
    },
    {
      name: "Abstract Art Exhibition",
      description: "Explore unique abstract paintings created by emerging artists.",
      date: "2 June 2026",
      venue: "Online Art Gallery Hall",
      time: "11:00 AM - 5:00 PM"
    }
  ];

  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

  function openRegistration(exhibition) {
    const currentEmail = localStorage.getItem("currentUserEmail");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === currentEmail);

    setSelectedExhibition(exhibition);
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setMessage("");
  }

  function closeRegistration() {
    setSelectedExhibition(null);
  }

  function submitRegistration() {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setMessage("Please enter your name.");
      setMessageColor("red");
      return;
    }

    if (!cleanEmail) {
      setMessage("Please enter your email.");
      setMessageColor("red");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setMessage("Please enter a valid email.");
      setMessageColor("red");
      return;
    }

    if (!cleanPhone) {
      setMessage("Please enter your phone number.");
      setMessageColor("red");
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      setMessage("Please enter a valid 10-digit phone number.");
      setMessageColor("red");
      return;
    }

    const registrations =
      JSON.parse(localStorage.getItem("exhibitionRegistrations")) || [];

    const alreadyRegistered = registrations.some(
      reg =>
        reg.email === cleanEmail &&
        reg.exhibition === selectedExhibition.name
    );

    if (alreadyRegistered) {
      setMessage("You are already registered for this exhibition.");
      setMessageColor("red");
      return;
    }

    const registration = {
      id: Date.now(),
      exhibition: selectedExhibition.name,
      date: selectedExhibition.date,
      venue: selectedExhibition.venue,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      status: "Registered",
      registeredOn: new Date().toLocaleString()
    };

    registrations.push(registration);

    localStorage.setItem(
      "exhibitionRegistrations",
      JSON.stringify(registrations)
    );

    setMessage("Registration successful!");
    setMessageColor("green");

    setTimeout(() => {
      navigate("/registrations");
    }, 800);
  }

  return (
    <div className="exhibitions-page">

      <header className="exhibitions-header">

        <div className="exhibitions-header-content">
          <h1>ART EXHIBITIONS</h1>
          <p>Discover and participate in upcoming art exhibitions</p>
        </div>

        <div className="exhibitions-top-links">
          <Link to="/home">Home</Link>
          <span>|</span>
          <Link to="/registrations">My Registrations</Link>
        </div>

      </header>

      <main className="exhibitions-main">

        <div className="exhibitions-intro">
          <h2>Upcoming Exhibitions</h2>
          <p>
            Register for an exhibition and view your registrations
            anytime from My Registrations.
          </p>
        </div>

        <div className="exhibitions-grid">

          {exhibitions.map((exhibition, index) => (

            <div className="exhibition-card" key={index}>

              <h2>{exhibition.name}</h2>

              <p>{exhibition.description}</p>

              <p className="exhibition-date">
                Date: {exhibition.date}
              </p>

              <p>Venue: {exhibition.venue}</p>

              <p>Time: {exhibition.time}</p>

              <span className="exhibition-status">
                Registration Open
              </span>

              <br />

              <button
                className="exhibition-register-button"
                onClick={() => openRegistration(exhibition)}
              >
                Register Now
              </button>

            </div>

          ))}

        </div>

      </main>

      {selectedExhibition && (

        <div className="exhibition-modal">

          <div className="exhibition-modal-box">

            <h2>Exhibition Registration</h2>

            <p>
              <strong>{selectedExhibition.name}</strong>
              <br />
              Date: {selectedExhibition.date}
              <br />
              Venue: {selectedExhibition.venue}
            </p>

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />

            <div className="exhibition-modal-buttons">

              <button
                className="exhibition-submit-button"
                onClick={submitRegistration}
              >
                Confirm Registration
              </button>

              <button
                className="exhibition-cancel-button"
                onClick={closeRegistration}
              >
                Cancel
              </button>

            </div>

            {message && (
              <p style={{ color: messageColor }}>
                {message}
              </p>
            )}

          </div>

        </div>

      )}

      <footer className="exhibitions-footer">
        <p>Online Art Gallery</p>
        <p>© 2026 Online Art Gallery. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Exhibitions;