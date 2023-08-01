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

import Drawer from "@mui/material/Drawer";
import CreateIdeaCardPage from "../../pages/CreateIdeaCardPage/CreateIdeaCardPage";
import IdeaCardPage from "../../pages/IdeacardPage/IdeaCardPage";
import Filter from "../../pages/Filter";
import highlightTester from "../../helperFunctions/highlightTester";
import { useSelector, useDispatch } from "react-redux";
import { updateIdeacardData } from "../../Utils/Features/IdeacardSlice";
import { getLabelId } from "../../helperFunctions/getIdeacardIcons";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateIdentifyIdeaCardData } from "../../Utils/Features/IdentifyIdeaCardSlice";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Identify from "../../Assets/Identify";
import Identify_White from "../../Assets/Identify_White";
import Marker from "../../Assets/Marker";
import { urlChecker, urlViewFilter } from "../../helperFunctions/urlChecker";

const clossDoubleArrowStyle = {
  background: "var(--white)",
  borderRadius: "33px",
  border: "1px solid var(--borderColors)",
  position: "relative",
  top: "-3px",
  right: "-0.5rem",
  cursor: "pointer",
  color: "var(--fontColor)",
};
const closeCrossButtonStyle = {
  borderRadius: "33px",
  position: "fixed",
  top: "34px",
  right: "11px",
  zIndex: 13,
  cursor: "pointer",
  color: "var(--fontColor)",
};

const views = [
  {
    linkText: "listview",
    name: "List View",
    icon: "FormatListBulletedOutlined",
    state: false,
  },
  {
    linkText: "tileview",
    name: "Tiles View",
    icon: "GridViewOutlined",
    state: false,
  },
  {
    linkText: "treeview",
    name: "Tree View",
    icon: "AccountTreeOutlined",
    state: false,
  },
  {
    linkText: "nodeview",
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
    linkText: "feed",
    name: "Feed",
    icon: "DynamicFeedOutlined",
    state: false,
  },
  {
    path: "/library",
    name: "Library",
    linkText: "library",
    icon: "LibraryBooksOutlined",
    state: false,
  },
  {
    path: "/tags",
    name: "Tags",
    linkText: "tags",
    icon: "TagOutlined",
    state: false,
  },
  {
    path: "/ideas",
    name: "Ideas",
    linkText: "ideas",
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
  const [baseUrl, setBaseUrl] = useState(window.location.pathname + '/');
  const [activeActionButton, setActiveActionButton] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [buttonState, setButtonState] = React.useState(null);
  const [count, setCount] = React.useState(false);

  const IdentifyIdeaCardData = useSelector(
    (state) => state.IdentifyIdeaCardReducer.value
  );
  const dispatch = useDispatch();
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
    const baseUrl = urlViewFilter()
    if (baseUrl.length > 1) {
      navigate(urlViewFilter() + '/' + item.linkText)
    }
    else {
      navigate('/' + item.linkText)
    }

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
    clickHandler(item.name);
    setListOfActions(tempList);
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

  const setCursorClass = () => {
    const allItems = document.querySelectorAll(".highlightLi");
    const dashboard = document.querySelector("#dashboard");
    dashboard.classList.add("cursoreChangeAll");
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].classList.add("customCursor");
      allItems[i].children[0].children[1].classList.add("customCursor");
    }
  };

  const removeCursorClass = () => {
    const allItems = document.querySelectorAll(".highlightLi");
    const dashboard = document.querySelector("#dashboard");
    dashboard.classList.remove("cursoreChangeAll");
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].classList.remove("customCursor");
      allItems[i].children[0].children[1].classList.remove("customCursor");
    }
  };
  const handleTextPopup = (event) => {
    const selection = window.getSelection().toString().trim();
    if (selection !== "") {
      const popup = document.createElement("div");
      popup.className = "popup";
      popup.textContent = "Press ENTER to Create Ideacard";
      document.body.appendChild(popup);

      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();
      popup.style.top = `${rect.bottom - 53}px`;
      popup.style.left = (rect.left + rect.right) / 2 - 88 + "px";
    }
  };
  const removePopup = () => {
    const popupElement = document.querySelector(".popup");
    popupElement?.parentNode.removeChild(popupElement);
  };
  const handleEnter = (event) => {
    if (event.keyCode === 13 && window.getSelection().toString().length > 0) {
      console.log("Enter is pressed");
      identifyICCreater();
      removePopup();
    }
  };
  const handleEscGlobal = (event) => {
    if (event.keyCode === 27) {
      // esc clicked
      if (!count) {
        console.log("count first", count);
        setButtonState(false);
        // setopenOptions(false);
      } else {
        console.log("count else", count);
        window.getSelection().removeAllRanges();
      }
    }
  };

  const identifyICCreater = () => {
    const userId = localStorage.getItem("userId");
    const selection = window.getSelection();
    const title = selection.toString();
    const itemSelf = selection.anchorNode.parentElement;
    const start = itemSelf.dataset.start;
    const book_id = itemSelf.dataset.book_id;
    const highlight_id = selection.anchorNode.parentElement.id;
    const ideacardObj = {
      book_id,
      label_id: getLabelId("KEYWORDS"),
      highlight_id,
      title,
      start,
      user_id: userId,
      my_notes: [],
      picture_link: "",
      rating: 0,
      tags: [],
      level: 0,
      end: null,
    };
    if (highlight_id.length && start.length) {
      removeCursorClass();
      dispatch(updateIdentifyIdeaCardData(ideacardObj));
      dispatch(updatePersistentDrawer("identify Ideacard"));
      window.removeEventListener("keydown", handleEnter);
      window.removeEventListener("mouseup", handleTextPopup);
      window.removeEventListener("mousedown", removePopup);
      console.log("selectedText", ideacardObj);
    }
  };

  const clickHandler = (type) => {
    if (type === buttonState) {
      setButtonState(null);
    } else {
      setButtonState(type);
    }
  };

  const buttonStateHandler = () => {
    //this func will run after clickhandler
    if (buttonState) {
      if (buttonState === "Create idea") {
        setOpen(true);
      } else if (buttonState === "Identify idea") {
        setCount(true);
        window.addEventListener("keydown", handleEnter);
        window.addEventListener("mouseup", handleTextPopup);
        window.addEventListener("mousedown", removePopup);
        setCursorClass();
        setOpen(false);
      }
    } else {
      console.log("buttonState null runned", buttonState);
      dispatch(updatePersistentDrawer(null));
      dispatch(updateIdentifyIdeaCardData(null));
      removeCursorClass();
      removePopup();
      window.removeEventListener("keydown", handleEnter);
      window.removeEventListener("mouseup", handleTextPopup);
      window.removeEventListener("mousedown", removePopup);
      window.getSelection().removeAllRanges();
      setOpen(false);
    }
  };

  const Close = () => {
    setOpen(false);
    // setopenOptions(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscGlobal);

    return () => {
      console.log("removed");
      window.removeEventListener("keydown", handleEscGlobal);
    };
  }, []);

  useEffect(() => {
    buttonStateHandler();
  }, [buttonState]);

  useEffect(() => {
    //for create ideacard drawer only
    if (!open) setButtonState(open);
  }, [open]);

  useEffect(() => {
    //for Identify ideacard drawer only
    if (!IdentifyIdeaCardData) {
      setButtonState(IdentifyIdeaCardData);
    }
  }, [IdentifyIdeaCardData]);

  useEffect(() => {
    if (!title) setIsOpen(true);
  }, [title]);


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

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "208px" : "59px",
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

          </div>

          {/* // Links  */}

          <div
            className={
              isOpen ? "routes mainmenu" : "routesCollapsible mainmenu collapse-1 "
            }
          >
            {listOfLinks?.map((item, index) => {
              return (
                <button
                  key={index + item.name}
                  className={isOpen ? "link" : "linkCollapsible"}
                  id={urlChecker(item.linkText, true) ? "activeMainMenu" : null}
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
              isOpen ? "routes mainmenu" : "routesCollapsible mainmenu collapse-2"
            }
          >
            {listOfViews?.map((item, index) => {
              return (
                <button
                  key={index + item.name}
                  className={isOpen ? "link" : "linkCollapsible"}
                  id={urlChecker(item.linkText) ? "activeMainMenu" : null}
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
              isOpen ? "routes mainmenu" : "routesCollapsible mainmenu collapse-3"
            }
          >
            {listOfActions?.map((item, index) => {
              return (
                <button
                  key={index + item.name}
                  className={isOpen ? "link" : "linkCollapsible"}
                  id={item.state && buttonState ? "activeMainMenu" : null}
                  onClick={() => handleActionsButton(item, index)}
                >
                  {buttonState === 'Identify idea' && (
                    <style>
                      {`
                    ::selection {
                      background-color: #FFDAC1;
                    }
                  `}
                    </style>
                  )}
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
                    src="https://wallpapers.com/images/hd/cute-avatar-profile-picture-23yuqpb8wz1dqqqv.jpg"
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

      <Drawer
        anchor={"right"}
        open={open}
        onClose={Close}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            paddingTop: "4px",
            overflow: "hidden",
          },
        }}
      >
        {" "}
        {/*Making the drawer background transparent*/}
        <KeyboardDoubleArrowRightIcon
          fontSize="medium"
          style={clossDoubleArrowStyle}
          onClick={Close}
        />
        <CloseIcon
          fontSize="medium"
          style={closeCrossButtonStyle}
          onClick={Close}
        />
        <CreateIdeaCardPage />
      </Drawer>
    </>
  );
};

export default Sidebar_v2;
