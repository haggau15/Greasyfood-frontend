import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/getGreaseData")
      .then((res) => res.json())
      .then((items) => setData(items))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  return (
    <div>
      <h1>Grease Container Items</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;