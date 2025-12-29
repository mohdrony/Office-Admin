import "./home.scss";
import Widget from "../../components/widget/Widget.jsx";

const Home = () => {
  return (
    <div className="homePage">
      <div className="homeContent">
        <div className="widgets">
          <Widget />
          <Widget />
          <Widget />
          <Widget />
        </div>
      </div>
    </div>
  );
};

export default Home;
