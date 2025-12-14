import { useEffect, useState } from "react";

export default function People() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/people/")
      .then(res => res.json())
      .then(setPeople);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">People</h1>
      <ul className="space-y-2">
        {people.map(p => (
          <li key={p.id} className="border p-3 rounded">
            {p.first_name} {p.last_name}
          </li>
        ))}
      </ul>
    </>
  );
}
