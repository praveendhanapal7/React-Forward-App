import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HomePage from "./HomePage";
import Works from "./Works";
import Service from "./Service";
import About from "./About";
import Blog from "./Blog";
import BlogPost from "./BlogPost";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import GetStarted from "./GetStarted";
import GetStartedDetails from "./GetStartedDetails";
import Subscribe from "./Subscribe";
import Contact from "./Contact";
import "./App.css";

function App() {
  return (
    <>
      <Header />

      <Routes>
        < Route path="/" element={<HomePage />} />
        <Route path="/works" element={<Works />} />
        <Route path="/services" element={<Service />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/get-started" element={<GetStartedDetails />} />
        <Route path="/purchase" element={<GetStarted />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
