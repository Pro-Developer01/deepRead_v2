import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Checkbox } from "antd";

import AccordionDetails from "@mui/material/AccordionDetails";
import AnchorIcon from "@mui/icons-material/Anchor";

import "../../pages/MyLibrary/MyLibrary.css";

import { accordianDetailStyling, anchorIconStyle } from "./styled";

import { fetchAdjoiningHighlights } from "../../helperFunctions/apiFunctions";
import {
  getIdeaCardById,
  updateLinkedHighlights,
} from "../../Utils/Features/librarySlice";

export const LinkedHighlights = ({
  ideaCardId,
  isEditModeON,
  setIsEditModeON,
}) => {
  const dispatch = useDispatch();
  const ideaCard = useSelector((state) => getIdeaCardById(state, ideaCardId));

  const [beforeHighlights, setBeforeHighlights] = useState(null);
  const [afterHighlights, setAfterHighlights] = useState(null);
  const [linkedHighlights, setLinkedHighlights] = useState(null);
  const [newHighlightIdList, setNewHighlightIdList] = useState([]);
  const [tempEditedHighlights, setTempEditedHighlights] = useState([]);
  const [beforeRange, setBeforeRange] = useState(3);
  const [afterRange, setAfterRange] = useState(3);
  const [containerHeight, setContainerHeight] = useState(null);
  const fullAdjoiningHighlighstData = useRef(null);

  const filterHiglights = (adjoiningHighlightData, linkedHighlightsData) => {
    return adjoiningHighlightData?.filter((highlight) => {
      return linkedHighlightsData?.every((linkedHighlight) => {
        return (
          highlight.context.length > 0 &&
          highlight._id !== linkedHighlight.highlight_id
        );
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
    const bottom =
      Math.floor((e.target.scrollHeight - parseInt(e.target.scrollTop)) / 10) *
        10 <=
      e.target.clientHeight;
    if (e.target.scrollTop === 0) {
      setBeforeRange(beforeRange + 3);
    }
    if (bottom) {
      setAfterRange(afterRange + 3);
    }
  };
  const updateHighlightData = () => {
    if (tempEditedHighlights && tempEditedHighlights.length) {
      setLinkedHighlights(tempEditedHighlights);
      dispatch(
        updateLinkedHighlights({
          ideaCardId: ideaCardId,
          newData: { description: tempEditedHighlights },
        })
      );
      setTempEditedHighlights([]);
      setNewHighlightIdList([]);
      setIsEditModeON(false);
    }
  };

  const handleOutsideClick = (event) => {
    const element = document.getElementById("linkedHighlight-parent");

    if (element && !element.contains(event.target)) {
      updateHighlightData();
    }
  };
  useEffect(() => {
    if (linkedHighlights) {
      filterAdjoiningHighlightsBefore(linkedHighlights);
    }
  }, [linkedHighlights, beforeRange]);

  useEffect(() => {
    if (linkedHighlights) {
      filterAdjoiningHighlightsAfter(linkedHighlights);
    }
  }, [linkedHighlights, afterRange]);

  useEffect(() => {
    if (newHighlightIdList?.length) {
      const highlightDataArray = newHighlightIdList.map((item) =>
        getHighlightData(item)
      );
      const tempHighlights = [...linkedHighlights, ...highlightDataArray];
      tempHighlights.sort((first, second) => first?.start - second?.start);
      setTempEditedHighlights(tempHighlights);
    }
  }, [newHighlightIdList]);

  useEffect(() => {
    if (!isEditModeON) {
      if (tempEditedHighlights?.length) setAfterRange(3);
      setBeforeRange(3);
      setContainerHeight(null);
      updateHighlightData();
      const titlecolor = document.getElementById(
        "panel1a-header highlightColourChange"
      );
      titlecolor.style.color = "#717171";
    }
    if (isEditModeON) {
      const element = document.getElementById(
        "linkedHighlight-conatiner-blur-id"
      );
      const titlecolor = document.getElementById(
        "panel1a-header highlightColourChange"
      );
      titlecolor.style.color = "#ff6600";
      setContainerHeight(element.offsetHeight);
    }
  }, [isEditModeON]);

  const fetchAndSetHighlightlist = () => {
    let mainHighlight;
    fetchAdjoiningHighlights(ideaCard.book_id, ideaCard.start).then(
      (adjoiningData) => {
        if (adjoiningData) {
          fullAdjoiningHighlighstData.current = adjoiningData[0];
          mainHighlight = adjoiningData[0].target[0];
          if (
            (!ideaCard.description || ideaCard.description.length === 0) &&
            mainHighlight
          ) {
            setLinkedHighlights([
              {
                highlight_id: mainHighlight._id,
                start: mainHighlight.start,
                context: mainHighlight.context,
              },
            ]);
          }
          if (ideaCard.description) {
            filterAdjoiningHighlights(ideaCard.description);
          }
        }
      }
    );
    setLinkedHighlights(ideaCard.description);
  };

  useEffect(() => {
    fetchAndSetHighlightlist();
  }, []);

  useEffect(() => {
    fetchAndSetHighlightlist();
  }, [ideaCard]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      updateHighlightData();
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [tempEditedHighlights]);

  return (
    <div
      className={`${
        isEditModeON ? "linkedHighlight-conatiner-blur" : ""
      } overflow-auto`}
      style={{ height: containerHeight ? `${containerHeight - 5}px` : "auto" }}
      onScroll={handleScroll}
      id={"linkedHighlight-conatiner-blur-id"}
    >
      <AccordionDetails
        className="flex flex-col gap-4"
        sx={accordianDetailStyling}
      >
        {beforeHighlights?.length &&
          isEditModeON &&
          beforeHighlights?.map((item, index) => {
            return (
              <div key={item._id} value={item._id}>
                <Checkbox onChange={(e) => handleChange(e, item._id)}>
                  {item.context}
                </Checkbox>
              </div>
            );
          })}

        {linkedHighlights?.map((item, index) => {
          return (
            <div
              key={"linked-" + item.highlight_id}
              style={{ display: "flex", gap: "12px" }}
            >
              <span style={{ height: "fit-content", padding: "0" }}>
                <AnchorIcon sx={anchorIconStyle} />
              </span>
              <span
                style={{
                  fontWeight:
                    item?.highlight_id === ideaCard.highlight_id
                      ? "bold"
                      : "normal",
                }}
              >
                {item?.context}
              </span>
            </div>
          );
        })}

        {afterHighlights?.length &&
          isEditModeON &&
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
