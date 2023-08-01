import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";

import "../../pages/MyLibrary/MyLibrary.css";

import { accordianDetailStyling } from "./styled";

import {
  getBookById,
  getIdeaCardById,
} from "../../Utils/Features/librarySlice";

export const Topics = ({ id, type, updateHandler }) => {
  const item = useSelector((state) =>
    type === "ideaCard" ? getIdeaCardById(state, id) : getBookById(state, id)
  );

  const [tags, setTags] = useState("");
  const [tagsData, setTagsData] = useState(item.tags);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && tags !== "") {
      let tempTags = [...tagsData];
      tempTags.push(tags);
      setTagsData(tempTags);
      setTags("");

      updateHandler(id, {
        tags: tempTags,
      });
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

    updateHandler(id, {
      tags: tempTags,
    });
  };

  useEffect(() => {
    setTagsData(item.tags);
  }, [item]);

  return (
    <>
      <AccordionDetails sx={accordianDetailStyling}>
        {tagsData?.map((item, index) => {
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

        <input
          typr="text"
          value={tags}
          onChange={handleTags}
          placeholder="# Write Here"
          style={textFeildStyle}
          onKeyDown={handleKeyDown}
        />
      </AccordionDetails>
    </>
  );
};
