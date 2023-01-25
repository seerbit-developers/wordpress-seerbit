import React from "react";
import SideNav from "./components/SideNav";
import Content from "./components/Content";
import { useHistory } from "react-router";

const Index = () => {
  let history = useHistory();

  return (
    <div className="page-container py-5">
      <div className="pockets-container">
        <div className="sections">
          <SideNav setTab={(url) => history.push(url)} />
          <Content setTab={(url) => history.push(url)} />
        </div>
      </div>
    </div>
  );
};

export default Index;
