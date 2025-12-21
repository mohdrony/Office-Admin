import "./projects.scss";

import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import ProjectEconomyRow from "../../components/projectEconomyRow/ProjectEconomyRow.jsx";

import { projectsDummy } from "../../data/projectsDummy.js";

const Projects = () => {
    return (
        <div className="projects">
            <Sidebar/>
            <div className="projectsContainer">
                <Navbar />
                <div className="projectsContent">
                    <div className="projectEconomyRows">
                        {projectsDummy.map((p) => (
                            <ProjectEconomyRow
                                key={p.id} 
                                project={p}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projects;