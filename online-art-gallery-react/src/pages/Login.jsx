import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function loginUser(event) {
        event.preventDefault();
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((item) =>
            item.email === email.trim().toLowerCase() && item.password === password
        );

        if (!user) {
            setError("We couldn't find an account with those details. Please try again.");
            return;
        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUserEmail", user.email);
        localStorage.setItem("currentUserName", user.name);
        localStorage.setItem("loggedInRole", user.role === "admin" ? "admin" : "user");
        navigate(user.role === "admin" ? "/admin" : "/home");
    }

    return (
        <main className="auth-page auth-login-page">
            <section className="auth-visual auth-visual-login">
                <Link to="/login" className="auth-brand"><span className="auth-brand-mark">A.</span><span>ARTISTRY<small>THE ONLINE ART GALLERY</small></span></Link>
                <div className="auth-visual-copy">
                    <span className="auth-kicker">A WORLD OF ORIGINALITY</span>
                    <h1>Art is not what you see.<br /><em>It is what you feel.</em></h1>
                    <p>Discover meaningful works, meet the artists behind them, and find a piece that feels like yours.</p>
                </div>
                <span className="auth-image-credit">A CURATED SPACE FOR ART LOVERS</span>
            </section>

            <section className="auth-panel">
                <div className="auth-panel-inner">
                    <div className="auth-mobile-brand"><span className="auth-brand-mark">A.</span><span>ARTISTRY</span></div>
                    <span className="auth-kicker">WELCOME BACK</span>
                    <h2>Sign in to your account</h2>
                    <p className="auth-subtitle">Continue your journey through art and creativity.</p>

                    <form className="auth-form" onSubmit={loginUser}>
                        <label htmlFor="login-email">Email address</label>
                        <input id="login-email" type="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
                        {error && <p className="auth-message auth-error">{error}</p>}
                        <button className="auth-submit" type="submit">Sign in <span>→</span></button>
                    </form>

                    <p className="auth-switch">New to Artistry? <Link to="/signup">Create an account</Link></p>
                    <Link className="auth-back-link" to="/home">Explore the gallery <span>↗</span></Link>
                    <p className="auth-legal">By continuing, you agree to our terms and acknowledge our privacy policy.</p>
                </div>
            </section>
        </main>
    );
}

export default Login;
