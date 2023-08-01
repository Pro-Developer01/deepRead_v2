import { useState } from "react";
import { useDispatch } from "react-redux";

import { Tooltip } from "antd";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "../../pages/MyLibrary/MyLibrary.css";

import {
  accordianDetailStyling,
  headingStyle,
  accordianBorder,
} from "./styled";

import { MyNotes } from "./MyNotes";
import { LinkStructure } from "./LinkIdeaCard/LinkStructure";
import { Recommendation } from "./Recommendation";
import { LinkedHighlights } from "./LinkedHighlights";
import { Topics } from "./Topics";

import { updateBook, updateIdeaCard } from "../../Utils/Features/librarySlice";

export function CommonInsights({ type, id }) {
  const dispatch = useDispatch();
  const updateHandler = (id, newData) => {
    if (type === "ideaCard") {
      dispatch(
        updateIdeaCard({
          ideaCardId: id,
          newData: newData,
        })
      );
    }
    if (type === "book") {
      dispatch(
        updateBook({
          bookId: id,
          newData: newData,
        })
      );
    }
  };
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
        <MyNotes id={id} type={type} updateHandler={updateHandler} />
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
        <Topics id={id} type={type} updateHandler={updateHandler} />
      </Accordion>
    </>
  );
}

export default function BookInsights({ id }) {
  return (
    <>
      <CommonInsights type="book" id={id} />

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
        <Recommendation id={id} />
      </Accordion>

      {/* //Graphs 
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
      */}
    </>
  );
}

export function IdeaCardInsights({ id, highlight }) {
  const [editIconVisibility, setEditIconVisibility] = useState(false);
  const [isEditModeON, setIsEditModeON] = useState(false);
  return (
    <div>
      <CommonInsights type="ideaCard" id={id} />

      {/* //LINKED HIGHLIGHTS */}
      {highlight && (
        <Accordion
          id="linkedHighlight-parent"
          elevation={0}
          sx={accordianBorder}
          defaultExpanded={true}
          onMouseEnter={() => setEditIconVisibility(true)}
          onMouseLeave={() => setEditIconVisibility(false)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header highlightColourChange"
            sx={headingStyle}
          >
            {editIconVisibility && (
              <Tooltip
                placement="bottomLeft"
                title={
                  <span>
                    {" "}
                    <strong>Click</strong> to add or remove linked highlights
                  </span>
                }
                zIndex={9999}
                color="lightgrey"
              >
                <span
                  className="material-symbols-outlined editSquareHighlight cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModeON(!isEditModeON);
                  }}
                  style={{
                    color: isEditModeON
                      ? "var(--primaryColor)"
                      : "var(--fontColor)",
                  }}
                >
                  edit_square
                </span>
              </Tooltip>
            )}
            LINKED HIGHLIGHTS
          </AccordionSummary>
          <LinkedHighlights
            ideaCardId={id}
            isEditModeON={isEditModeON}
            setIsEditModeON={setIsEditModeON}
          />
        </Accordion>
      )}

      {/* //BOOK STRUCTURE 
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
        */}

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
        <LinkStructure ideaCardId={id} />
      </Accordion>
    </div>
  );
}
