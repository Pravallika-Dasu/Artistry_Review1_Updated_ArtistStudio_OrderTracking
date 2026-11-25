import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function registerUser(event) {
        event.preventDefault();
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const normalizedEmail = email.trim().toLowerCase();
        if (users.some((user) => user.email === normalizedEmail)) {
            setError("This email is already registered. Please sign in instead.");
            setMessage("");
            return;
        }
        users.push({ name: name.trim(), email: normalizedEmail, password, phone: "", role: "user" });
        localStorage.setItem("users", JSON.stringify(users));
        setError("");
        setMessage("Your account has been created. Redirecting to sign in...");
        window.setTimeout(() => navigate("/login"), 1000);
    }

    return (
        <main className="auth-page auth-signup-page">
            <section className="auth-visual auth-visual-signup">
                <Link to="/login" className="auth-brand"><span className="auth-brand-mark">A.</span><span>ARTISTRY<small>THE ONLINE ART GALLERY</small></span></Link>
                <div className="auth-visual-copy">
                    <span className="auth-kicker">COLLECT WHAT MOVES YOU</span>
                    <h1>Every artwork<br />has a story.<br /><em>Find yours.</em></h1>
                    <p>Step into a thoughtfully curated world of original art, emerging talent and creative expression.</p>
                </div>
                <span className="auth-image-credit">DISCOVER. CONNECT. COLLECT.</span>
            </section>

            <section className="auth-panel">
                <div className="auth-panel-inner">
                    <div className="auth-mobile-brand"><span className="auth-brand-mark">A.</span><span>ARTISTRY</span></div>
                    <span className="auth-kicker">JOIN OUR COMMUNITY</span>
                    <h2>Create your account</h2>
                    <p className="auth-subtitle">A few details are all it takes to begin exploring.</p>

                    <form className="auth-form" onSubmit={registerUser}>
                        <label htmlFor="signup-name">Full name</label>
                        <input id="signup-name" type="text" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                        <label htmlFor="signup-email">Email address</label>
                        <input id="signup-email" type="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                        <label htmlFor="signup-password">Create password</label>
                        <input id="signup-password" type="password" placeholder="Choose a password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength="6" required />
                        {error && <p className="auth-message auth-error">{error}</p>}
                        {message && <p className="auth-message auth-success">{message}</p>}
                        <button className="auth-submit" type="submit">Create account <span>→</span></button>
                    </form>

                    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
                    <Link className="auth-back-link" to="/home">Explore the gallery <span>↗</span></Link>
                    <p className="auth-legal">By creating an account, you agree to our terms and acknowledge our privacy policy.</p>
                </div>
            </section>
        </main>
    );
}

export default Signup;
