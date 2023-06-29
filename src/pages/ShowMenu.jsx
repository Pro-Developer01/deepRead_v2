import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "./Pages.css";
import {
  dynamicBulletHandler,
  getLabelId,
} from "../helperFunctions/getIdeacardIcons";
import highlightTester from "../helperFunctions/highlightTester";

const routes = [
  {
    path: "/",
    name: "Highlights",
    icon: "album",
  },
  {
    path: "/users",
    name: "Idea cards",
    icon: "lightbulb",
    subRoutes: [
      {
        name: "KEYWORDS",
        icon: "vpn_key",
        state: true,
      },
    ],
  },
  {
    path: "/messages",
    name: "Books",
    icon: "menu_book",
  },
  {
    path: "/analytics",
    name: "Tags",
    icon: "tag",
  },
];

const labelIconStyleInitial = {
  backgroundColor: "var(--fontColor)",
  borderRadius: "33px",
  color: "gainsboro",
  padding: "3px",
};
const ShowMenu = () => {
  const [selectState, setSelectState] = useState({
    selectAll: true,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [ideaCardActiveState, setIdeaCardActiveState] = useState(true);
  const [counter, setCounter] = useState(0);
  const [highlightState, setHighlightState] = useState(false);
  const allIcons = JSON.parse(localStorage.getItem("ideacardIcons"));

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
  const collectSelectedIdeas = (data) => {
    const filteredDataTrue = data.filter((item) => item.state === true);
    const filteredDataFalse = data.filter((item) => item.state === false);
    filteredDataTrue.forEach((item) => {
      const liChilds = document.querySelectorAll(`.ideacard-${item.id}`);
      liChilds.forEach((li) => {
        li.classList.remove("d-none");
      });
    });
    filteredDataFalse.forEach((item) => {
      const liChilds = document.querySelectorAll(`.ideacard-${item.id}`);
      liChilds.forEach((li) => {
        li.classList.add("d-none");
      });
    });
  };
  const CardsClicked = (index) => {
    routes[1].subRoutes[index].state = !routes[1].subRoutes[index].state;
    stateCheckerLoop();
    collectSelectedIdeas(routes[1].subRoutes);
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
    collectSelectedIdeas(routes[1].subRoutes);
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
      width: "140px",
      padding: "5px 15px",
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

  //ClickHandlers
  const showMenuClickHandler = (menuItem, id) => {
    if (menuItem === "Highlights" && highlightTester()) {
      const liChilds = document.querySelectorAll(".highlightLi");
      const highlightButton = document.querySelector(`#${id}`);
      setHighlightState(!highlightState);
      if (highlightState) {
        highlightButton.classList.remove("link");
        highlightButton.classList.add("activeState");
      } else {
        highlightButton.classList.add("link");
        highlightButton.classList.remove("activeState");
      }
      for (var i = 0; i < liChilds.length; ++i) {
        let item = liChilds[i].classList;
        if (item) {
          if (highlightState) {
            liChilds[i].classList.remove("d-none");
          } else {
            liChilds[i].classList.add("d-none");
          }
        }
      }
    }
  };

  useEffect(() => {
    const stateFullAllIcons = allIcons?.map((item) => ({
      name: item.label.toLowerCase(),
      icon: item.label,
      state: true,
      id: item._id,
    }));
    routes[1].subRoutes = stateFullAllIcons;

    if (highlightTester()) {
      const highlightButton = document.querySelector(`#Highlights-0`);
      highlightButton.classList.remove("link");
      highlightButton.classList.add("activeState");
    }
  }, []);
  return (
    <div className="NavigationMenu">
      {routes.map((route, index) => {
        if (route.subRoutes?.length) {
          return (
            <>
              <button
                key={index}
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
                    <label for="selectAll" className="checkBoxLabel">
                      Select all
                    </label>
                  </span>
                  {route.subRoutes?.map((item, i) => {
                    return (
                      <button
                        key={i}
                        className={item.state ? "activeState" : "link"}
                        // id={isOpen ? "active" : "activeCollapsible"}
                        onClick={() => CardsClicked(i)}
                      >
                        <AnimatePresence>
                          {/* <span className="material-symbols-outlined">
                            {" "}
                            {item.icon}
                          </span> */}
                          {dynamicBulletHandler(
                            item.icon,
                            "medium",
                            labelIconStyleInitial
                          )}
                          <motion.div
                            variants={showAnimation}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="link_text"
                            style={{ textTransform: "capitalize" }}
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
            id={route.name + "-" + index}
            onClick={() =>
              showMenuClickHandler(route.name, route.name + "-" + index)
            }
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
    </div>
  );
};

export default ShowMenu;
