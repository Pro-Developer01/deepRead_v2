import React, { useEffect } from "react";
import { useState } from "react";
import "../MyLibrary/MyLibrary.css";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import Stack from "@mui/material/Stack";
import { IdeaCardAccordian } from "../../components/AccordianCollections/AccordianCollections";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  dynamicBulletHandler,
  getLabelId,
  getIdeacardIcons,
} from "../../helperFunctions/getIdeacardIcons";
import { useSelector } from "react-redux";
import { updateIdeaCardLabel } from "../../helperFunctions/apiFunctions";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";

// let booksData = {
//   _id: "642325574dc0760034d8f977",
//   book_id: "642325564dc0760034d8981f",
//   label_id: "63584f343bcadd010442c447",
//   highlight_id: "642325574dc0760034d8aae9",
//   user_id: "642325564dc0760034d897ed",
//   title: "To write a great book, you must first become the book.",
//   description: [],
//   own_thoughts: [],
//   picture_link: "",
//   rating: 0,
//   tags: [],
//   level: 0,
//   start: 17320,
//   end: 17401,
//   created_at: 1673730692254,
//   updated_at: null,
//   retrieved_at: 1673730692254,
//   deleted_at: null,
//   lastviewed_at: null,
// };
const MenuItemStyles = {
  margin: "5px 1px",
  borderRadius: "30px",
};
const inactiveLabelIconStyle = {
  backgroundColor: "var(--greyColor)",
  borderRadius: "33px",
  color: "white",
  padding: "3px",
};
const socialButtonsStyle = { color: "darkgrey" };

export default function IdeaCardPage() {
  const ideacardData = useSelector((state) => state.ideacardReducer.value);
  const [data, setData] = useState(ideacardData);
  const [activeLabel, setActiveLabel] = useState(getLabelId());
  const currentLocation = window.location.pathname;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const allIcons = JSON.parse(localStorage.getItem("ideacardIcons"));

  const socialToggleHandler = () => {
    let tempData = JSON.parse(JSON.stringify(data));
    tempData.state = !tempData.state;
    setData(tempData);
  };

  const handleClick = (event, labelId) => {
    setAnchorEl(event.currentTarget);
    setActiveLabel(labelId);
  };

  const handleClose = (iconLabelId) => {
    setAnchorEl(null);
    // setIconOption(option);
    const tempNotes = JSON.parse(JSON.stringify(data));
    tempNotes.label_id = iconLabelId;
    updateIdeaCardLabel(data._id, { label_id: iconLabelId });
    setData(tempNotes);
  };

  useEffect(() => {
    setData(ideacardData);
  }, [ideacardData]);

  return (
    <>
      {data && (
        <>
          {" "}
          <div className="ideacardParentContainer" >
            <div className="ideacard-Title">
              {/* //Shared by */}
              <Stack
                direction="row"
                justifyContent="left"
                alignItems="center"
                spacing={1}
                mb={1}
                sx={{ paddingLeft: "3.4rem", paddingRight: "0.5rem" }}
              >
                <DiamondOutlinedIcon
                  sx={{ fontSize: "14px", color: "lightslategrey" }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "lightslategrey",
                  }}
                >

                  <b>My own content</b>{" "}
                </span>
              </Stack>
              {/* //CardHeaderTitle */}
              <Stack
                direction="row"
                justifyContent="left"
                alignItems="flex-start"
                spacing={1.5}
                mb={1}
                sx={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
              >
                <span
                  id="ideaCardLabels"
                  aria-controls={open ? "ideaCardLabelsMenu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => {
                    handleClick(e, data.label_id);
                    e.stopPropagation();
                  }}
                  style={{
                    marginTop: "-7px",
                  }}
                  className="cursor-pointer"
                >
                  {getIdeacardIcons(data.label_id, "large")}
                </span>
                <h3 className="text-lg font-bold"> {data.title?.length > 253 ? data.title?.slice(0, 253) + '...' : data.title}</h3>
              </Stack>
            </div>

            <div style={{ overflow: ' scroll' }}>

              {/* //Graphics */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "12px",
                  paddingLeft: "3.6rem",
                  paddingRight: "0.5rem",
                }}
              >
                {data.picture_link && (
                  <img
                    src={data.picture_link}
                    alt={data.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "12px ",
                    }}
                  />
                )}
              </div>

              {/* //SocialButtons */}

              <div
                className="reactionButtonsContainer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ paddingLeft: "3.4rem", paddingRight: "0.5rem" }}
              >
                <div className="socialButtons">
                  <Stack direction="row" spacing={3}>
                    <FavoriteBorder sx={{ color: "var(--primaryColor)" }} />
                    <ChatBubbleOutline sx={socialButtonsStyle} />
                    <ShareIcon sx={socialButtonsStyle} />
                  </Stack>
                </div>
                <div className="bookmarkButtons">
                  <Stack direction="row" spacing={3}>
                    <BookmarkBorderIcon sx={socialButtonsStyle} />
                    <MoreVertIcon sx={socialButtonsStyle} />
                  </Stack>
                </div>
              </div>
              <hr style={{ border: "1px solid var(--borderColors)" }} />
              <div className="otherAccordians">
                <IdeaCardAccordian data={data} />
              </div>
            </div>
          </div>
          <Menu
            id="ideaCardLabelsMenu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose()}
            MenuListProps={{
              "aria-labelledby": "ideaCardLabels",
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
            {allIcons?.map((item, index) => {
              return (
                <MenuItem
                  key={index + item._id}
                  sx={MenuItemStyles}
                  onClick={() => handleClose(item._id)}
                >
                  {item._id == activeLabel ? (
                    <>
                      {dynamicBulletHandler(item.label, "medium")} &nbsp;
                      <strong>&nbsp;{item.label}</strong>
                    </>
                  ) : (
                    <>
                      {dynamicBulletHandler(
                        item.label,
                        "medium",
                        inactiveLabelIconStyle
                      )}
                      &nbsp; &nbsp;{item.label}
                    </>
                  )}
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </>
  );
}
