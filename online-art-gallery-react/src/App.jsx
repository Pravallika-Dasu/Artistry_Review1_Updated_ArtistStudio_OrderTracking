import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Gallery from "./pages/Gallery";
import BuyNow from "./pages/BuyNow";
import Artists from "./pages/Artists";
import Registrations from "./pages/Registrations";
import Exhibitions from "./pages/Exhibitions";
import Auction from "./pages/Auction";
import MyBids from "./pages/MyBids";
import ArtistProfile from "./pages/ArtistProfile";
import Admin from "./pages/Admin";
import Wishlist from "./pages/Wishlist";
import UserProfile from "./pages/UserProfile";
import SiteLayout from "./components/SiteLayout";

const users = JSON.parse(localStorage.getItem("users")) || [];
const adminExists = users.some(user => user.role === "admin");

if (!adminExists) {
    users.push({
        name: "Administrator",
        email: "admin@gmail.com",
        password: "admin123",
        phone: "",
        role: "admin"
    });
    localStorage.setItem("users", JSON.stringify(users));
}

function AdminOnly({ children }) {
    return localStorage.getItem("loggedInRole") === "admin"
        ? children
        : <Navigate to="/login" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<SiteLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/buy-now" element={<BuyNow />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/exhibitions" element={<Exhibitions />} />
                    <Route path="/registrations" element={<Registrations />} />
                    <Route path="/auction" element={<Auction />} />
                    <Route path="/artists" element={<Artists />} />
                    <Route path="/my-bids" element={<MyBids />} />
                    <Route path="/artist-profile" element={<ArtistProfile />} />
                    <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>} />
                </Route>
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
