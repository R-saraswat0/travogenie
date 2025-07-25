

import React from "react";
import "./TestimonialCard.css";

const TestimonialCard = React.memo(function TestimonialCard({ name, location, image, rating, text, className }) {
  return (
    <div
      className={`testimonial-card ${className || ""}`}
      style={{
        background: "rgba(30, 36, 50, 0.92)",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(30,36,50,0.10)",
        padding: "2rem 1.5rem 1.5rem",
        color: "#f3f6fa",
        margin: "0 auto",
        maxWidth: 400,
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <img
          src={image}
          alt={name}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: 16,
            border: "2.5px solid #2ECC71",
          }}
        />
        <div>
          <h3 style={{ fontSize: "1.13rem", fontWeight: 700, margin: 0, color: "#fff" }}>{name}</h3>
          <p style={{ fontSize: "0.98rem", color: "#b5c6e0", margin: 0 }}>{location}</p>
        </div>
      </div>
      <div style={{ color: "#FFD700", fontSize: "1.1rem", marginBottom: 2 }}>
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p style={{ fontSize: "1.05rem", color: "#e3eafc", margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
});

export default TestimonialCard;
