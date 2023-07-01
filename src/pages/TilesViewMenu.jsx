import TilesStartingPoint from "../Assets/TilesStartingPosition";
import TilesContentSvg from "../Assets/TilesContent";
import TilesTilesSvg from "../Assets/TilesTiles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import { Chip } from "@mui/material";
import highlightTester from "../helperFunctions/highlightTester";
import { dynamicBulletHandler } from "../helperFunctions/getIdeacardIcons";
import "./Pages_V2.css";
import { iconProvider } from "../helperFunctions/iconProvider";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";

const labelIconStyleInitial = {
  color: "var(--fontColor)",
};
const routes = [
  {
    path: "/",
    name: "Highlights",
    icon: "highlights",
  },
  {
    path: "/users",
    name: "Idea cards",
    icon: "ideaCards",
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
    label: "1st Level:Chapter"
  },
];

const cardChipStyle = {
  //   width: "126px",
  justifyContent: "flex-start",
  //   gap: "10px",
  paddingLeft: "8px",
  cursor: "pointer",
  color: "var(--fontColor)",
  background: "var(--ClickState) !important",
  fontSize: "var(--fontSizeRegular)",

};
const iconStyle = {
  color: "var(--fontColor)",
};
const chipLabelStyle = {
  fontSize: "14px",
};
const dropdownChipStyle = {
  width: "11.54rem",
  justifyContent: "flex-start",
  textTransform: "capitalize",
  // gap: "10px",dww
  paddingLeft: "5px",
  cursor: "pointer",
  color: "var(--fontColor)",
  background: "var(--DropDownMenuBackgroundColor)",
  fontSize: "var(--fontSizeRegular)",
};
let structureByMenuItems = [
  { label: "List view", icon: <FormatListBulletedIcon />, href: "listview" },
  { label: "Tile view", icon: <GridViewIcon />, href: "tileview" },
  { label: "Feed view", icon: <DynamicFeedIcon />, href: "feedview" },
  { label: "Tree view", icon: iconProvider('AccountTreeOutlined'), href: "treeview" },
  { label: "Nodes view", icon: iconProvider('HubOutlined'), href: "nodeview" },
];
const StartingPointRenderer = () => {
  return (
    <>
      <div>
        <span className="text-fontColor text-sm	">Starting point:</span>
      </div>
      <div className="flex" style={{ gap: "0.75rem", marginTop: "9px" }}>
        <TilesStartingPoint />
        <div className="flex flex-col gap-[5px]">
          <Chip
            sx={cardChipStyle}
            icon={<LibraryBooksOutlinedIcon sx={iconStyle} />}
            classes={{ label: chipLabelStyle }}
            label="Library"
            className="text-fontColor w-fit"
            onClick={() => { }}
          />
          <Chip
            sx={{
              ...cardChipStyle, width: '181px', justifyContent: 'flex-start', paddingLeft: '9px', background: "var(--ClickState) !important",
            }}
            icon={<AutoStoriesOutlinedIcon sx={iconStyle} />}
            classes={{ label: chipLabelStyle }}
            label={"Atomic Habits"}
            onClick={() => { }}
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [selectedItem, setSelectedItem] = useState(listLevels[0]);
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
    setListLevelState(tempList);
    collectSelectedLevels(tempList);
  };
  const selectHandler = () => {
    const tempList = JSON.parse(JSON.stringify(listLevelState));
    if (selectState.selectAll) {
      tempList.forEach((item) => {
        item.state = false;
      });
      setListLevelState(tempList);
      setIdeaCardActiveState(false);
      setSelectState({ ...selectState, selectAll: false });
    } else if (!selectState.selectAll) {
      tempList.forEach((item) => {
        item.state = true;
      });
      setListLevelState(tempList);
      setIdeaCardActiveState(true);
      setSelectState({ ...selectState, selectAll: true });
    }
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


  //New DrowpdonLogics
  const handleSelectChange = (index) => {
    setSelectedItem(listLevelState[index]);
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {

    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    listLevels = [];
    for (let i = 1; i < levelCount; i++) {
      const obj = {
        label: levelObjectConstructor(i),
      };
      listLevels.push(obj);
      setListLevelState(listLevels);
    }
  }, [levelCount]);
  useEffect(() => {
    stateCheckerLoop();
  }, [listLevelState]);
  useEffect(() => {
    const filteredList = listLevels.filter((item) => item.label !== selectedItem.label)
    setListLevelState(filteredList);
  }, [selectedItem]);
  return (
    <>
      <div className="pt-[15px]">
        <span className="text-fontColor text-sm	 ">Tiles:</span>
      </div>
      <div className="flex" style={{ gap: "0.75rem", marginTop: "9px" }}>
        <TilesTilesSvg />
        <div className="flex flex-col gap-[5px]">
          <div className="radioInputs ">
            {/* <span
              className={"link_Modified selectCheckbox"}
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
            </span> */}
            {/* {listLevelState?.map((item, i) => {
              return (
                <button
                id="tilesView-basic-button"
                  key={i}
                  className={
                    item.state ? "activeState_Modified" : "link_Modified"
                  }
                  // id={isOpen ? "active" : "activeCollapsible"}
                  onClick={() => selectedList(i)}
                  style={{
                    gap: "4px",
                    width: "185px",
                    marginLeft: `${14 * i}px`,
                  }}
                >
                  {iconProvider(item.icon)}
                  <div
                    style={{ textTransform: "capitalize" }}
                    className="link_text ellipsis_Style"
                  >
                    {item.name}
                  </div>
                </button>
              );
            })} */}
            <button
              id="tilesView-basic-button"
              aria-controls={open ? "tilesView-basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              className={"activeState_Modified"}
              // id={isOpen ? "active" : "activeCollapsible"}
              onClick={(e) => handleMenuClick(e)}
              style={{
                gap: "4px",
                width: "185px"
              }}
            >
              {iconProvider('Playlist_Add')}
              <div
                style={{ textTransform: "capitalize" }}
                className="link_text ellipsis_Style"
              >
                {selectedItem.label}
              </div>
            </button>
          </div>
        </div>
      </div>
      <Menu
        elevation={0}
        id="tilesView-basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "tilesView-basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            background: "transparent",
            "& .MuiMenuItem-root": {
              paddingLeft: 0,
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
          },
        }}
      >
        {listLevelState.map((item, index) => {
          return (
            !item.activeNow && <MenuItem
              sx={{ paddingTop: "0" }}
              key={item.label + index}
              value={index}
              onClick={() => handleSelectChange(index)}
            >
              <Chip
                sx={dropdownChipStyle}
                // className="activeState_Modified"
                icon={iconProvider('Playlist_Add')}
                label={item.label}
              />
            </MenuItem>
          );
        })}
      </Menu>
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

  const stateCheckerLoopContent = () => {
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
      stateCheckerLoopContent();
      setBookmarkState(true);
      setCounter(1);
    } else if (counter === 1) {
      setBookmarkState(false);
      setCounter(0);
      stateCheckerLoopContent();
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
    stateCheckerLoopContent();
    collectSelectedIdeas(routes[1].subRoutes);
  };

  const selectHandlerContent = () => {
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
        highlightButton.classList.remove("link_Modified");
        highlightButton.classList.add("activeState_Modified");
      } else {
        highlightButton.classList.add("link_Modified");
        highlightButton.classList.remove("activeState_Modified");
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
      highlightButton.classList.remove("link_Modified");
      highlightButton.classList.add("activeState_Modified");
    }
  }, []);
  return (
    <>
      <div className="pt-[15px]">
        <span className="text-fontColor text-sm	 ">Content:</span>
      </div>
      <div className="flex" style={{ gap: "0.75rem", marginTop: "9px" }}>
        <TilesContentSvg />
        <div className="flex flex-col gap-[5px]">
          {routes.map((route, index) => {
            if (route.subRoutes?.length) {
              return (
                <>
                  <button
                    key={index}
                    className={
                      ideaCardActiveState
                        ? "activeState_Modified"
                        : "link_Modified"
                    }
                    // id={isOpen ? "active" : "activeCollapsible"}
                    onClick={bookmarkClicked}
                  >
                    {/* <span className="material-symbols-outlined"> */}{" "}
                    {iconProvider(route.icon)}
                    {/* </span> */}
                    <div className="link_text">{route.name}</div>
                    <span className="material-symbols-outlined" id="arrows">
                      {" "}
                      {!bookmarkState ? "chevron_right" : "expand_more"}
                    </span>
                  </button>

                  {bookmarkState && (
                    <div className="radioInputs mt-3 ml-8">
                      <span
                        className={"link_Modified selectCheckbox"}
                        id="bookmarPageRadio"
                      >
                        <input
                          type="checkBox"
                          id={"selectAllCopy"}
                          name="selectAllCopy"
                          checked={selectState.selectAll}
                          onChange={selectHandlerContent}
                        />
                        <label for="selectAllCopy" className="checkBoxLabel text-sm">
                          Select all
                        </label>
                      </span>
                      {route.subRoutes?.map((item, i) => {
                        return (
                          <button
                            key={i}
                            className={
                              item.state
                                ? "activeState_Modified"
                                : "link_Modified"
                            }
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
                            {/* {iconProvider(route.icon)} */}
                            <div
                              style={{ textTransform: "capitalize" }}
                              className="link_text"
                            >
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
                className={isOpen ? "linkCollapsible" : "link_Modified"}
                id={route.name + "-" + index}
                onClick={() =>
                  showMenuClickHandler(route.name, route.name + "-" + index)
                }
              >
                {/* <span className="material-symbols-outlined"> */}{" "}
                {iconProvider(route.icon)}
                {/* </span> */}
                <div className="link_text">{route.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default function TilesViewMenu() {
  return (
    <div>
      <StartingPointRenderer />
      <div className="mt-[21px]">
        <hr />
      </div>
      <Structurerenderer />
      <div className="mt-[15px]">
        <hr />
      </div>
      <ContentListRenderer />
    </div>
  );
}
