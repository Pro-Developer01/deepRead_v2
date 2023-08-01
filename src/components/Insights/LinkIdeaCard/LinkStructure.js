import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccordionDetails from "@mui/material/AccordionDetails";

import { accordianDetailStyling, MenuItemStyles } from "../styled";

import { fetchIdeaCardData } from "../../../helperFunctions/apiFunctions";
import {
  getIdeaCardById,
  updateIdeaCardRelation,
} from "../../../Utils/Features/librarySlice";

import {
  ParentLinkIcon,
  ChildLinkIcon,
  NeutralLinkIcon,
  IdeaCardIcon,
} from "./IconsStyled";

import { LinkIdeaCard } from "./LinkIdeaCard";

const linksInfoMenuItems = [
  {
    bullet: "parent",
    content: "Parent link",
    icon: <ParentLinkIcon />,
  },
  {
    bullet: "child",
    content: "Child link",
    icon: <ChildLinkIcon />,
  },
  {
    bullet: "neutral",
    content: "Neutral Link",
    icon: <NeutralLinkIcon />,
  },
];
export const LinkStructure = ({ ideaCardId }) => {
  const dispatch = useDispatch();
  const ideaCard = useSelector((state) => getIdeaCardById(state, ideaCardId));

  const [link, setLink] = useState("");
  const [indexOfBullet, setIndexOfBullet] = useState(0);
  const [linkData, setLinkData] = useState(ideaCard.linked_structure);
  const [activeBullet, setActiveBullet] = useState("horizontal");
  const [anchorEl, setAnchorEl] = useState(null);
  const [ideaCardsSearchData, setIdeaCardsSearchData] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setLinkData(ideaCard.linked_structure);
    setIdeaCardsSearchData([]);
    setLink("");
  }, [ideaCard]);

  const inputFeildStyle = {
    width: "auto",
    padding: "3px 0px",
    fontWeight: 600,
    border: "none",
    marginLeft: "5px",
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option) => {
    setAnchorEl(null);
    // setIconOption(option);
    const tempLinkData = [...linkData];
    tempLinkData[indexOfBullet] = { ...tempLinkData[indexOfBullet] };
    tempLinkData[indexOfBullet].relation = option;

    dispatch(
      updateIdeaCardRelation({
        ideaCardId: ideaCardId,
        newData: {
          linked_structure: tempLinkData,
        },
      })
    );
    setLinkData(tempLinkData);
  };
  const handleKeyDown = (event) => {};

  const handleTags = (event) => {
    setLink(event.target.value);
    if (event.target.value.length) {
      fetchIdeaCardData({ title: event.target.value }).then((ideaCardData) => {
        setIdeaCardsSearchData(ideaCardData);
      });
    } else {
      setIdeaCardsSearchData([]);
    }
  };
  const dynamicBulletHandler = (option) => {
    switch (option) {
      case "parent":
        return <ParentLinkIcon />;
      case "child":
        return <ChildLinkIcon />;
      case "neutral":
        return <NeutralLinkIcon />;
      default:
    }
  };
  return (
    <>
      <AccordionDetails sx={accordianDetailStyling}>
        <div style={{ display: "flex", alignItems: "center", gap: "2.7px" }}>
          {dynamicBulletHandler("neutral")} &nbsp;
          <IdeaCardIcon />
          <input
            type="text"
            value={link}
            onChange={handleTags}
            placeholder="Write here"
            style={inputFeildStyle}
            onKeyDown={handleKeyDown}
          />
        </div>
        <LinkIdeaCard
          ideaCardToLinkId={ideaCardId}
          resultCards={ideaCardsSearchData}
          linkedCardsData={linkData}
          setLinkedCardsCallback={setLinkData}
        />
        {linkData?.map((item, index) => {
          return (
            <div
              key={item.idea_id}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                margin: "3px 0px",
              }}
            >
              <span
                id="linkStructureButton"
                aria-controls={open ? "linkStructureMenu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => {
                  handleClick(e);
                  setIndexOfBullet(index);
                  setActiveBullet(item.bullet);
                }}
                style={{ height: "fit-content" }}
              >
                {dynamicBulletHandler(item.relation)}
              </span>
              <IdeaCardIcon />
              <p style={{ fontWeight: 600 }}>{item.title}</p>
            </div>
          );
        })}
      </AccordionDetails>
      <Menu
        id="linkStructureMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose("parent")}
        MenuListProps={{
          "aria-labelledby": "linkStructureButton",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: 28,
        }}
      >
        {linksInfoMenuItems.map((item, key) => (
          <MenuItem
            key={key}
            sx={MenuItemStyles}
            onClick={() => handleClose(item.bullet)}
          >
            {activeBullet === item.bullet ? (
              <>
                {item.icon}
                &nbsp;&nbsp;<strong>{item.content}</strong>
              </>
            ) : (
              <>
                <span
                  style={{
                    opacity: "0.4",
                    height: "22px",
                  }}
                >
                  {item.icon}
                </span>
                &nbsp; {item.content}
              </>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
