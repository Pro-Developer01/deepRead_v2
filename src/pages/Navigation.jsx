import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "./Pages.css";
import { Link } from "react-router-dom";

const routes = [
  {
    path: "/",
    name: "Feed",
    icon: "dynamic_feed",
  },
  {
    path: "/users",
    name: "My previous session",
    icon: "skip_previous",
  },
  {
    path: "/messages",
    name: "My current book",
    icon: "local_library",
  },
  {
    path: "/library",
    name: "My library",
    icon: "library_books",
  },
  {
    path: "/file-manager",
    name: "My bookmarks",
    icon: "bookmarks",
    subRoutes: [
      {
        name: "Page1",
        state: false,
      },
      {
        name: "Page2",
        state: false,
      },
      {
        name: "Page3",
        state: false,
      },
      {
        name: "Page4",
        state: false,
      },
      {
        name: "Page5",
        state: false,
      },
    ],
  },
];

const Navigation = () => {
  const [flag, setFlag] = useState(null);
  const [bookMarkItemSelect, setbookMarkItemSelect] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const handleNavigationButtons = (name) => {
    setIsOpen(false);
  };
  const bookmarkClicked = () => {
    if (counter === 0) {
      routes[4].subRoutes.forEach((item) => {
        if (item.state) setbookMarkItemSelect(true);
      });
      setBookmarkState(true);
      setCounter(1);
    } else if (counter === 1) {
      setFlag(!flag);
      setbookMarkItemSelect(false);
      setBookmarkState(false);
      setCounter(0);
    }
  };
  const radioInputHandler = (i) => {
    routes[4].subRoutes.forEach((item) => {
      item.state = false;
    });
    routes[4].subRoutes[i].state = !routes[4].subRoutes[i].state;
    setFlag(!flag);
    setbookMarkItemSelect(true);
    console.log("data", routes[4].subRoutes[i]);
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
  return (
    <div className="NavigationMenu">
      {routes.map((route, index) => {
        if (route.subRoutes?.length) {
          return (
            <>
              <button
                key={index}
                className={bookMarkItemSelect ? "activeState" : "link"}
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
                  {route.subRoutes?.map((item, i) => {
                    return (
                      <>
                        <span
                          className={item.state ? "activeState" : "link"}
                          id="bookmarPageRadio"
                          onClick={() => radioInputHandler(i)}
                        >
                          <input
                            type="radio"
                            id={item.name}
                            name="bookmarPage"
                            value={item.name}
                            // {item.state?checked:checked}
                            checked={item.state}
                          />
                          <label for={item.name}>{item.name}</label>
                        </span>
                      </>
                    );
                  })}
                </div>
              )}
            </>
          );
        }

        return (
          <Link to={route.path}>
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
          </Link>
        );
      })}
    </div>
  );
};

export default Navigation;
