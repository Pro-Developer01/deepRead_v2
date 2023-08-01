import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import AccordionDetails from "@mui/material/AccordionDetails";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircleIcon from "@mui/icons-material/Circle";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";

import "../../pages/MyLibrary/MyLibrary.css";
import {
  accordianDetailStyling,
  MenuItemStyles,
  iconStyling,
  MyNotesTextField,
} from "./styled";

import {
  getBookById,
  getIdeaCardById,
} from "../../Utils/Features/librarySlice";

export const MyNotes = ({ id, type, updateHandler }) => {
  const item = useSelector((state) =>
    type === "ideaCard" ? getIdeaCardById(state, id) : getBookById(state, id)
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [indexOfBullet, setIndexOfBullet] = useState(0);
  const [newNotes, setNewNotes] = useState("");
  const [notesData, setNotesData] = useState(item.my_notes);
  const open = Boolean(anchorEl);

  const inputFeildStyle = {
    width: "100%",
    padding: "3px 0px",
    fontWeight: 600,
    border: "none",
    marginLeft: "5px",
    fontFamily: "Gaegu,cursive",
    fontSize: "21px",
  };

  const notesDataValidator = () => {
    if (notesData?.length && typeof notesData[0] === "string") {
      const updatedMyNotesData = [];
      notesData?.forEach((item) => {
        updatedMyNotesData.push({
          bullet: "neutral",
          content: item,
        });
      });
      setNotesData(updatedMyNotesData);
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option) => {
    setAnchorEl(null);
    // setIconOption(option);
    let tempNotes = JSON.parse(JSON.stringify(notesData));
    if (!tempNotes) tempNotes = [];
    tempNotes[indexOfBullet].bullet = option;
    setNotesData(tempNotes);
    updateHandler(id, {
      my_notes: tempNotes,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && newNotes !== "") {
      let tempNotes = JSON.parse(JSON.stringify(notesData));
      if (!tempNotes) tempNotes = [];
      let newObj = {
        bullet: "neutral",
        content: newNotes,
      };
      tempNotes.push(newObj);
      setNotesData(tempNotes);
      setNewNotes("");

      setNotesData(tempNotes);

      updateHandler(id, {
        my_notes: tempNotes,
      });
    }
  };
  const handleTags = (event) => {
    setNewNotes(event.target.value);
  };
  const dynamicBulletHandler = (option = "neutral") => {
    switch (option) {
      case "neutral":
        return (
          <CircleIcon
            sx={{
              color: "#FF6600",
              width: 22,
              height: 22,
            }}
          />
        );

      case "question":
        return (
          <HelpIcon
            sx={{
              color: "#FF6600",
              width: 22,
              height: 22,
            }}
          />
        );
      case "claim":
        return (
          <ErrorIcon
            sx={{
              color: "#FF6600",
              width: 22,
              height: 22,
            }}
          />
        );
      default:
    }
  };
  const handleNotesChange = (event, i) => {
    const tempNotes = JSON.parse(JSON.stringify(notesData));
    tempNotes[i].content = "";
    tempNotes[i].content += event.target.value;
    setNotesData(tempNotes);
  };
  const onBlurField = () => {
    const filteredNotesData = notesData.filter((note) => {
      return note.content?.length !== 0;
    });
    const tempNotes = JSON.parse(JSON.stringify(filteredNotesData));
    setNotesData(tempNotes);

    updateHandler(id, {
      my_notes: tempNotes,
    });
  };
  useEffect(() => {
    notesDataValidator();
  }, [notesData]);

  useEffect(() => {
    setNotesData(item.my_notes);
  }, [item]);

  return (
    <>
      <AccordionDetails sx={accordianDetailStyling}>
        {notesData?.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "15px",
              }}
            >
              <span
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => {
                  handleClick(e);
                  setIndexOfBullet(index);
                }}
                style={{ height: "fit-content", padding: "5px 0" }}
              >
                {dynamicBulletHandler(item.bullet)}
              </span>{" "}
              <MyNotesTextField
                multiline
                value={item.content}
                onChange={(e) => handleNotesChange(e, index)}
                onBlur={() => onBlurField()}
                variant="standard"
              />
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: "2.7px" }}>
          {dynamicBulletHandler("neutral")} &nbsp;
          <input
            type="text"
            className="myNotesInput"
            value={newNotes}
            onChange={handleTags}
            placeholder="Write here"
            style={inputFeildStyle}
            onKeyDown={handleKeyDown}
          />
        </div>
      </AccordionDetails>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose("neutral")}
        MenuListProps={{
          "aria-labelledby": "basic-button",
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
        <MenuItem sx={MenuItemStyles} onClick={() => handleClose("neutral")}>
          <CircleIcon sx={iconStyling} />
          &nbsp; Neutral bullet
        </MenuItem>
        <MenuItem sx={MenuItemStyles} onClick={() => handleClose("question")}>
          <HelpIcon sx={iconStyling} />
          &nbsp; Question
        </MenuItem>
        <MenuItem sx={MenuItemStyles} onClick={() => handleClose("claim")}>
          <ErrorIcon sx={iconStyling} />
          &nbsp; Claim/Answer
        </MenuItem>
      </Menu>
    </>
  );
};
