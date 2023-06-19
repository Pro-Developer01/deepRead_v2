import StartingPoint from "../Assets/StartingPointSvg";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StructureBySvg from "../Assets/StructureBySvg";
import ContentListSvg from "../Assets/ContentListSvg";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { Chip } from "@mui/material";
import highlightTester from "../helperFunctions/highlightTester";
import { dynamicBulletHandler } from "../helperFunctions/getIdeacardIcons";
const labelIconStyleInitial = {
  backgroundColor: "var(--fontColor)",
  borderRadius: "33px",
  color: "gainsboro",
  padding: "3px",
};
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
];

let listLevels = [
  {
    name: "1st Level:Chapter",
    icon: "playlist_add",
    state: true,
    className: "level-1",
  },
];

const cardChipStyle = {
  //   width: "126px",
  justifyContent: "flex-start",
  //   gap: "10px",
  paddingLeft: "8px",
  cursor: "pointer",
  color: "var(--fontColor)",
};
const iconStyle = {
  color: "var(--fontColor)",
};

const StartingPointRenderer = () => {
  return (
    <>
      <div>
        <span className="text-fontColor text-xs	 ">Starting point:</span>
      </div>
      <div className="flex" style={{ gap: "0.75rem", marginTop: "9px" }}>
        <StartingPoint />
        <div className="flex flex-col gap-[3px]">
          <Chip
            sx={cardChipStyle}
            icon={<LibraryBooksOutlinedIcon sx={iconStyle} />}
            label="Library"
            className="text-fontColor w-fit"
            onClick={() => {}}
          />
          <Chip
            sx={cardChipStyle}
            icon={<AutoStoriesOutlinedIcon sx={iconStyle} />}
            label={"Atomic Habits"}
            onClick={() => {}}
            className="text-fontColor "
          />
        </div>
      </div>
    </>
  );
};
const Structurerenderer = () => {
  let levelCount = useSelector((state) => state.levelCounterReducer.value);
  const [listLevelState, setListLevelState] = useState(listLevels);
  const [selectState, setSelectState] = useState({
    selectAll: true,
  });
  const [ideaCardActiveState, setIdeaCardActiveState] = useState(true);

  const stateCheckerLoop = () => {
    let selectCounter = 0;
    for (let i = 0; i < listLevelState.length; i++) {
      if (listLevelState[i].state) {
        selectCounter++;
      }
    }

    if (selectCounter) {
      setIdeaCardActiveState(true);
      if (selectCounter < listLevelState.length) {
        setSelectState({ ...selectState, selectAll: false });
      }
      if (selectCounter == listLevelState.length) {
        setSelectState({ ...selectState, selectAll: true });
      }
    } else {
      setIdeaCardActiveState(false);
      setSelectState({ ...selectState, selectAll: false });
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
    const tempList = JSON.parse(JSON.stringify(listLevelState));
    tempList[index].state = !tempList[index].state;
    stateCheckerLoop();
    collectSelectedLevels(tempList);
  };
  const levelObjectConstructor = (level) => {
    switch (level) {
      case 1:
        return "1st Level:Chapter";
      case 2:
        return "2st Level:Sub-Chapter";
      case 3:
        return "3rd Level:Section";

      case 4:
        return "4th Level:Sub-Section";
      case 5:
        return "5th Level:Sub-Sub-Section";

      default:
        return "nth Level";
    }
  };
  useEffect(() => {
    listLevels = [];
    for (let i = 1; i < levelCount; i++) {
      const obj = {
        name: levelObjectConstructor(i),
        state: true,
        className: `level-${i}`,
      };
      listLevels.push(obj);
      setListLevelState(listLevels);
    }
  }, [levelCount]);
  return (
    <>
      <div>
        <span className="text-fontColor text-xs	 ">Structure by:</span>
      </div>
      <div className="flex" style={{ gap: "0.75rem", marginTop: "9px" }}>
        <StartingPoint />
        <div className="flex flex-col gap-[3px]">
          {listLevelState?.map((item, i) => (
            <Chip
              sx={cardChipStyle}
              key={i + item.name}
              icon={<PlaylistAddRoundedIcon sx={iconStyle} />}
              label={item?.name}
              className="text-fontColor w-fit"
              style={{
                width: "159px",
                marginLeft: `${18 * i}px`,
                // background: `${item.state ? "#71717166" : ""}`,
              }}
              onClick={() => {}}
              // onClick={() => selectedList(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const ContentListRenderer = () => {
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
    const stateFullAllIcons = allIcons.map((item) => ({
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
    <>
      <div>
        <span className="text-fontColor text-xs	 ">Content:</span>
      </div>
      <div className="flex" style={{ gap: "0.75rem", marginTop: "9px" }}>
        <StartingPoint />
        <div className="flex flex-col gap-[3px]">
          <Chip
            sx={cardChipStyle}
            icon={<StopRoundedIcon sx={iconStyle} />}
            label="Highlights"
            className="text-fontColor w-fit"
            onClick={() => {}}
          />
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
                    <span className="material-symbols-outlined">
                      {" "}
                      {route.icon}
                    </span>
                    <div className="link_text">{route.name}</div>
                    <span className="material-symbols-outlined" id="arrows">
                      {" "}
                      {!bookmarkState ? "chevron_right" : "expand_more"}
                    </span>
                  </button>

                  {bookmarkState && (
                    <div className="radioInputs">
                      <span
                        className={"link selectCheckbox"}
                        id="bookmarPageRadio"
                      >
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
                            {/* <span className="material-symbols-outlined">
                            {" "}
                            {item.icon}
                          </span> */}
                            {dynamicBulletHandler(
                              item.icon,
                              "medium",
                              labelIconStyleInitial
                            )}
                            <div style={{ textTransform: "capitalize" }}>
                              {item.name}
                            </div>
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
                <span className="material-symbols-outlined"> {route.icon}</span>
                <div>{route.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default function ListView() {
  return (
    <div>
      <StartingPointRenderer />
      <div className="mt-[15px]">
        <hr />
      </div>
      <Structurerenderer />
      <div className="mt-[15px]">
        <hr />
      </div>
      <ContentListRenderer />
      <div className="mt-[15px]">
        <hr />
      </div>
    </div>
  );
}
