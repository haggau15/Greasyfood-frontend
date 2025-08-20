import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemsList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("items").then(res => setItems(res.data));
  }, []);

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}