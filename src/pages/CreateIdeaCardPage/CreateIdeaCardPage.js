import React, { useEffect } from "react";
import { useState } from "react";
import "../MyLibrary/MyLibrary.css";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Stack from "@mui/material/Stack";
import {
  CreateIdeaCardAccordian,
  IdeaCardAccordian,
} from "../../components/AccordianCollections/AccordianCollections";
import { styled } from "@mui/material/styles";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import {
  dynamicBulletHandler,
  getLabelId,
  getIdeacardIcons,
} from "../../helperFunctions/getIdeacardIcons";
import axios from "axios";
import { apiRoot } from "../../helperFunctions/apiRoot";
import { useSelector, useDispatch } from "react-redux";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateFetchListviewState } from "../../Utils/Features/fetchListviewSlice";

import { updateIdeaCardLabel } from "../../helperFunctions/apiFunctions";

let dummyData = {
  book_id: null,
  label_id: getLabelId("KEYWORDS"),
  highlight_id: null,
  title: "",
  my_notes: [],
  picture_link: "",
  rating: 0,
  tags: [],
  level: 0,
  start: 578072,
  end: 578146,
};
const MenuItemStyles = {
  margin: "5px 1px",
  borderRadius: "30px",
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
const inactiveLabelIconStyle = {
  backgroundColor: "var(--greyColor)",
  borderRadius: "33px",
  color: "white",
  padding: "3px",
};

export default function CreateIdeaCardPage() {
  // const ideacardData = useSelector((state) => state.ideacardReducer.value);

  let identifyIdeaCard = useSelector(
    (state) => state.IdentifyIdeaCardReducer.value
  );
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [activeLabel, setActiveLabel] = useState(getLabelId());
  const [data, setData] = useState(dummyData);
  const [title, setTitle] = useState(dummyData.title);
  const [isIcCreatedYet, setIsIcCreatedYet] = useState(1);
  const currentLocation = window.location.pathname;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timer, setTimer] = React.useState(null);
  const open = Boolean(anchorEl);
  const allIcons = JSON.parse(localStorage.getItem("ideacardIcons"));

  useEffect(() => {
    if (isIcCreatedYet?.length > 2) {
      const tempData = Object.assign({}, data);
      tempData._id = isIcCreatedYet;
      setData(tempData);
    }
  }, [isIcCreatedYet]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (iconLabelId) => {
    setAnchorEl(null);
    // setIconOption(option);
    const tempNotes = JSON.parse(JSON.stringify(data));
    console.log("tempNotes", tempNotes);
    tempNotes.label_id = iconLabelId;
    console.log("iconLabelId", iconLabelId);
    updateIdeaCardLabel(data._id, { label_id: iconLabelId });
    setData(tempNotes);
  };

  const handleDataChange = () => {
    const tempNotes = JSON.parse(JSON.stringify(data));
    tempNotes.title = title;
    tempNotes.user_id = userId;
    setData(tempNotes);
  };

  const handleTextFieldKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleDataChange();
    }
  };
  const handleButtonClick = () => {
    // Handle button click event here
    console.log("Button clicked");
  };
  const postIdeaCardData = () => {
    axios
      .post(`${apiRoot.endpoint}/api/ideas/store`, data, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        console.log("posted ideacard Successfully", res);
        console.log("posted ideacard Successfully", res.data.data);
        setIsIcCreatedYet(res.data.data);
        dispatch(updateFetchListviewState(true));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const updateIdeaCardData = () => {
    const updatedData = JSON.parse(JSON.stringify(data));
    delete updatedData.book_id;
    delete updatedData.highlight_id;
    delete updatedData.start;
    delete updatedData.end;
    delete updatedData.label_id;
    delete updatedData.user_id;
    console.log("updatedData", updatedData);
    axios
      .put(
        `${apiRoot.endpoint}/api/ideas/update?_id=${isIcCreatedYet}`,
        updatedData,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        console.log("updated ideacard Successfully", res);
        dispatch(updateFetchListviewState(true));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const debaouceApi = () => {
    if (timer) clearTimeout(timer);

    setTimer(
      setTimeout(() => {
        updateIdeaCardData();
      }, 5)
    );
  };

  useEffect(() => {
    if (data.title) {
      if (isIcCreatedYet === 1) {
        setIsIcCreatedYet(2);
        console.log("postIdeaCardData called");
        postIdeaCardData();
      } else {
        debaouceApi();
      }
    } else if (!data.title && timer) {
      clearTimeout(timer);
    }
  }, [data]);

  useEffect(() => {
    if (identifyIdeaCard) {
      setData(identifyIdeaCard);
      setTitle(identifyIdeaCard?.title);
    }
  }, [identifyIdeaCard]);

  return (
    <>
      {" "}
      {/* {data && */}
      <div
        style={{
          border: "1px solid var(--borderColors)",
          borderTop: 'none',
          padding: "7px",
          borderRadius: "12px ",
          background: "white",
          margin: "0 0 0 0.7rem",
          padding: "0.5rem 0",
          paddingTop: "0",
          width: '573px',
          overflow: 'auto'
        }}
      >

        <div className="ideacard-Title" style={{ position: 'sticky', top: 0 }}>
          {/* //Shared by */}
          <Stack
            direction="row"
            justifyContent="left"
            alignItems="center"
            spacing={1}
            mb={1}
            sx={{ paddingLeft: "3.2rem", paddingRight: "0.5rem" }}
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
              id="ideaCardLabels-createIdeacard"
              aria-controls={open ? "ideaCardLabelsMenu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => {
                handleClick(e);
                e.stopPropagation();
                setActiveLabel(getLabelId('KEYWORDS')) //need to be changed
              }}
              style={{
                marginTop: "-1px",
              }}
              className="cursor-pointer"

            >
              {getIdeacardIcons(data.label_id, "large")}
            </span>

            <EditableTextField
              multiline
              value={title}
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleDataChange}
              onKeyDown={handleTextFieldKeyDown}
              variant="standard"
              autoFocus
            />
          </Stack>
        </div>
        {/* //Graphics */}
        <div
          style={{
            display: "flex",
            //alignItems: "center",
            marginTop: "12px",
            paddingLeft: "0.6rem",
            paddingRight: "0.5rem",
          }}
        >
          {/* Rectangular Container for Google search bar and upload button  */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            borderRadius: '10px',
            width: '100%', //Adjustable
            height: '253px',
            border: '1px solid #a4a4a4',
            backgroundColor: '#ededed',
            marginLeft: '45px',
          }} >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                backgroundColor: '#a6a6a6',
                marginLeft: '2%',//Adjustable
                marginTop: '10px',
                marginRight: '10px',/* Styles for the first inner div */
              }}>
                <IconButton onClick={handleButtonClick} style={{ color: 'white' }}>
                  <FileUploadOutlinedIcon />
                </IconButton>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f2f2f2',
                width: '80%',  //Adjustable
                height: '28px',
                borderRadius: '5px',
                border: '1px solid #a4a4a4',
                marginTop: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',/* Styles for the second inner div */
              }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="standard"
                  placeholder="Search Google Image"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <IconButton edge="end">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#a6a6a6' }}>Search and select an Image</span>
            </div>
          </div>


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
          <CreateIdeaCardAccordian data={data} />
        </div>
      </div>
      {/* } */}
      <Menu
        id="ideaCardLabelsMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          "aria-labelledby": "ideaCardLabels-createIdeacard",
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
  );
}
