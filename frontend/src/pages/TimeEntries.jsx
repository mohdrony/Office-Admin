import { useEffect, useState } from "react";

export default function TimeEntries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/time-entries/")
      .then(res => res.json())
      .then(setEntries);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Time Entries</h1>
      <ul className="space-y-2">
        {entries.map(t => (
          <li key={t.id} className="border p-3 rounded">
            {t.hours}h — {t.date}
          </li>
        ))}
      </ul>
    </>
  );
}
