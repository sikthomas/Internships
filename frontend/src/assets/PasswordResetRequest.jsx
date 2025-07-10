import React, { useState } from "react";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/password_reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("If your email exists in our records, a reset link has been sent.");
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || "An error occurred, please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred, please try again.");
    }
  };

  return (
    <div>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Request Password Reset</button>
      </form>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};

export default PasswordResetRequest; // Ensure export default is here
