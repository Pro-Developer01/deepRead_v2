import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "./Pages.css";
import axios from "axios";
import { useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";

const routes = [
  {
    path: "/",
    name: "Sources",
    icon: "place_item",
    subRoutes: [
      {
        name: "My own",
        icon: "diamond",
        state: true,
      },
      {
        name: "Shared with me",
        icon: "share",
        state: true,
      },
      {
        name: "Followed by me",
        icon: "person",
        state: true,
      },
      {
        name: "Suggestions for me",
        icon: "recommend",
        state: true,
      },
    ],
  },
];

let booksData = [
  {
    title: "Hooked: How to Build Habit-Forming Products",
    author: "Unknown",
    img: "https://m.media-amazon.com/images/I/41lvEdt3KmL._SY400_.jpg",
    id: "38383",
    state: false,
    index: 1,
  },
];
const tagsDataDemo = [
  { tagName: "Dummy_Tag", state: false },
  { tagName: "Dummy_Tag_Calisthenics", state: false },
  { tagName: "Dummy_Tag_Habits", state: false },
  { tagName: "Dummy_Tag_Bitcoin", state: false },
  { tagName: "Dummy_Tag_FreeDiving", state: false },
];
const Filter = () => {
  const [searchText, setsearchText] = useState("");
  const [selectState, setSelectState] = useState({
    selectAll: true,
  });
  const [bookSelectState, setBookSelectState] = useState({
    selectAll: false,
  });
  const [tagSelectState, setTagSelectState] = useState({
    selectAll: false,
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [data, setData] = useState(booksData);
  const [tagdata, setTagData] = useState(tagsDataDemo);
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [ideaCardActiveState, setIdeaCardActiveState] = useState(false);
  const [booksActiveState, setBooksActiveState] = useState(false);
  const [tagsActiveState, setTagsActiveState] = useState(false);
  const [flag, setFlag] = useState(false);
  const [counter, setCounter] = useState({
    sourceCounter: 0,
    bookCounter: 0,
    tagCounter: 0,
  });
  const [bookState, setBookState] = useState(false);
  const [tagState, setTagState] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  // .post("http://app.deepread.com:8000/api/auth/demo-account")

  const loginAuths = () => {
    axios
      .post("https://app.deepread.com/api/auth/demo-account")
      .then((res) => {
        console.log("post", res);
        if (res.status === 200) {
          const token = res.data.authorization;
          const userId = res.data.user_id;
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
          setToken(token);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const nameCorrection = (string) => {
    if (string.includes(",")) {
      let array = string.split(",");
      let fullName = array[1] + " " + array[0];
      return fullName;
    } else return string;
  };
  // `http://app.deepread.com:8000/api/user/get-metadata?user_id=${userId}`,

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`https://app.deepread.com/api/user/get-metadata?user_id=${userId}`, {
        headers: {
          // 'Accept': 'application/json',
          // 'Content-Type': 'application/json',
          authorization: token,
        },
      })
      .then((res) => {
        if (res.data.data) {
          const rawData = res.data.data;
          booksData = [];
          const tagsLocal = [];
          rawData.forEach((item, i) => {
            const obj = {};
            obj.title = item.title;
            obj.img = item.img_path;
            obj.id = item._id;
            let aurthorNameArr = [];
            if (item.author.includes(";")) {
              let namesArray = item.author.split(";");
              console.log(namesArray);
              namesArray.forEach((ele) => {
                aurthorNameArr.push(nameCorrection(ele));
              });
            } else {
              aurthorNameArr.push(nameCorrection(item.author));
            }
            obj.author = aurthorNameArr;
            obj.state = false;
            obj.index = i;
            booksData.push(obj);
            tagsLocal.push(...item.tags);
          });
          setData(booksData);
          if (tagsLocal.length) {
            setTagData(tagsLocal);
          }
          console.log("booksData", booksData);
          console.log("tagsLocal", tagsLocal);
          console.log("rawData", res.data.data);
        }
        // setData(res.data.data);
      })
      .catch((err) => {
        if (err.response) {
          // localStorage.clear();
          loginAuths();
        }
        console.log("err,", err);
      });
  }, [token]);

  useEffect(() => {
    const searchedArray = booksData.filter((item) => {
      return item.title.toLowerCase().includes(searchText.toLowerCase());
    });
    setData(searchedArray);
  }, [searchText]);

  const searchHandler = (e) => {
    setsearchText(e.target.value);
  };

  const stateCheckerLoop = () => {
    let selectCounter = 0;
    for (let i = 0; i < routes[0].subRoutes.length; i++) {
      if (routes[0].subRoutes[i].state) {
        selectCounter++;
      }
    }

    if (selectCounter) {
      setIdeaCardActiveState(true);
      if (selectCounter < routes[0].subRoutes.length) {
        setSelectState({ ...selectState, selectAll: false });
      }
      if (selectCounter == routes[0].subRoutes.length) {
        setSelectState({ ...selectState, selectAll: true });
      }
    } else {
      setIdeaCardActiveState(false);
      setSelectState({ ...selectState, selectAll: false });
    }
  };
  const bookmarkClicked = () => {
    if (counter.sourceCounter === 0) {
      stateCheckerLoop();
      setBookmarkState(true);
      setCounter({ ...counter, sourceCounter: 1 });
    } else if (counter.sourceCounter === 1) {
      setBookmarkState(false);
      setCounter({ ...counter, sourceCounter: 0 });
      stateCheckerLoop();
    }
  };
  const CardsClicked = (index) => {
    routes[0].subRoutes[index].state = !routes[0].subRoutes[index].state;
    stateCheckerLoop();
  };
  const selectHandler = () => {
    if (selectState.selectAll) {
      routes[0].subRoutes.forEach((item) => {
        item.state = false;
      });
      setIdeaCardActiveState(false);
      setSelectState({ ...selectState, selectAll: false });
    } else if (!selectState.selectAll) {
      routes[0].subRoutes.forEach((item) => {
        item.state = true;
      });
      setIdeaCardActiveState(true);
      setSelectState({ ...selectState, selectAll: true });
    }
  };

  const bookStateCheckerLoop = () => {
    let selectCounter = 0;
    for (let i = 0; i < booksData.length; i++) {
      if (booksData[i].state) {
        selectCounter++;
      }
    }

    if (selectCounter) {
      setBooksActiveState(true);
      if (selectCounter < booksData.length) {
        setBookSelectState({ ...bookSelectState, selectAll: false });
      }
      if (selectCounter == booksData.length) {
        setBookSelectState({ ...bookSelectState, selectAll: true });
      }
    } else {
      setBooksActiveState(false);
      setBookSelectState({ ...bookSelectState, selectAll: false });
    }
  };
  const bookIsClicked = () => {
    if (counter.bookCounter === 0) {
      bookStateCheckerLoop();
      setBookState(true);
      setCounter({ ...counter, bookCounter: 1 });
    } else if (counter.bookCounter === 1) {
      setBookState(false);
      setCounter({ ...counter, bookCounter: 0 });
      bookStateCheckerLoop();
    }
  };

  const bookSelected = (i) => {
    booksData[i].state = !booksData[i].state;
    setData(booksData);
    bookStateCheckerLoop();
    setFlag(!flag);
  };

  const bookSelectHandler = () => {
    if (bookSelectState.selectAll) {
      booksData.forEach((item) => {
        item.state = false;
      });
      setData(booksData);
      setFlag(!flag);
      setBooksActiveState(false);
      setBookSelectState({ ...bookSelectState, selectAll: false });
    } else if (!bookSelectState.selectAll) {
      booksData.forEach((item) => {
        item.state = true;
      });
      setData(booksData);
      setFlag(!flag);
      setBooksActiveState(true);
      setBookSelectState({ ...bookSelectState, selectAll: true });
    }
  };

  const tagStateCheckerLoop = () => {
    let selectCounter = 0;
    for (let i = 0; i < tagsDataDemo.length; i++) {
      if (tagsDataDemo[i].state) {
        selectCounter++;
      }
    }

    if (selectCounter) {
      setTagsActiveState(true);
      if (selectCounter < tagsDataDemo.length) {
        setTagSelectState({ ...tagSelectState, selectAll: false });
      }
      if (selectCounter == tagsDataDemo.length) {
        setTagSelectState({ ...tagSelectState, selectAll: true });
      }
    } else {
      setTagsActiveState(false);
      setTagSelectState({ ...tagSelectState, selectAll: false });
    }
  };
  const tagIsClicked = () => {
    if (counter.tagCounter === 0) {
      bookStateCheckerLoop();
      setTagState(true);
      setCounter({ ...counter, tagCounter: 1 });
    } else if (counter.tagCounter === 1) {
      setTagState(false);
      setCounter({ ...counter, tagCounter: 0 });
      bookStateCheckerLoop();
    }
  };
  const tagItemsClicked = (i) => {
    tagsDataDemo[i].state = !tagsDataDemo[i].state;
    setTagData(tagsDataDemo);
    tagStateCheckerLoop();
    setFlag(!flag);
  };
  const tagSelectHandler = () => {
    if (tagSelectState.selectAll) {
      tagsDataDemo.forEach((item) => {
        item.state = false;
      });
      setTagData(tagsDataDemo);
      setFlag(!flag);
      setTagsActiveState(false);
      setTagSelectState({ ...tagSelectState, selectAll: false });
    } else if (!tagSelectState.selectAll) {
      tagsDataDemo.forEach((item) => {
        item.state = true;
      });
      setTagData(tagsDataDemo);
      setFlag(!flag);
      setTagsActiveState(true);
      setTagSelectState({ ...tagSelectState, selectAll: true });
    }
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
      paddingRight: 0,
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
                key={index + route.name}
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
                        key={i + item.name}
                        className={item.state ? "activeState" : "link"}
                        // id={isOpen ? "active" : "activeCollapsible"}
                        onClick={() => CardsClicked(i)}
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
      })}

      {/* //Books */}
      <div className="booksContainer">
        <button
          className={booksActiveState ? "activeState" : "link"}
          // id={isOpen ? "active" : "activeCollapsible"}
          onClick={() => bookIsClicked()}
        >
          <AnimatePresence>
            <span className="material-symbols-outlined">menu_book</span>
            <motion.div
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="link_text"
            >
              Books
            </motion.div>
            <span className="material-symbols-outlined" id="arrows">
              {" "}
              {!bookState ? "chevron_right" : "expand_more"}
            </span>
          </AnimatePresence>
        </button>

        {/* //BoookItems */}
        {bookState && (
          <div className="bookItems">
            {/* //Search Bar  */}
            <div
              className="SearchMenu"
              style={{ paddingLeft: "35px", width: " 241px" }}
            >
              <AnimatePresence>
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  className="search"
                  style={{ justifyContent: "flex-start" }}
                >
                  <motion.input
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={inputAnimation}
                    type="text"
                    placeholder="Search"
                    className="inputElement"
                    value={searchText}
                    onChange={searchHandler}
                  />
                  <div>
                    <span className="material-symbols-outlined search_icon">
                      search{" "}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* //Select All checkBox */}
            <span
              className={"link"}
              id="bookmarPageRadio"
              style={{
                margin: "0",
                marginBottom: "4px",
                width: "213px",
                marginLeft: "34px",
                fontSize: "13px",
              }}
            >
              <input
                type="checkBox"
                id={"BookselectAll"}
                name="BookselectAll"
                checked={bookSelectState.selectAll}
                onChange={bookSelectHandler}
                style={{ marginRight: "-10px" }}
              />
              <label for="BookselectAll" className="checkBoxLabel">
                Select all
              </label>
            </span>
            {/* //Api LIst  */}
            <div className="bookList">
              {data
                ?.sort((a, b) => b.state - a.state)
                .map((item, i) => {
                  return (
                    <div
                      key={item.id}
                      className={
                        item.state
                          ? "bookListContainerActive"
                          : "bookListContainer"
                      }
                      onClick={() => bookSelected(i)}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        width={55}
                        height={55}
                      />
                      <div className="bookMetaContainer">
                        <Tooltip title={item.title} arrow>
                          <button className="heading">{item.title}</button>
                        </Tooltip>
                        <span className="author">By {item.author}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* //Tags */}
      <button
        className={tagsActiveState ? "activeState" : "link"}
        // id={isOpen ? "active" : "activeCollapsible"}
        onClick={() => tagIsClicked()}
      >
        <AnimatePresence>
          <span className="material-symbols-outlined">tag</span>
          <motion.div
            variants={showAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="link_text"
          >
            Tags
          </motion.div>
          <span className="material-symbols-outlined" id="arrows">
            {" "}
            {!tagState ? "chevron_right" : "expand_more"}
          </span>
        </AnimatePresence>
      </button>

      {tagState && (
        <div className="radioInputs">
          <span className={"link selectCheckbox"} id="bookmarPageRadio">
            <input
              type="checkBox"
              id={"tagselectAll"}
              name="tagselectAll"
              checked={tagSelectState.selectAll}
              onChange={tagSelectHandler}
            />
            <label for="tagselectAll" className="checkBoxLabel">
              Select all
            </label>
          </span>
          {tagdata
            ?.sort((a, b) => b.state - a.state)
            .map((item, i) => {
              return (
                <button
                  key={i + item.tagName}
                  className={item.state ? "activeState" : "link"}
                  // id={isOpen ? "active" : "activeCollapsible"}
                  style={{ padding: "10px" }}
                  onClick={() => tagItemsClicked(i)}
                >
                  <AnimatePresence>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "18px",
                        marginLeft: "5px",
                        marginRight: "-3px",
                      }}
                    >
                      {" "}
                      tag
                    </span>
                    <motion.div
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="link_text"
                    >
                      {item.tagName}
                    </motion.div>
                  </AnimatePresence>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Filter;
