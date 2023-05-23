import React, { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";
import { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import VpnKeySharpIcon from "@mui/icons-material/VpnKeySharp";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import HeightIcon from "@mui/icons-material/Height";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import "../../pages/MyLibrary/MyLibrary.css";
import { Checkbox, Tooltip } from "antd";

import {
  updateBook,
  updateIdeaCard,
  fetchAdjoiningHighlights,
  updateLinkedHighlights,
  fetchIdeaCardData,
  updateIdeaCardRelation,
} from "../../helperFunctions/apiFunctions";
import AnchorIcon from "@mui/icons-material/Anchor";
// import { ReactComponent as Identify } from "../../Assets/Identify.svg";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getIdeacardIcons } from "../../helperFunctions/getIdeacardIcons";
import AddIcon from "@mui/icons-material/AddCircle";

const iconStyling = {
  color: "#FF6600",
  width: 22,
  height: 22,
};
const accordianDetailStyling = {
  padding: 0,
};
const anchorIconStyle = {
  backgroundColor: "var(--primaryColor)",
  borderRadius: "33px",
  color: "white",
  width: 20,
  height: 20,
  padding: "2px",
};
const MyNotesTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase": {
    padding: 0,
  },
  "& .MuiInputBase-input": {
    fontFamily: "Gaegu, cursive",
    fontSize: "21px",
    fontWeight: 600,
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
const myNotes = [
  {
    bullet: "neutral",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet omnis asperiores, ad soluta inventore harum temporibus sit fugit officia beatae molestias saepe quisquam, ut, eius itaque cumque. Reiciendis, quas aspernatur!",
  },
  {
    bullet: "question",
    content:
      "Willpower and motivation is not the only ingredient you will need. A good system that channels your future self is important too",
  },
  {
    bullet: "claim",
    content: "Work hard on the things that come easy",
  },
  {
    bullet: "neutral",
    content: "Change your habits to change your identity",
  },
];
const topics = ["Personal Development", "Habits", "Productivity"];
const linksInfo = [
  {
    relation: "parent",
    idea_id: "6454a1b0c0cdc20034d53859",
    title: "title 1",
  },
  {
    relation: "child",
    idea_id: "6454a1b0c0cdc20034d53858",
    title: "title 2",
  },
  {
    relation: "neutral",
    idea_id: "6454a1b0c0cdc20034d5385a",
    title: "title 3",
  },
];
const linksInfoMenuItems = [
  {
    bullet: "parent",
    content: "Parent link",
    icon: (
      <UpgradeIcon
        sx={{
          backgroundColor: "grey",
          borderRadius: "33px",
          color: "white",
          width: 19,
          height: 19,
        }}
      />
    ),
  },
  {
    bullet: "child",
    content: "Child link",
    icon: (
      <UpgradeIcon
        sx={{
          backgroundColor: "grey",
          borderRadius: "33px",
          color: "white",
          width: 19,
          height: 19,
          transform: "rotateZ(180deg)",
        }}
      />
    ),
  },
  {
    bullet: "neutral",
    content: "Neutral Link",
    icon: (
      <HeightIcon
        sx={{
          backgroundColor: "grey",
          borderRadius: "33px",
          color: "white",
          width: 19,
          height: 19,
          transform: "rotateZ(90deg)",
        }}
      />
    ),
  },
];
const recommendation = ["Erwin", "Mauro"];
const accordianBorder = {
  borderTop: "1px solid var(--borderColors)",
  color: "var(--fontColor)",
};
const MenuItemStyles = {
  margin: "5px 1px",
  borderRadius: "30px",
};
const headingStyle = {
  marginLeft: -2, // Set left margin to zero
};

const updateData = (newData, bookId, ideaCardId) => {
  if (bookId) {
    updateBook(bookId, newData);
  }
  if (ideaCardId) {
    updateIdeaCard(ideaCardId, newData);
  }
};

const MyNotes = ({ myNotesData, bookId, ideaCardId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [indexOfBullet, setIndexOfBullet] = useState(0);
  const [newNotes, setNewNotes] = useState("");
  const [notesData, setNotesData] = useState(myNotesData);
  const open = Boolean(anchorEl);

  const inputFeildStyle = {
    width: "100%",
    padding: "3px 0px",
    fontWeight: 600,
    border: "none",
    marginLeft: "5px",
    fontFamily: "Gaegu,cursive",
    fontSize: "21px",
    fontWeight: 600,
  };

  const notesDataValidator = () => {
    if (myNotesData?.length && typeof myNotesData[0] === "string") {
      const updatedMyNotesData = [];
      myNotesData?.forEach((item) => {
        updatedMyNotesData.push({
          bullet: "neutral",
          content: item,
        });
      });
      setNotesData(updatedMyNotesData);
    } else {
      setNotesData(myNotesData);
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option) => {
    setAnchorEl(null);
    // setIconOption(option);
    const tempNotes = notesData;
    tempNotes[indexOfBullet].bullet = option;
    setNotesData(tempNotes);
    updateData(
      {
        my_notes: tempNotes,
      },
      bookId,
      ideaCardId
    );
  };

  const handleKeyDown = (event) => {
    console.log("A key was pressed...", event.key);
    if (event.key === "Enter" && newNotes !== "") {
      let tempNotes = JSON.parse(JSON.stringify(notesData));
      let newObj = {
        bullet: "neutral",
        content: newNotes,
      };
      tempNotes.push(newObj);
      setNotesData(tempNotes);
      setNewNotes("");
      console.log("tempNotes", tempNotes);

      setNotesData(tempNotes);
      updateData(
        {
          my_notes: tempNotes,
        },
        bookId,
        ideaCardId
      );
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
      return note.content.length !== 0;
    });
    const tempNotes = JSON.parse(JSON.stringify(filteredNotesData));
    setNotesData(tempNotes);
    updateData(
      {
        my_notes: tempNotes,
      },
      bookId,
      ideaCardId
    );
  };
  useEffect(() => {
    notesDataValidator();
  }, [myNotesData]);
  return (
    <>
      <AccordionDetails sx={accordianDetailStyling}>
        {notesData?.length ? (
          <>
            {notesData.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{ display: "flex", gap: "8px", marginBottom: "15px" }}
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
          </>
        ) : (
          <></>
        )}
        {notesData ? (
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
        ) : (
          <span>No Data Available</span>
        )}
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
const LinkedHighlights = ({
  highlightId,
  ideaCardId,
  bookId,
  position,
  highlightData,
  isEditModeON
}) => {
  const [beforeHighlights, setBeforeHighlights] = useState(null);
  const [afterHighlights, setAfterHighlights] = useState(null);
  const [linkedHighlights, setLinkedHighlights] = useState(null);
  const [newHighlightIdList, setNewHighlightIdList] = useState([]);
  const [beforeRange, setBeforeRange] = useState(3);
  const [afterRange, setAfterRange] = useState(3);
  const [containerHeight, setContainerHeight] = useState(null);
  const fullAdjoiningHighlighstData = useRef(null);

  const filterHiglights = (adjoiningHighlightData, linkedHighlightsData) => {
    return adjoiningHighlightData?.filter((highlight) => {
      return linkedHighlightsData?.every((linkedHighlight) => {
        return highlight._id !== linkedHighlight.highlight_id;
      });
    });
  };



  const getHighlightData = (highlightId) => {
    const highlights = [...beforeHighlights, ...afterHighlights];
    const filteredHighlight = highlights.filter(
      (highlight) => highlight._id === highlightId
    );
    if (filteredHighlight.length > 0) {
      return {
        highlight_id: highlightId,
        start: filteredHighlight[0].start,
        context: filteredHighlight[0].context,
      };
    }
    return null;
  };

  const filterAdjoiningHighlights = (linkedHighlightsData) => {
    const tempBeforeHighlights = filterHiglights(
      fullAdjoiningHighlighstData?.current?.before,
      linkedHighlightsData
    );
    setBeforeHighlights(
      tempBeforeHighlights?.slice(
        tempBeforeHighlights.length - beforeRange,
        tempBeforeHighlights.length
      )
    );
    const tempAfterHighlights = filterHiglights(
      fullAdjoiningHighlighstData?.current?.after,
      linkedHighlightsData
    );
    setAfterHighlights(tempAfterHighlights?.slice(0, afterRange));
  };
  const filterAdjoiningHighlightsBefore = (linkedHighlightsData) => {
    const tempBeforeHighlights = filterHiglights(
      fullAdjoiningHighlighstData?.current?.before,
      linkedHighlightsData
    );
    setBeforeHighlights(
      tempBeforeHighlights?.slice(
        tempBeforeHighlights.length - beforeRange,
        tempBeforeHighlights.length
      )
    );

  };

  const filterAdjoiningHighlightsAfter = (linkedHighlightsData) => {

    const tempAfterHighlights = filterHiglights(
      fullAdjoiningHighlighstData?.current?.after,
      linkedHighlightsData
    );
    setAfterHighlights(tempAfterHighlights?.slice(0, afterRange));
  };

  const handleChange = (e, value) => {
    if (e.target.checked) {
      setNewHighlightIdList([...newHighlightIdList, value]);
    }
    if (!e.target.checked) {
      const updatedList = newHighlightIdList?.filter((item) => item !== value);
      setNewHighlightIdList(updatedList);
    }
  };

  const handleScroll = (e) => {
    const bottom = Math.floor((e.target.scrollHeight - parseInt(e.target.scrollTop)) / 10) * 10 <= e.target.clientHeight;
    if (e.target.scrollTop === 0) {
      setBeforeRange(beforeRange + 3);
    }
    if (bottom) {
      setAfterRange(afterRange + 3);
    }
  };
  const updateHighlightData = (highlightDataArray) => {
    console.log('linkedHighlights inside', linkedHighlights)
    console.log('highlightDataArray inside', highlightDataArray)
    if (linkedHighlights && highlightDataArray.length) {
      const tempHighlights = [...linkedHighlights, ...highlightDataArray];
      tempHighlights.sort((first, second) => first.start - second.start);
      setLinkedHighlights(tempHighlights);
      updateLinkedHighlights(ideaCardId, { description: tempHighlights });
    }
  }

  useEffect(() => {
    if (linkedHighlights) {
      filterAdjoiningHighlightsBefore(linkedHighlights);
    }
  }, [linkedHighlights, beforeRange]);
  useEffect(() => {
    console.log('afterRange', afterRange)
    if (linkedHighlights) {
      filterAdjoiningHighlightsAfter(linkedHighlights);
    }
  }, [linkedHighlights, afterRange]);
  useEffect(() => {
    if (!isEditModeON) {
      if (newHighlightIdList?.length)
        setAfterRange(3)
      setBeforeRange(3)
      setContainerHeight(null)
      {
        const highlightDataArray = []
        newHighlightIdList.forEach(item => { highlightDataArray.push(getHighlightData(item)) })
        setNewHighlightIdList([])
        updateHighlightData(highlightDataArray);
      }
      const titlecolor = document.getElementById('panel1a-header highlightColourChange')
      titlecolor.style.color = '#717171';
    }
    if (isEditModeON) {
      const element = document.getElementById('linkedHighlight-conatiner-blur-id')
      const titlecolor = document.getElementById('panel1a-header highlightColourChange')
      titlecolor.style.color = '#ff6600';
      setContainerHeight(element.offsetHeight)
      console.log('  element.', element.style.height, element.offsetHeight)
    }
    console.log('afterHighlights ', afterHighlights, beforeHighlights)

  }, [isEditModeON]);
  useEffect(() => {
    let mainHighlight;
    fetchAdjoiningHighlights(bookId, position).then((adjoiningData) => {
      if (adjoiningData) {
        fullAdjoiningHighlighstData.current = adjoiningData[0];
        mainHighlight = adjoiningData[0].target[0];
        if ((!highlightData || highlightData.length === 0) && mainHighlight) {
          setLinkedHighlights([
            {
              highlight_id: mainHighlight._id,
              start: mainHighlight.start,
              context: mainHighlight.context,
            },
          ]);
        }
        if (highlightData) {
          filterAdjoiningHighlights(highlightData);
        }
      }
    });
    setLinkedHighlights(highlightData);
  }, []);



  return (
    <div
      className={`${isEditModeON ? "linkedHighlight-conatiner-blur" : ""} overflow-auto`}
      style={{ height: containerHeight ? `${containerHeight - 5}px` : "auto" }}
      onScroll={handleScroll}
      id={"linkedHighlight-conatiner-blur-id"}
    >
      <AccordionDetails
        className="flex flex-col gap-4"
        sx={accordianDetailStyling}
      >
        {
          beforeHighlights?.length && isEditModeON &&
          beforeHighlights?.map((item, index) => {
            return (
              <div key={item._id} value={item._id}>
                <Checkbox onChange={(e) => handleChange(e, item._id)}>
                  {item.context}
                </Checkbox>
              </div>
            );
          })
        }

        {linkedHighlights?.map((item, index) => {
          return (
            <div style={{ display: "flex", gap: "12px" }}>
              <span style={{ height: "fit-content", padding: "0" }}>
                <AnchorIcon sx={anchorIconStyle} />
              </span>
              <span
                style={{
                  fontWeight: item._id === highlightId ? "bold" : "normal",
                }}
              >
                {item.context}
              </span>
            </div>
          );
        })}

        {afterHighlights?.length && isEditModeON &&
          beforeHighlights?.map((item, index) => {
            return (
              <div key={item._id} value={item._id}>
                <Checkbox onChange={(e) => handleChange(e, item._id)}>
                  {item.context}
                </Checkbox>
              </div>
            );
          })}
      </AccordionDetails>

      <style>{`
  .ant-checkbox+span {
    padding-inline-start: 16px !important;
    font-size: 16px;
    font-family: 'Lato';
    color: var(--fontColor);
  }

  .linkedHighlight-conatiner-blur::before
  {
    content: "";
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    height: 50px;
    pointer-events: none;
    background: rgb(255,255,255);
    background: linear-gradient(0deg, rgba(255,255,255,0.3835221832873774) 0%, rgba(255,255,255,1) 100%);
  }
  .linkedHighlight-conatiner-blur::after
  {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    pointer-events: none;
    background: rgb(255,255,255);
    background: linear-gradient(180deg, rgba(255,255,255,0.3835221832873774) 0%, rgba(255,255,255,1) 100%);
  }
  .editSquareHighlight{
    margin-left: -34px;
    margin-right: 11px;
    margin-top: -1px;

  }
  /* Styles for checkbox */
.ant-checkbox-wrapper:hover .ant-checkbox-inner,
.ant-checkbox:hover .ant-checkbox-inner {
  border-color: #ff6600 !important;
}

.ant-checkbox-checked .ant-checkbox-inner {
  background-color: #ff6600 !important;
  border-color: transparent !important;
}

.ant-checkbox-checked .ant-checkbox-inner::after {
  border-color: white;
}

.ant-checkbox-checked:hover .ant-checkbox-inner {
  border-color: transparent !important;
}
.ant-checkbox-checked:after{
border:  2px solid orange !important;
}
.ant-checkbox{
  padding: 3px 0;

}
.ant-tooltip-inner
{
  color: black !important;
}
.ant-tooltip-content
{
  width: 65%;
}
  
        `}</style>
    </div>
  );
};
const Topics = ({ tagData, bookId, ideaCardId }) => {
  const [tags, setTags] = useState("");
  const [tagsData, setTagsData] = useState(tagData);
  const handleKeyDown = (event) => {
    console.log("A key was pressed", event.key);
    if (event.key === "Enter" && tags !== "") {
      let tempTags = [...tagsData];
      tempTags.push(tags);
      setTagsData(tempTags);
      setTags("");

      updateData(
        {
          tags: tempTags,
        },
        bookId,
        ideaCardId
      );
    }
  };
  const handleTags = (event) => {
    setTags(event.target.value);
  };
  const textFeildStyle = {
    background: "#EBEBEB",
    borderRadius: "33px",
    width: "127px",
    padding: " 8px 11px",
    fontWeight: 600,
    border: "none",
  };
  const handleDelete = (item) => {
    let tempTags = [...tagsData];
    tempTags.splice(tempTags.indexOf(item), 1);
    setTagsData(tempTags);

    updateData(
      {
        tags: tempTags,
      },
      bookId,
      ideaCardId
    );
  };

  useEffect(() => {
    setTagsData(tagData);
  }, [tagData]);
  return (
    <>
      <AccordionDetails sx={accordianDetailStyling}>
        {tagsData?.length ? (
          <>
            {tagsData.map((item, index) => {
              return (
                <div key={index} style={{ margin: "3px 0" }}>
                  <Chip
                    sx={{ fontWeight: 600 }}
                    label={`# ${item}`}
                    onDelete={() => handleDelete(item)}
                    deleteIcon={<CloseIcon />}
                  />
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
        {tagsData ? (
          <input
            typr="text"
            value={tags}
            onChange={handleTags}
            placeholder="# Write Here"
            style={textFeildStyle}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span>No Data Available</span>
        )}
      </AccordionDetails>
    </>
  );
};

const LinkIdeaCard = ({
  ideaCardToLinkId,
  resultCards,
  linkedCardsData,
  setLinkedCardsCallback,
}) => {
  const [cards, setCards] = useState(resultCards);
  useEffect(() => {
    setCards(resultCards);
  }, [resultCards]);

  const handleAdd = (cardId, cardTitle) => {
    let linkedCardsDataTemp = Object.assign([], linkedCardsData);
    linkedCardsDataTemp.push({
      relation: "parent",
      idea_id: cardId,
      title: cardTitle,
    });
    setLinkedCardsCallback(linkedCardsDataTemp);

    updateIdeaCardRelation(ideaCardToLinkId, {
      linked_structure: linkedCardsDataTemp,
    });

    setCards([]);
  };
  return (
    <>
      {cards?.map((card, index) => {
        return (
          <>
            <div
              key={index}
              style={{
                display: "flex",
                gap: "8px",
                margin: "3px 0px",
                paddingLeft: "10px",
              }}
            >
              <AddIcon
                key={index}
                onClick={() => handleAdd(card._id, card.title)}
              />
              {getIdeacardIcons(card.label_id)}
              <span>{card.title}</span>
            </div>
          </>
        );
      })}
    </>
  );
};

const LinkStructure = ({ ideaCardId, linkedIdeaCards }) => {
  const [link, setLink] = useState("");
  const [indexOfBullet, setIndexOfBullet] = useState(0);
  const [linkData, setLinkData] = useState(linkedIdeaCards);
  const [activeBullet, setActiveBullet] = useState("horizontal");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ideaCardsSearchData, setIdeaCardsSearchData] = useState([]);
  const open = Boolean(anchorEl);

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

    updateIdeaCardRelation(ideaCardId, {
      linked_structure: tempLinkData,
    });
    setLinkData(tempLinkData);
  };
  const handleKeyDown = (event) => { };

  const handleTags = (event) => {
    setLink(event.target.value);
    fetchIdeaCardData({ title: event.target.value }).then((ideaCardData) => {
      setIdeaCardsSearchData(ideaCardData);
    });
  };
  const dynamicBulletHandler = (option) => {
    switch (option) {
      case "parent":
        return (
          <UpgradeIcon
            sx={{
              backgroundColor: "grey",
              borderRadius: "33px",
              color: "white",
              width: 19,
              height: 19,
            }}
          />
        );

      case "child":
        return (
          <UpgradeIcon
            sx={{
              backgroundColor: "grey",
              borderRadius: "33px",
              color: "white",
              width: 19,
              height: 19,
              transform: "rotateZ(180deg)",
            }}
          />
        );
      case "neutral":
        return (
          <HeightIcon
            sx={{
              backgroundColor: "grey",
              borderRadius: "33px",
              color: "white",
              width: 19,
              height: 19,
              transform: "rotateZ(90deg)",
            }}
          />
        );
    }
  };
  return (
    <>
      <AccordionDetails sx={accordianDetailStyling}>
        <div style={{ display: "flex", alignItems: "center", gap: "2.7px" }}>
          {dynamicBulletHandler("neutral")} &nbsp;
          <VpnKeySharpIcon
            fontSize="small"
            sx={{
              backgroundColor: "#FF6600",
              borderRadius: "33px",
              color: "white",
              width: 19,
              height: 19,
              padding: "3px",
            }}
          />
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
              key={index}
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

              <VpnKeySharpIcon
                fontSize="small"
                sx={{
                  backgroundColor: "#FF6600",
                  borderRadius: "33px",
                  color: "white",
                  width: 19,
                  height: 19,
                  padding: "3px",
                }}
              />
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
const Recommendation = ({ recommendations }) => {
  return (
    <>
      <AccordionDetails sx={accordianDetailStyling}>
        {recommendations?.length ? (
          recommendations.map((item, index) => {
            return (
              <div key={index} style={{ margin: "5px 0" }}>
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: "purple",
                        width: 24,
                        height: 24,
                        fontSize: 10,
                        color: "white !important",
                      }}
                    >
                      {item[0]}
                    </Avatar>
                  }
                  label={item}
                  sx={{ fontWeight: 600 }}
                  variant="outlined"
                />
              </div>
            );
          })
        ) : (
          <span>No Data Available</span>
        )}
      </AccordionDetails>
    </>
  );
};

export default function LibraryAccordian({ metaData }) {
  return (
    <>
      {/* //Mynotes */}
      <Accordion elevation={0} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ color: "var(--fontColor)", ...headingStyle }}
        >
          MY NOTES
        </AccordionSummary>
        <MyNotes
          myNotesData={
            metaData[0] && !metaData[0]?.my_notes ? [] : metaData[0]?.my_notes
          }
          bookId={metaData[0]?._id}
        />
      </Accordion>

      {/* //Topic */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          TAGS
        </AccordionSummary>
        <Topics
          tagData={metaData[0] && !metaData[0]?.tags ? [] : metaData[0]?.tags}
          bookId={metaData[0]?._id}
        />
      </Accordion>

      {/* //Recommendation */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          RECOMMENDED BY
        </AccordionSummary>
        <Recommendation recommendations={metaData[0]?.recomendation} />
      </Accordion>

      {/* //Graphs */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          GRAPH
        </AccordionSummary>
        <AccordionDetails sx={accordianDetailStyling}>
          <p>to be done later</p>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export function IdeaCardAccordian({ data }) {
  const [editIconVisibility, setEditIconVisibility] = useState(false)
  const [isEditModeON, setIsEditModeON] = useState(false);

  console.log("data of Ideacard", data);

  return (
    <div>
      {/* //Mynotes */}
      <Accordion elevation={0} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ color: "var(--fontColor)", ...headingStyle }}
        >
          MY NOTES
        </AccordionSummary>
        <MyNotes myNotesData={data?.my_notes} ideaCardId={data?._id} />
      </Accordion>

      {/* //Topic */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          TAGS
        </AccordionSummary>
        <Topics tagData={data?.tags} ideaCardId={data?._id} />
      </Accordion>

      {/* //LINKED HIGHLIGHTS */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true} onMouseEnter={() => setEditIconVisibility(true)} onMouseLeave={() => setEditIconVisibility(false)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header highlightColourChange"
          sx={headingStyle}
        >
          {editIconVisibility &&
            <Tooltip placement="bottomLeft" title={<span> <strong>Click</strong> to add or remove linked highlights</span>} zIndex={9999} color="lightgrey" >
              <span className="material-symbols-outlined editSquareHighlight cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setIsEditModeON(!isEditModeON) }}
                style={{ color: isEditModeON ? "var(--primaryColor)" : "var(--fontColor)" }}
              >
                edit_square
              </span>
            </Tooltip>}
          LINKED HIGHLIGHTS
        </AccordionSummary>
        <LinkedHighlights
          highlightId={data?.highlight_id}
          ideaCardId={data?._id}
          bookId={data?.book_id}
          position={data?.start}
          highlightData={data?.description}
          isEditModeON={isEditModeON}
        />
      </Accordion>

      {/* //BOOK STRUCTURE */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          BOOK STRUCTURE
        </AccordionSummary>
        <AccordionDetails sx={accordianDetailStyling}>
          <p>to be done later</p>
        </AccordionDetails>
      </Accordion>

      {/* //LINK STRUCTURE */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          LINK STRUCTURE
        </AccordionSummary>
        <LinkStructure
          ideaCardId={data?._id}
          linkedIdeaCards={data?.linked_structure}
        />
      </Accordion>
    </div>
  );
}
export function CreateIdeaCardAccordian({ data }) {
  const [editIconVisibility, setEditIconVisibility] = useState(false)
  const [isEditModeON, setIsEditModeON] = useState(false);
  // console.log("data of Ideacard", data);
  return (
    <div>
      {/* //Mynotes */}
      <Accordion elevation={0} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ color: "var(--fontColor)", ...headingStyle }}
        >
          MY NOTES
        </AccordionSummary>
        <MyNotes myNotesData={data?.my_notes} ideaCardId={data?._id} />
      </Accordion>
      {/* //LINKED HIGHLIGHTS */}
      {data?.highlight_id && (
        <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true} onMouseEnter={() => setEditIconVisibility(true)} onMouseLeave={() => setEditIconVisibility(false)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={headingStyle}
          >
            {editIconVisibility &&
              <Tooltip placement="bottomLeft" title={<span> <strong>Click</strong> to add or remove linked highlights</span>} zIndex={9999} color="lightgrey" >
                <span className="material-symbols-outlined editSquareHighlight cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setIsEditModeON(!isEditModeON) }}
                  style={{ color: isEditModeON ? "var(--primaryColor)" : "var(--fontColor)" }}
                >
                  edit_square
                </span>
              </Tooltip>}
            LINKED HIGHLIGHTS
          </AccordionSummary>
          <LinkedHighlights
            highlightId={data?.highlight_id}
            ideaCardId={data?._id}
            bookId={data?.book_id}
            position={data?.start}
            highlightData={data?.description}
            isEditModeON={isEditModeON}
          />
        </Accordion>
      )}
      {/* //Topic */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          TAGS
        </AccordionSummary>
        <Topics tagData={data?.tags} ideaCardId={data?._id} />
      </Accordion>

      {/* //BOOK STRUCTURE */}
      {data?.highlight_id && (
        <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={headingStyle}
          >
            BOOK STRUCTURE
          </AccordionSummary>
          <AccordionDetails sx={accordianDetailStyling}>
            <p>to be done later</p>
          </AccordionDetails>
        </Accordion>
      )}

      {/* //LINK STRUCTURE */}
      <Accordion elevation={0} sx={accordianBorder} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={headingStyle}
        >
          LINK STRUCTURE
        </AccordionSummary>
        <LinkStructure
          ideaCardId={data?._id}
          linkedIdeaCards={data?.linked_structure}
        />
      </Accordion>
    </div>
  );
}
