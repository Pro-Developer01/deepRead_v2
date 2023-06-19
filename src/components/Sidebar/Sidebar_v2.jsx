import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import DrawerModal from "../DrawerModal/DrawerModal";
import { ReactComponent as Logo } from "../../Assets/LogoHalfSvg.svg";
import { ReactComponent as FullLogo } from "../../Assets/logoFullSvg.svg";
import React, { useEffect } from "react";
import NewIdeaButton from "../NewIdea/NewIdeaButton";
import { iconProvider } from "../../helperFunctions/iconProvider";

const views = [
  {
    path: "/",
    name: "List View",
    icon: "FormatListBulletedOutlined",
    state: false,
  },
  {
    path: "/users",
    name: "Tiles View",
    icon: "GridViewOutlined",
    state: false,
  },
  {
    path: "/messages",
    name: "Tree View",
    icon: "AccountTreeOutlined",
    state: false,
  },
  {
    path: "/analytics",
    name: "Node View",
    icon: "HubOutlined",
    state: false,
  },
];
const actions = [
  {
    path: "/",
    name: "Identify idea",
    icon: "Identify_White",
    state: false,
  },
  {
    path: "/users",
    name: "Create idea",
    icon: "TipsAndUpdatesOutlined",
    state: false,
  },
];

const links = [
  {
    path: "/feed",
    name: "Feed",
    icon: "DynamicFeedOutlined",
    state: false,
  },
  {
    path: "/library",
    name: "Library",
    icon: "LibraryBooksOutlined",
    state: false,
  },
  {
    path: "/tags",
    name: "Tags",
    icon: "TagOutlined",
    state: false,
  },
  {
    path: "/ideas",
    name: "Ideas",
    icon: "LightbulbOutlined",
    state: false,
  },
];

const Sidebar_v2 = ({ children }) => {
  const [title, setTitle] = useState(null);
  const [tiggerModal, setTiggerModal] = useState(false);
  const [listOfLinks, setListOfLinks] = useState(links);
  const [listOfViews, setListOfViews] = useState(views);
  const [listOfActions, setListOfActions] = useState(actions);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  useEffect(() => {
    if (!title) setIsOpen(true);
  }, [title]);

  const handleNavigationButtons = (item, i) => {
    const tempList = JSON.parse(JSON.stringify(listOfViews));
    tempList.forEach((item) => {
      item.state = false;
    });
    tempList[i].state = !tempList[i].state;
    setListOfViews(tempList);
    setTitle(item.name);
    setTiggerModal(!tiggerModal);
    setIsOpen(false);
  };
  const handleLinkOpen = (item, i) => {
    const tempList = JSON.parse(JSON.stringify(listOfLinks));
    tempList.forEach((item) => {
      item.state = false;
    });
    tempList[i].state = !tempList[i].state;
    setListOfLinks(tempList);
    navigate(item.path);
  };
  const handleActionsButton = (item, i) => {
    const tempList = JSON.parse(JSON.stringify(listOfActions));
    tempList.forEach((item) => {
      item.state = false;
    });
    tempList[i].state = !tempList[i].state;
    setListOfActions(tempList);
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
        duration: 0.1,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "208px" : "54px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
          style={{ padding: isOpen ? "0 10px 0 5px" : "0" }}
        >
          <div className="sidebarUppper">
            <div className="top_section">
              <AnimatePresence>
                {isOpen ? (
                  <motion.span
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    // className="logo"
                  >
                    <FullLogo />
                  </motion.span>
                ) : (
                  <motion.div
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="logoColapse"
                  >
                    <FullLogo />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* <div className="search">
            <div className="search_icon">
              <BiSearch />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.input
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  type="text"
                  placeholder="Search"
                />
              )}
            </AnimatePresence>
          </div> */}
            {/* <section
              className={
                isOpen ? "routes mainmenu" : "routesCollapsible mainmenu"
              }
            >
              {routes.map((route, index) => {
                if (route.subRoutes) {
                  return (
                    <SidebarMenu
                      setIsOpen={setIsOpen}
                      route={route}
                      showAnimation={showAnimation}
                      isOpen={isOpen}
                    />
                  );
                }

                return (
                  <button
                    key={index}
                    className={isOpen ? "link" : "linkCollapsible"}
                    id={route.state ? "activeMainMenu" : null}
                    onClick={() => handleNavigationButtons(route.name, index)}
                  >
                    <span className="material-symbols-outlined">
                      {" "}
                      {route.icon}
                    </span>
                    <AnimatePresence>
                      {isOpen ? (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text"
                        >
                          {route.name}
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text_collapse"
                        >
                          {route.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </section> */}
          </div>

          {/* // Links  */}

          <div
            className={
              isOpen ? "routes mainmenu" : "routesCollapsible mainmenu"
            }
          >
            {listOfLinks?.map((item, index) => {
              return (
                <button
                  key={index + item.name}
                  className={isOpen ? "link" : "linkCollapsible"}
                  id={item.state ? "activeMainMenu" : null}
                  onClick={() => handleLinkOpen(item, index)}
                >
                  <span className=""> {iconProvider(item.icon)}</span>
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {item.name}
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text_collapse"
                      >
                        {item.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* //views  */}
          <div
            className={
              isOpen ? "routes mainmenu" : "routesCollapsible mainmenu"
            }
          >
            {listOfViews?.map((item, index) => {
              return (
                <button
                  key={index + item.name}
                  className={isOpen ? "link" : "linkCollapsible"}
                  id={item.state ? "activeMainMenu" : null}
                  onClick={() => handleNavigationButtons(item, index)}
                >
                  <span className=""> {iconProvider(item.icon)}</span>
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {item.name}
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text_collapse"
                      >
                        {item.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
          {/* //Action  */}
          <div
            className={
              isOpen ? "routes mainmenu" : "routesCollapsible mainmenu"
            }
          >
            {listOfActions?.map((item, index) => {
              return (
                <button
                  key={index + item.name}
                  className={isOpen ? "link" : "linkCollapsible"}
                  id={item.state ? "activeMainMenu" : null}
                  onClick={() => handleActionsButton(item, index)}
                >
                  <span className=""> {iconProvider(item.icon)}</span>
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {item.name}
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text_collapse"
                      >
                        {item.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
            <div className={isOpen ? "sidebarLower" : "sidebarLowerCollapse"}>
              <div
                className="routes"
                onClick={toggle}
                style={{ width: isOpen ? null : "fit-content" }}
              >
                <button
                  className={isOpen ? "link" : "linkCollapsible"}
                  style={{
                    marginBottom: isOpen ? "5px" : "3px",
                    padding: isOpen ? null : "4px 12px",
                  }}
                >
                  <img
                    src="https://goodmorningimagesforlover.com/wp-content/uploads/2018/09/mehwish-hayat-hot-images.jpg"
                    alt="profile"
                    id="sidebarProfileImg"
                  />
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        Profile
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text_collapse"
                      >
                        Profile
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <div id="barParent" onClick={toggle}>
                <div className="barsContainer">
                  {iconProvider("MenuRounded")}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {title && (
          <div className="sidebarLayer2">
            <DrawerModal title={title} setTitle={setTitle} />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar_v2;
