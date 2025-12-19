import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Project from "../../components/project/Project.jsx"

import "./projects.scss"

const Projects = () => {
    return (
        <div className="projectsMain">
            <Sidebar/>
            <div className="projectsContainer">
                <Navbar />
                <div className="projects">
                    <Project/>
                    <Project/>
                    <Project/>
                    <Project/>
                </div>
            </div>
        </div>
    );
};

export default Projects;

