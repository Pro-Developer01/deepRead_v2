import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import "./Pages.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";

let routes = [
  {
    path: "/",
    name: "Feed",
    icon: "dynamic_feed",
  },
  {
    path: "/",
    name: "List",
    icon: "format_list_bulleted",
    subRoutes: [
      {
        name: "1st Level:Chapter",
        icon: "playlist_add",
        state: true,
        className: "level-1",
      },
    ],
  },
];

const Template = () => {
  const [selectState, setSelectState] = useState({
    selectAll: true,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [ideaCardActiveState, setIdeaCardActiveState] = useState(true);
  const [counter, setCounter] = useState(0);
  const [hierarchicalState, setHierarchicalState] = useState(false);
  const [tileState, setTileState] = useState(false);
  const [bidirectionalState, setBidirectionalState] = useState(false);
  let levelCount = useSelector((state) => state.levelCounterReducer.value);
  const handleNavigationButtons = (name) => {
    setIsOpen(false);
  };

  const stateCheckerLoop = () => {
    let selectCounter = 0;
    for (let i = 0; i < routes[1].subRoutes.length; i++) {
      if (routes[1].subRoutes[i].state) {
        selectCounter++;
      }
    }

    if (selectCounter) {
      setIdeaCardActiveState(true);
      if (selectCounter < routes[1].subRoutes.length) {
        setSelectState({ ...selectState, selectAll: false });
      }
      if (selectCounter == routes[1].subRoutes.length) {
        setSelectState({ ...selectState, selectAll: true });
      }
    } else {
      setIdeaCardActiveState(false);
      setSelectState({ ...selectState, selectAll: false });
    }
  };
  const bookmarkClicked = () => {
    if (counter === 0) {
      stateCheckerLoop();
      setBookmarkState(true);
      setCounter(1);
    } else if (counter === 1) {
      setBookmarkState(false);
      setCounter(0);
      stateCheckerLoop();
    }
  };
  const collectSelectedLevels = (data) => {
    const filteredDataTrue = data.filter((item) => item.state === true);
    const filteredDataFalse = data.filter((item) => item.state === false);
    filteredDataTrue.forEach((item) => {
      const divChilds = document.querySelectorAll(`.${item.className}`);
      divChilds.forEach((div) => {
        div.classList.remove("d-none");
      });
    });
    filteredDataFalse.forEach((item) => {
      const divChilds = document.querySelectorAll(`.${item.className}`);
      divChilds.forEach((div) => {
        div.classList.add("d-none");
      });
    });
  };
  const selectedList = (index) => {
    routes[1].subRoutes[index].state = !routes[1].subRoutes[index].state;
    stateCheckerLoop();
    collectSelectedLevels(routes[1].subRoutes);
  };

  const selectHandler = () => {
    if (selectState.selectAll) {
      routes[1].subRoutes.forEach((item) => {
        item.state = false;
      });
      setIdeaCardActiveState(false);
      setSelectState({ ...selectState, selectAll: false });
    } else if (!selectState.selectAll) {
      routes[1].subRoutes.forEach((item) => {
        item.state = true;
      });
      setIdeaCardActiveState(true);
      setSelectState({ ...selectState, selectAll: true });
    }
    collectSelectedLevels(routes[1].subRoutes);
  };
  const tagIsClicked = () => {
    setTileState(!tileState);
  };

  const HierarchicalLinkClicked = () => {
    setHierarchicalState(!hierarchicalState);
  };
  const BidirectionalLinkClicked = () => {
    setBidirectionalState(!bidirectionalState);
  };

  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "auto",
      padding: "5px 10px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };
  const levelObjectConstructor = (level) => {
    switch (level) {
      case 1:
        return "1st Level:Chapter";
        break;
      case 2:
        return "2st Level:Sub-Chapter";
        break;
      case 3:
        return "3rd Level:Section";
        break;

      case 4:
        return "4th Level:Sub-Section";
        break;
      case 5:
        return "5th Level:Sub-Sub-Section";
        break;

      default:
        return "nth Level";
    }
  };
  useEffect(() => {
    routes[1].subRoutes = [];
    for (let i = 1; i < levelCount; i++) {
      const obj = {
        name: levelObjectConstructor(i),
        icon: "playlist_add",
        state: true,
        className: `level-${i}`,
      };
      routes[1].subRoutes.push(obj);
    }
  }, [levelCount]);
  return (
    <div className="NavigationMenu">
      {routes.map((route, index) => {
        if (route.subRoutes?.length) {
          return (
            <>
              <button
                className={ideaCardActiveState ? "activeState" : "link"}
                // id={isOpen ? "active" : "activeCollapsible"}
                onClick={bookmarkClicked}
              >
                <AnimatePresence>
                  <span className="material-symbols-outlined">
                    {" "}
                    {route.icon}
                  </span>
                  <motion.div
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="link_text"
                  >
                    {route.name}
                  </motion.div>
                  <span className="material-symbols-outlined" id="arrows">
                    {" "}
                    {!bookmarkState ? "chevron_right" : "expand_more"}
                  </span>
                </AnimatePresence>
              </button>

              {bookmarkState && (
                <div className="radioInputs">
                  <span className={"link selectCheckbox"} id="bookmarPageRadio">
                    <input
                      type="checkBox"
                      id={"selectAll"}
                      name="selectAll"
                      checked={selectState.selectAll}
                      onChange={selectHandler}
                    />
                    <label for="selectAll">Select all</label>
                  </span>
                  {route.subRoutes?.map((item, i) => {
                    return (
                      <button
                        key={i}
                        className={item.state ? "activeState" : "link"}
                        // id={isOpen ? "active" : "activeCollapsible"}
                        onClick={() => selectedList(i)}
                      >
                        <AnimatePresence>
                          <span className="material-symbols-outlined">
                            {" "}
                            {item.icon}
                          </span>
                          <motion.div
                            variants={showAnimation}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="link_text"
                          >
                            {item.name}
                          </motion.div>
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          );
        }

        return (
          <button
            key={index}
            className={isOpen ? "linkCollapsible" : "link"}
            // id={isOpen ? "active" : "activeCollapsible"}
            onClick={() => handleNavigationButtons(route.name)}
          >
            <AnimatePresence>
              <span className="material-symbols-outlined"> {route.icon}</span>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="link_text"
              >
                {route.name}
              </motion.div>
            </AnimatePresence>
          </button>
        );
      })}

      {/* //Tiles */}
      <button
        className={tileState ? "activeState" : "link"}
        // id={isOpen ? "active" : "activeCollapsible"}
        onClick={() => tagIsClicked()}
      >
        <AnimatePresence>
          <span className="material-symbols-outlined">grid_view</span>
          <motion.div
            variants={showAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="link_text"
          >
            Tiles
          </motion.div>
          <span className="material-symbols-outlined" id="arrows">
            {" "}
            {!tileState ? "chevron_right" : "expand_more"}
          </span>
        </AnimatePresence>
      </button>

      {tileState && (
        <div className="dynamicSelectContainer" style={{ marginTop: "-10px" }}>
          <AnimatePresence>
            <div className="dynamicSelectLabel">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                {" "}
                check_box_outline_blank
              </span>
              <label htmlFor="Boxes">Boxes: </label>
            </div>
            <motion.div
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="dynamicSelect"
            >
              <select name="Boxes" id="Boxes">
                <option value="Chapter">Chapter</option>
                <option id="sxy" value="Sub-Chapter">
                  Sub-Chapter
                </option>
                <option value="Section">Section</option>
                <option value="Sub-Section">Sub-Section</option>
                <option value="off">off</option>
              </select>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* //Hierarchial  */}
      <button
        className={hierarchicalState ? "activeState" : "link"}
        // id={isOpen ? "active" : "activeCollapsible"}
        onClick={() => HierarchicalLinkClicked()}
      >
        <AnimatePresence>
          <span className="material-symbols-outlined">device_hub</span>
          <motion.div
            variants={showAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="link_text"
          >
            Hierarchical links
          </motion.div>
          <span className="material-symbols-outlined" id="arrows">
            {" "}
            {!hierarchicalState ? "chevron_right" : "expand_more"}
          </span>
        </AnimatePresence>
      </button>

      {hierarchicalState && (
        <div className="dynamicSelectContainer" style={{ marginTop: "-10px" }}>
          <AnimatePresence>
            <div className="dynamicSelectLabel">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                {" "}
                link
              </span>
              <label htmlFor="links"># of links: </label>
            </div>
            <motion.div
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="dynamicSelect"
            >
              <select name="links" id="links">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="all">all</option>
              </select>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {/* //Bidirectional  */}
      <button
        className={bidirectionalState ? "activeState" : "link"}
        // id={isOpen ? "active" : "activeCollapsible"}
        onClick={() => BidirectionalLinkClicked()}
      >
        <AnimatePresence>
          <span className="material-symbols-outlined">share</span>
          <motion.div
            variants={showAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="link_text"
          >
            Bidirectional links
          </motion.div>
          <span className="material-symbols-outlined" id="arrows">
            {" "}
            {!bidirectionalState ? "chevron_right" : "expand_more"}
          </span>
        </AnimatePresence>
      </button>

      {bidirectionalState && (
        <>
          <div
            className="dynamicSelectContainer"
            style={{ marginTop: "-10px" }}
          >
            <AnimatePresence>
              <div className="dynamicSelectLabel">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  {" "}
                  link
                </span>
                <label htmlFor="links2"># of links: </label>
              </div>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="dynamicSelect"
              >
                <select name="links2" id="links2">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="all">all</option>
                </select>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="dynamicSelectContainer">
            <AnimatePresence>
              <div className="dynamicSelectLabel">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  {" "}
                  trending_flat
                </span>
                <label htmlFor="xAxis">X-axis: </label>
              </div>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="dynamicSelect"
              >
                <select name="xAxis" id="xAxis">
                  <option value="ViewCount">View count</option>
                  <option value="EditCount">Edit count</option>
                  <option value="ViewDate">View date</option>
                  <option value="EditDate">Edit date</option>
                  <option value="off">off</option>
                </select>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="dynamicSelectContainer">
            <AnimatePresence>
              <div className="dynamicSelectLabel">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  {" "}
                  straight
                </span>
                <label htmlFor="yAxis">Y-axis: </label>
              </div>
              <motion.div
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="dynamicSelect"
              >
                <select name="yAxis" id="yAxis">
                  <option value="ViewCount">View count</option>
                  <option value="EditCount">Edit count</option>
                  <option value="ViewDate">View date</option>
                  <option value="EditDate">Edit date</option>
                  <option value="off">off</option>
                </select>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default Template;
