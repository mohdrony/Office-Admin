import useTimelineVM from "../../viewmodels/useTimelineVM.js";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Project from "../../components/project/Project.jsx"
import TimelineGrid from "../../components/timelineGrid/TimelineGrid.jsx";

import { projectsDummy } from "../../data/projectsDummy.js";

import "./projects.scss";

const Projects = () => {
    const timeline = useTimelineVM();
    return (
        <div className="projectsMain">
            <Sidebar/>
            <div className="projectsContainer">
                <Navbar />
                <div className="content">
                    <div className="projects">
                        <TimelineGrid timeline={timeline}/>
                        <div className="projectsRows">
                            { projectsDummy.map((p) => (
                                <Project 
                                    key={p.id} 
                                    project={p}
                                    visibleStart={timeline.visibleStart}
                                    visibleEnd={timeline.visibleEnd}
                                    colWidth={timeline.colWidth}
                                    colCount={timeline.cols.length} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;

