import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Registrations.css";

function Registrations() {

  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const savedRegistrations =
      JSON.parse(localStorage.getItem("exhibitionRegistrations")) || [];

    const currentEmail = localStorage.getItem("currentUserEmail");

    const userRegistrations = currentEmail
      ? savedRegistrations.filter(reg => reg.email === currentEmail)
      : [];

    setRegistrations(userRegistrations);
  }, []);

  return (
    <div className="registrations-page">

      <header className="registrations-header">

        <div className="registrations-header-content">
          <h1>MY REGISTRATIONS</h1>
          <p>View your registered exhibitions</p>
        </div>

        <div className="registrations-top-links">
          <Link to="/home">Home</Link>
          <span>|</span>
          <Link to="/exhibitions">Exhibitions</Link>
        </div>

      </header>

      <main className="registrations-main">

        <div className="registrations-title">
          <h2>Registered Exhibitions</h2>
          <p>These are the exhibitions you have registered for.</p>
        </div>

        <div className="registration-list">

          {registrations.length === 0 ? (

            <div className="registration-empty">
              <h3>No Registrations Yet</h3>

              <p>
                You have not registered for any exhibition yet.
              </p>

              <p>
                Go to Exhibitions and register for an event.
              </p>

              <Link to="/exhibitions">
                Explore Exhibitions
              </Link>
            </div>

          ) : (

            registrations.map((registration, index) => (

              <div className="registration-card" key={registration.id || index}>

                <h3>{registration.exhibition}</h3>

                <p>
                  <strong>Date:</strong> {registration.date}
                </p>

                <p>
                  <strong>Venue:</strong> {registration.venue}
                </p>

                <p>
                  <strong>Name:</strong> {registration.name}
                </p>

                <p>
                  <strong>Email:</strong> {registration.email}
                </p>

                <p>
                  <strong>Phone:</strong> {registration.phone}
                </p>

                <p>
                  <strong>Registered On:</strong> {registration.registeredOn}
                </p>

                <span className="registered-status">
                  {registration.status || "Registered"}
                </span>

              </div>

            ))

          )}

        </div>

      </main>

      <footer className="registrations-footer">
        <p>Online Art Gallery</p>
        <p>© 2026 Online Art Gallery. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Registrations;