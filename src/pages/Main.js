import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Main.css';

const Main = () => {
    return (
        <div className="main-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Curiosity Lab</h1>
                    <p className="hero-subtitle">Unleashing innovation through curiosity and cutting-edge technology solutions.</p>
                    <div className="hero-buttons">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/signup" className="btn btn-secondary">Signup</Link>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <h2 className="section-title">Our Services</h2>
                <div className="about-content">
                    <div className="about-card">
                        <div className="about-card-content">
                            <h3 className="about-card-title">Research & Development</h3>
                            <p className="about-card-text">Pushing the boundaries of what's possible through innovative research and development projects.</p>
                        </div>
                    </div>
                    <div className="about-card">
                        <div className="about-card-content">
                            <h3 className="about-card-title">Custom Solutions</h3>
                            <p className="about-card-text">Tailored technological solutions designed to address your unique business challenges.</p>
                        </div>
                    </div>
                    <div className="about-card">
                        <div className="about-card-content">
                            <h3 className="about-card-title">Data Analytics</h3>
                            <p className="about-card-text">Transforming complex data into actionable insights to drive informed decision-making.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <h2 className="section-title">Get In Touch</h2>
                <div className="contact-content">
                    <p className="contact-text">Ready to embark on a journey of innovation? Contact us today to discuss how Curiosity Lab can help transform your ideas into reality.</p>
                    <div className="hero-buttons">
                        <a href="mailto:contact@curiositylab.com" className="btn btn-primary">Contact Us</a>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p className="footer-text">© {new Date().getFullYear()} Curiosity Lab. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Main;