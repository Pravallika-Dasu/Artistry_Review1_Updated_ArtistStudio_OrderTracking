import { useState } from "react";
import { Link } from "react-router-dom";
import "./Artists.css";

function Artists() {

  const artists = [
    {
      name: "Bharti Kher",
      specialization: "Contemporary Art",
      rating: "4.9",
      bio: "Bharti Kher is an Indian contemporary artist known for her paintings and sculptures.",
      image: "artist1.jpg"
    },
    {
      name: "Subodh Gupta",
      specialization: "Sculpture Art",
      rating: "4.8",
      bio: "Subodh Gupta is famous for creating sculptures using everyday stainless steel objects.",
      image: "artist2.jpg"
    },
    {
      name: "Jitish Kallat",
      specialization: "Modern Art",
      rating: "4.7",
      bio: "Jitish Kallat is an Indian artist known for paintings, installations and sculptures.",
      image: "artist3.jpg"
    },
    {
      name: "Raqib Shaw",
      specialization: "Fantasy Painting",
      rating: "4.8",
      bio: "Raqib Shaw is known for his colorful and detailed fantasy-inspired artworks.",
      image: "artist4.jpg"
    },
    {
      name: "Shilpa Gupta",
      specialization: "Interactive Art",
      rating: "4.9",
      bio: "Shilpa Gupta is an Indian contemporary artist known for interactive installations.",
      image: "artist5.jpg"
    }
  ];

  const [selectedArtist, setSelectedArtist] = useState(null);

  function viewProfile(artist) {
    setSelectedArtist(artist);

    setTimeout(() => {
      document.getElementById("artist-profile-box")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);
  }

  return (
    <div className="artists-page">

      <header className="artists-header">
        <h1>Our Artists</h1>
        <p>Meet the talented artists of our gallery</p>

        <Link to="/home" className="artists-home-link">
          Home
        </Link>
      </header>

      <section className="artists-intro">
        <h2>Meet Our Artists</h2>
        <p>Explore the creative minds behind beautiful artworks.</p>
      </section>

      <div className="artist-container">

        {artists.map((artist, index) => (

          <div className="artist-card" key={index}>

            <div className="artist-icon">
              <img
                src={`/images/${artist.image}`}
                alt={artist.name}
              />
            </div>

            <h3>{artist.name}</h3>

            <p>{artist.specialization}</p>

            <p className="artist-rating">
              ★ {artist.rating} / 5
            </p>

            <button onClick={() => viewProfile(artist)}>
              View Profile
            </button>

          </div>

        ))}

      </div>

      {selectedArtist && (

        <div className="artist-profile-box" id="artist-profile-box">

          <h2>{selectedArtist.name}</h2>

          <p>
            Specialization: {selectedArtist.specialization}
          </p>

          <p>
            About: {selectedArtist.bio}
          </p>

          <p>
            Rating: ★ {selectedArtist.rating}
          </p>

          <p>Artist Profile</p>

          <button onClick={() => setSelectedArtist(null)}>
            Close Profile
          </button>

        </div>

      )}

      <footer className="artists-footer">
        <p>© 2026 Online Art Gallery. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default Artists;