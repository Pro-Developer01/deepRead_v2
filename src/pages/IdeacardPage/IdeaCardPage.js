import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { styled } from "@mui/material/styles";

import { TextField } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import "../MyLibrary/MyLibrary.css";
import {
  dynamicBulletHandler,
  getLabelId,
  getIdeacardIcons,
  fetchIdeacardIcons,
} from "../../helperFunctions/getIdeacardIcons";
import { IdeaCardInsights } from "../../components/Insights/Insights";
import { GoogleImageSelect } from "../../components/GoogleCSE/GoogleImageSelect";
import {
  getCurrentIdeaCardId,
  getIdeaCardById,
  updateIdeaCard,
  updateIdeaCardLabel,
  addIdeaCard,
  deleteIdeaCard,
} from "../../Utils/Features/librarySlice";

import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateIdentifyIdeaCardData } from "../../Utils/Features/IdentifyIdeaCardSlice";

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

const EditableTextField = styled(TextField)(({ theme }) => ({
  width: "78%",
  "& .MuiInputBase": {
    padding: 0,
  },
  "& .MuiInputBase-input": {
    fontSize: "1.2rem",
    fontWeight: 700,
  },
  "& .MuiInput-underline:after": {
    border: "none",
  },
  "& .MuiInput-underline:before": {
    border: "none",
  },
  "& .MuiInput-underline:hover:before": {
    border: "none !important",
  },
}));

const socialButtonsStyle = { color: "darkgrey" };

export default function IdeaCardPage({ emptyCard }) {
  const dispatch = useDispatch();
  const selectedIdeaCardId = useSelector((state) =>
    getCurrentIdeaCardId(state)
  );
  const ideaCard = useSelector((state) =>
    getIdeaCardById(state, selectedIdeaCardId)
  );

  const [title, setTitle] = useState();
  const [activeLabel, setActiveLabel] = useState(getLabelId());
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const allIcons = JSON.parse(localStorage.getItem("ideacardIcons"));

  let identifyIdeaCard = useSelector(
    (state) => state.IdentifyIdeaCardReducer.value
  );

  const { userId } = useSelector((state) => state.auth);

  const saveEmptyCard = () => {
    dispatch(
      addIdeaCard({
        data: {
          user_id: userId,
          title: "New Idea",
          book_id: null,
          highlight_id: null,
          label_id: getLabelId("KEYWORDS"),
          my_notes: [],
          tags: [],
          picture_link: "",
          rating: 0,
          level: 0,
          start: null,
          end: null,
        },
      })
    );
  };
  useEffect(() => {
    if (emptyCard) {
      if (!localStorage.getItem("ideacardIcons")) {
        fetchIdeacardIcons();
      }
      saveEmptyCard();
    }
  }, []);

  useEffect(() => {
    if (identifyIdeaCard) {
      dispatch(addIdeaCard({ data: identifyIdeaCard }));
      setTitle(identifyIdeaCard?.title);
    }
  }, [identifyIdeaCard]);

  const handleImageSelect = (imageUrl) => {
    dispatch(
      updateIdeaCard({
        ideaCardId: ideaCard._id,
        newData: {
          picture_link: imageUrl,
        },
      })
    );
  };

  const handleTitleChange = () => {
    dispatch(
      updateIdeaCard({
        ideaCardId: ideaCard._id,
        newData: {
          title: title,
        },
      })
    );
  };

  const handleTitleFieldKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleTitleChange();
    }
  };

  const handleClick = (event, labelId) => {
    setAnchorEl(event.currentTarget);
    setActiveLabel(labelId);
  };

  const handleDeleteIdeaCard = () => {
    dispatch(
      deleteIdeaCard({
        ideaCardId: ideaCard._id,
      })
    );
    dispatch(updateIdentifyIdeaCardData(null));
    dispatch(updatePersistentDrawer(null));
  };

  const handleClose = (iconLabelId) => {
    setAnchorEl(null);

    dispatch(
      updateIdeaCardLabel({
        ideaCardId: ideaCard._id,
        newData: {
          label_id: iconLabelId,
        },
      })
    );
  };

  return (
    <>
      {ideaCard ? (
        <>
          {" "}
          <div className="ideacardParentContainer">
            <div className="ideacard-Title">
              {/* //Shared by */}
              <div className="ideacardTopRowContainer">
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
                    <b>My own content</b>
                  </span>
                </Stack>
                <span
                  style={{
                    fontSize: "12px",
                    color: "lightslategrey",
                  }}
                >
                  <DeleteIcon
                    fontSize={"small"}
                    onClick={handleDeleteIdeaCard}
                  />
                </span>
              </div>
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
                    handleClick(e, ideaCard.label_id);
                    e.stopPropagation();
                  }}
                  style={{
                    marginTop: "-7px",
                  }}
                  className="cursor-pointer"
                >
                  {getIdeacardIcons(ideaCard.label_id, "large")}
                </span>
                {ideaCard?.highlight_id === identifyIdeaCard?.highlight_id ||
                emptyCard ? (
                  <EditableTextField
                    multiline
                    value={title}
                    placeholder="Enter Title"
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleChange}
                    onKeyDown={handleTitleFieldKeyDown}
                    variant="standard"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-lg font-bold">
                    {ideaCard.title?.length > 253
                      ? ideaCard.title?.slice(0, 253) + "..."
                      : ideaCard.title}
                  </h3>
                )}
              </Stack>
            </div>
            <div style={{ overflow: " scroll" }}>
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
                <div>
                  <div>
                    <GoogleImageSelect
                      onImageSelect={handleImageSelect}
                      image={ideaCard?.picture_link}
                    />
                  </div>
                  <div>
                    {ideaCard?.picture_link && (
                      <img
                        src={ideaCard?.picture_link}
                        alt={ideaCard.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "12px ",
                        }}
                      />
                    )}
                  </div>
                </div>
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
                <IdeaCardInsights
                  id={ideaCard._id}
                  highlight={ideaCard.highlight_id}
                />
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
                  {item._id === activeLabel ? (
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
      ) : (
        <span>IdeaCard data not available</span>
      )}
    </>
  );
}
