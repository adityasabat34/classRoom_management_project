import React from "react";

const Car = ({ data }) => {
  return (
    <li>
      <h1>Car Details</h1>
      <p>{data.make}</p>
      <p>{data.model}</p>
      <p>{data.year}</p>
      <p>{data.price}</p>
    </li>
  );
};

export default Car;
