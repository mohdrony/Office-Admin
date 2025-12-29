import "./projects.scss";
import ProjectEconomyRow from "../../components/projectEconomyRow/ProjectEconomyRow.jsx";
import { projectsDummy } from "../../data/projectsDummy.js";

const Projects = () => {
  return (
    <div className="projectsPage">
      <div className="projectsContent">
        <div className="projectEconomyRows">
          {projectsDummy.map((p) => (
            <ProjectEconomyRow key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
