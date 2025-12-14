import { useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects/")
      .then(res => res.json())
      .then(setProjects);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Projects</h1>
      <ul className="space-y-2">
        {projects.map(p => (
          <li key={p.id} className="border p-3 rounded">
            {p.name}
          </li>
        ))}
      </ul>
    </>
  );
}
