import React from "react";
import "./DrawerModal.css";
import ListView from "../../pages/ListView";
import TilesViewMenu from "../../pages/TilesViewMenu";

export default function DrawerModal({ title, setTitle }) {
  const closeHandle = () => {
    setTitle(null);
  };
  const NavigationHandler = (title) => {
    switch (title) {
      case "List View":
        // code block
        return <ListView />;
      case "Tiles View":
        // code block
        return <TilesViewMenu />;
      default:
        return <span>Please Select Proper tab</span>;
    }
  };
  return (
    <div className="DrawerModalParent">
      <div className="headingSection">
        <span id="heading">{title}</span>
        <span
          className="material-symbols-outlined"
          onClick={closeHandle}
          style={{ cursor: "pointer", color: "#717171" }}
        >
          {" "}
          close
        </span>
      </div>
      <div className="contentsection">{NavigationHandler(title)}</div>
    </div>
  );
}
