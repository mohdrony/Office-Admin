import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Widget from "../../components/widget/Widget.jsx"

import "./home.scss"

const Home = () => {
    return (
        <div className="home">
            <Sidebar/>
            <div className="homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget/>
                    <Widget/>
                    <Widget/>
                    <Widget/>
                </div>
            </div>
        </div>
    );
};

export default Home;