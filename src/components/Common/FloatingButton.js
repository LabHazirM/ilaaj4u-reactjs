import React, { Component } from "react";
import { Link } from "react-router-dom";

class FloatingActionButton extends Component {
  render() {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "200px", // Adjust the vertical position from the bottom
          left: "02%", // Center horizontally
          zIndex: 999,
        }}
      >
        <div>
          <Link
            to="/nearby-labs"
            className="btn btn-primary btn-sm"
            style={{
              borderRadius: "50%",
              padding: "10px",
              textDecoration: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              background: "#007bff",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
            }}
          >
            <i className="bx bx-home-circle" style={{ fontSize: "24px" }} />
          </Link>
        </div>
      </div>
    );
  }
}

export default FloatingActionButton;
