import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => (
  <div className="text-center mt-5">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default Loader;
