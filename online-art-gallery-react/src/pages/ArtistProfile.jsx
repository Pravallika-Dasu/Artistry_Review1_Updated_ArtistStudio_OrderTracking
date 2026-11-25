import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ArtistProfile.css";

function ArtistProfile() {

  const email = localStorage.getItem("currentUserEmail");

  const [artist, setArtist] = useState(null);
  const [approved, setApproved] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: localStorage.getItem("currentUserName") || "",
    email: email || "",
    phone: "",
    specialization: "",
    bio: ""
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [sampleArtworks, setSampleArtworks] = useState([]);

  const [artworkForm, setArtworkForm] = useState({
    title: "",
    category: "",
    price: "",
    description: ""
  });

  function loadData() {
    const artists =
      JSON.parse(localStorage.getItem("artistProfiles")) || [];

    const current = artists.find(a => a.email === email);

    setArtist(current || null);
    setApproved(current?.status === "Approved");

    const allArtworks =
      JSON.parse(localStorage.getItem("artistArtworks")) || [];

    setArtworks(
      allArtworks.filter(a => a.artistEmail === email)
    );

    if (current) {
      setForm({
        name: current.name,
        email: current.email,
        phone: current.phone,
        specialization: current.specialization,
        bio: current.bio
      });
      setProfilePhoto(current.profilePhoto || null);
      setCertificates(current.certificates || []);
      setSampleArtworks(current.sampleArtworks || []);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function createProfile(e) {
    e.preventDefault();

    const artists =
      JSON.parse(localStorage.getItem("artistProfiles")) || [];

    if (artists.some(a => a.email === form.email.trim())) {
      setMessage("Artist profile already exists.");
      return;
    }

    const photoFile = e.target.profilePhoto.files[0];
    const certificateFiles = Array.from(e.target.certificates.files || []);
    const sampleFiles = Array.from(e.target.sampleArtworks.files || []);

    if (!photoFile || certificateFiles.length === 0) {
      setMessage("Please upload a profile photo and at least one certificate.");
      return;
    }

    const files = [photoFile, ...certificateFiles, ...sampleFiles];
    if (files.some(file => file.size > 2 * 1024 * 1024) || files.reduce((total, file) => total + file.size, 0) > 3 * 1024 * 1024) {
      setMessage("Each file must be under 2 MB and all uploads together must be under 3 MB.");
      return;
    }

    const readFile = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    Promise.all(files.map(readFile)).then(uploadedFiles => {
      const newArtist = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        profilePhoto: uploadedFiles[0].data,
        certificates: uploadedFiles.slice(1, 1 + certificateFiles.length),
        sampleArtworks: uploadedFiles.slice(1 + certificateFiles.length),
        status: "Pending"
      };

      artists.push(newArtist);
      localStorage.setItem("artistProfiles", JSON.stringify(artists));
      localStorage.setItem("currentArtistEmail", newArtist.email);
      setMessage("Artist application submitted successfully. Waiting for admin approval.");
      loadData();
    }).catch(() => setMessage("Unable to read the selected files. Please try again."));

  }

  function uploadArtwork(e) {
    e.preventDefault();

    if (!approved) {
      setUploadMessage("Your artist profile is not approved yet.");
      return;
    }

    const imageFile = e.target.image.files[0];

    if (!imageFile) {
      setUploadMessage("Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      const allArtworks =
        JSON.parse(localStorage.getItem("artistArtworks")) || [];

      const newArtwork = {
        ...artworkForm,
        image: reader.result,
        artist: artist.name,
        artistEmail: email
      };

      allArtworks.push(newArtwork);

      localStorage.setItem(
        "artistArtworks",
        JSON.stringify(allArtworks)
      );

      setUploadMessage("Artwork uploaded successfully!");

      setArtworkForm({
        title: "",
        category: "",
        price: "",
        description: ""
      });

      e.target.reset();
      loadData();
    };

    reader.readAsDataURL(imageFile);
  }

  function saveProfile(e) {
    e.preventDefault();

    const artists =
      JSON.parse(localStorage.getItem("artistProfiles")) || [];

    const index = artists.findIndex(a => a.email === email);

    if (index === -1) return;

    artists[index] = {
      ...artists[index],
      name: form.name,
      phone: form.phone,
      specialization: form.specialization,
      bio: form.bio
    };

    localStorage.setItem(
      "artistProfiles",
      JSON.stringify(artists)
    );

    setEditMode(false);
    setMessage("Profile updated successfully!");
    loadData();
  }

  const categories = [
    ...new Set(artworks.map(a => a.category))
  ];

  const allOrders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const orderCount = allOrders.filter(order =>
    artworks.some(a => a.title === order.artwork)
  ).length;

  const allBids =
    JSON.parse(localStorage.getItem("auctionBids")) || [];

  const biddingCount = allBids.filter(bid =>
    artworks.some(a => a.title === bid.artwork)
  ).length;

  return (
    <div className="artist-profile-page">

      <header className="ap-header">

        <div className="ap-logo">
          <Link to="/home">
            <h2>ART GALLERY</h2>
          </Link>
        </div>

        <div className="ap-links">
          <Link to="/home">Home</Link>
          {" | "}
          <button onClick={() => setShowProfile(true)}>
            My Profile
          </button>
          {" | "}
          <Link to="/login">Logout</Link>
        </div>

      </header>

      {!artist && (

        <section className="ap-create">

          <h1>CREATE ARTIST PROFILE</h1>

          <p>
            Create your artist profile and request permission
            to upload artworks.
          </p>

          <form className="ap-form" onSubmit={createProfile}>

            <input
              name="name"
              placeholder="Enter Artist Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Enter Email"
              value={form.email}
              readOnly
              required
            />

            <input
              name="phone"
              placeholder="Enter Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              name="specialization"
              placeholder="Enter Art Specialization"
              value={form.specialization}
              onChange={handleChange}
              required
            />

            <textarea
              name="bio"
              placeholder="Write about yourself and your artwork"
              value={form.bio}
              onChange={handleChange}
              required
            />

            <label className="ap-file-label">Artist Profile Photo</label>
            <input name="profilePhoto" type="file" accept="image/png,image/jpeg,image/webp" required />

            <label className="ap-file-label">Certificates / Awards (select one or more)</label>
            <input name="certificates" type="file" accept="image/*,.pdf" multiple required />

            <label className="ap-file-label">Artwork Samples (optional)</label>
            <input name="sampleArtworks" type="file" accept="image/*" multiple />
            <small className="ap-upload-hint">Maximum 2 MB per file and 3 MB total. JPG, PNG and PDF certificates are supported.</small>

            <button type="submit">
              Submit Artist Profile
            </button>

            <p className="ap-message">{message}</p>

          </form>

        </section>

      )}

      {artist && (

        <section className="ap-create">

          <h1>ARTIST PROFILE STATUS</h1>

          {artist.profilePhoto && <img className="ap-submitted-photo" src={artist.profilePhoto} alt={`${artist.name} profile`} />}
          <h2>{artist.name}</h2>

          <p>Email: {artist.email}</p>
          <p>Specialization: {artist.specialization}</p>
          <p>Certificates submitted: {(artist.certificates || []).length}</p>
          <p>Artwork samples submitted: {(artist.sampleArtworks || []).length}</p>

          <h3>
            Status: {artist.status}
          </h3>

          {artist.status === "Pending" && (
            <p>
              Waiting for admin approval. You can upload
              artworks after approval.
            </p>
          )}

          {artist.status === "Rejected" && (
            <p>Your profile was rejected. Please contact admin.</p>
          )}

        </section>

      )}

      {approved && (

        <section className="ap-upload">

          <h2>UPLOAD ARTWORK</h2>

          <p>
            Your artist profile is approved.
            You can upload your artworks.
          </p>

          <form className="ap-upload-box" onSubmit={uploadArtwork}>

            <input
              placeholder="Enter Artwork Title"
              value={artworkForm.title}
              onChange={e =>
                setArtworkForm({
                  ...artworkForm,
                  title: e.target.value
                })
              }
              required
            />

            <input
              placeholder="Enter Artwork Category"
              value={artworkForm.category}
              onChange={e =>
                setArtworkForm({
                  ...artworkForm,
                  category: e.target.value
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Enter Artwork Price"
              value={artworkForm.price}
              onChange={e =>
                setArtworkForm({
                  ...artworkForm,
                  price: e.target.value
                })
              }
              required
            />

            <textarea
              placeholder="Write about your artwork"
              value={artworkForm.description}
              onChange={e =>
                setArtworkForm({
                  ...artworkForm,
                  description: e.target.value
                })
              }
              required
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              required
            />

            <button type="submit">
              Upload Artwork
            </button>

            <p className="ap-message">{uploadMessage}</p>

          </form>

        </section>

      )}

      <section className="ap-artworks">

        <h2>MY UPLOADED ARTWORKS</h2>

        <div className="ap-artwork-list">

          {artworks.length === 0 ? (

            <p className="ap-empty">
              No artworks uploaded yet.
            </p>

          ) : (

            artworks.map((art, index) => (

              <div className="ap-artwork-card" key={index}>

                <img src={art.image} alt={art.title} />

                <h3>{art.title}</h3>

                <p>Category: {art.category}</p>

                <p>Price: ₹{art.price}</p>

              </div>

            ))

          )}

        </div>

      </section>

      <section className="ap-stats">

        <h2>MY ARTWORK DETAILS</h2>

        <div className="ap-stat-grid">

          <div>
            <h3>Paintings Uploaded</h3>
            <p>{artworks.length}</p>
          </div>

          <div>
            <h3>Orders</h3>
            <p>{orderCount}</p>
          </div>

          <div>
            <h3>Rating</h3>
            <p>No ratings</p>
          </div>

          <div>
            <h3>Reviews</h3>
            <p>0</p>
          </div>

          <div>
            <h3>Bidding</h3>
            <p>{biddingCount}</p>
          </div>

          <div>
            <h3>Artwork Types</h3>
            <p>{categories.join(", ") || "-"}</p>
          </div>

        </div>

      </section>

      {showProfile && artist && (

        <div
          className="ap-overlay"
          onClick={() => setShowProfile(false)}
        >

          <div
            className="ap-panel"
            onClick={e => e.stopPropagation()}
          >

            <div className="ap-panel-header">

              <h2>MY ARTIST PROFILE</h2>

              <button onClick={() => setShowProfile(false)}>
                ×
              </button>

            </div>

            {!editMode ? (

              <div className="ap-profile-content">

                <div className="ap-avatar">
                  {artist.name.charAt(0).toUpperCase()}
                </div>

                <h2>{artist.name}</h2>

                <p>Email: {artist.email}</p>
                <p>Phone: {artist.phone}</p>
                <p>Specialization: {artist.specialization}</p>

                <div className="ap-profile-stats">
                  <p>Paintings: {artworks.length}</p>
                  <p>Artwork Types: {categories.join(", ") || "-"}</p>
                  <p>Rating: No ratings</p>
                  <p>Orders: {orderCount}</p>
                </div>

                <div className="ap-about">
                  <h3>About Artist</h3>
                  <p>{artist.bio}</p>
                </div>

                <button onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>

              </div>

            ) : (

              <form className="ap-edit-form" onSubmit={saveProfile}>

                <h3>Edit Artist Profile</h3>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <input
                  value={form.email}
                  disabled
                />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                <input
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                />

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                />

                <button type="submit">Save</button>

                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>

              </form>

            )}

          </div>

        </div>

      )}

      <footer className="ap-footer">

        <div>
          <h3>About Us</h3>
          <p>Online Art Gallery provides a platform to explore and showcase artworks.</p>
        </div>

        <div>
          <h3>Contact</h3>
          <p>Email: onlineartgallery@gmail.com</p>
        </div>

        <p>© 2026 Online Art Gallery. All rights reserved.</p>

      </footer>

    </div>
  );
}

export default ArtistProfile;