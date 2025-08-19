import React from "react";

export default function Alert({ type = "info", message }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
}
