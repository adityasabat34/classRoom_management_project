import React, { useState } from "react";
import Car from "../components/Car";
import { useEffect } from "react";

export const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));
  }, []);
  console.log(data);
  return (
    <div>
      <ul>
        {data.map((car) => (
          <Car key={car.id} data={car} />
        ))}
      </ul>
    </div>
  );
};

export default App;
