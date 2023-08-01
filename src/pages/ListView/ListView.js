import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import SquareIcon from "@mui/icons-material/Square";

import { CardStrucutureBook, ChaptersUl, ChaptersLi } from "./styled";
import "./ListView.css";

import BookDetails from "../../components/BookDetails/index";
import PersistentDrawerRight from "../../components/Drawer/Drawer";
import Breadcum from "../../components/Breadcum/Breadcum";

import { fetchIdeacardIcons } from "../../helperFunctions/getIdeacardIcons";
import TriangleRight, {
  TriangleRightOutlined,
} from "../../Assets/triangleRight";

import { updateLevelCounter } from "../../Utils/Features/levelCounterSlice";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateIdentifyIdeaCardData } from "../../Utils/Features/IdentifyIdeaCardSlice";

import {
  fetchListViewData,
  selectIdeaCard,
  getCurrentIdeaCardId,
  getCurrentBook,
  LoadingStatus,
} from "../../Utils/Features/librarySlice";
import { Loading } from "../../components/Loading";
import { IdeaCard } from "../../components/Views/IdeaCard";

// styling
const sub_chapter_divs = {
  display: "flex",
  gap: "7px",
};

function ListView(props) {
  const dispatch = useDispatch();
  const listViewData = useSelector((state) => state.library.listViewData);
  const openBook = useSelector((state) => getCurrentBook(state));
  const openIdeaCardId = useSelector((state) => getCurrentIdeaCardId(state));
  const viewStatus = useSelector((state) => state.library.viewStatus);
  const viewError = useSelector((state) => state.library.viewError);

  const [resizableWidth, setResizableWidth] = useState(null);

  // used for ideacarddivcomponent as props
  const [maxCount, setMaxCount] = useState(1);
  let levelCount = 1;

  let { state } = useLocation();

  const callForLevelCounter = (levelCounter) => {
    if (levelCounter > maxCount) {
      setMaxCount(levelCounter);
    }
  };

  /* FUNCTION RECURSIVE TO SHOW ALL SUBCHAPTERS */
  const getContentRecursive = (item, levelCount) => {
    callForLevelCounter(levelCount);
    return (
      <>
        {item.entries?.length ? (
          <ChaptersUl className="d-none">
            {item.entries.map((chapter, i) => (
              <ChaptersLi
                key={chapter.tocPositionId}
                id={`chapters-${chapter.tocPositionId}`}
              >
                <div
                  className={`${
                    chapter.entries || chapter.highlights?.length
                      ? `caret level-${levelCount}`
                      : `caret-without-content level-${levelCount}`
                  }`}
                  style={sub_chapter_divs}
                  id={`caret-${chapter.tocPositionId}`}
                  onClick={(e) => clickHandler(e, chapter.tocPositionId)}
                >
                  <TriangleRight id="caret-arrow" />
                  <>
                    <TriangleRightOutlined
                      // fontSize="small"
                      id="lastItemDot"
                    />{" "}
                    <span>{chapter.label || ""}</span>
                  </>
                </div>
                {getContentRecursive(chapter, levelCount + 1)}
              </ChaptersLi>
            ))}
          </ChaptersUl>
        ) : null}
        {item.highlights?.length ? (
          <ChaptersUl className="d-none highlightUl">
            {item.highlights.map((highlight, i) => (
              <div key={highlight._id}>
                {highlight.idea_cards?.length
                  ? highlight.idea_cards.map((ideacard, index) => {
                      return (
                        <IdeaCard
                          ideaCardId={ideacard._id}
                          key={highlight._id}
                        />
                      );
                    })
                  : null}
                {highlight.context ? (
                  <ChaptersLi
                    key={highlight._id}
                    id={`highlight-${highlight.position}`}
                    className="highlightLi "
                  >
                    <div className="highlightDiv">
                      <SquareIcon fontSize={"small"} />
                      <span
                        data-start={highlight.start}
                        data-book_id={highlight.book_id}
                        id={highlight._id}
                        className="highlightSpan "
                      >
                        {highlight.context}
                      </span>
                    </div>
                  </ChaptersLi>
                ) : null}
              </div>
            ))}
          </ChaptersUl>
        ) : null}
      </>
    );
  };
  const arrowOpenCloseHandler = (elementItself) => {
    if (!elementItself) return;
    if (
      !elementItself.classList.value.includes("caret-without-content-outer") &&
      !elementItself.classList.value.includes("caret-without-content")
    ) {
      if (elementItself.classList.value.includes("caret-down-45")) {
        elementItself.classList.remove("caret-down-45");
      } else if (!elementItself.classList.value.includes("caret-down-45")) {
        elementItself.classList.add("caret-down-45");
      }
    }
  };
  const displayNoneHandler = (ulChilds, doubleClickAction) => {
    if (ulChilds.length) {
      for (var i = 0; i < ulChilds.length; i++) {
        let item = ulChilds[i].classList;
        if (item) {
          if (item.value.includes("d-none")) {
            ulChilds[i].classList.remove("d-none");
          } else {
            ulChilds[i].classList.add("d-none");
          }
        }
        if (doubleClickAction) {
          let liChilds = ulChilds[i].childNodes;
          for (var j = 0; j < liChilds.length; j++) {
            let item = liChilds[j].id;
            doubleClickOpenOrCloseChapters(item.split("chapters-")[1]);
          }
        }
      }
    }
  };
  /* FUNCTION TO OPEN OR CLOSE SUBCHAPTERS */

  const openOrCloseChapters = (index, doubleClickAction) => {
    const element = document.querySelectorAll(`#chapters-${index} > ul`);
    const el = document.querySelector(`#caret-${index}`);
    arrowOpenCloseHandler(el);
    displayNoneHandler(element, doubleClickAction);
  };
  const doubleClickOpenOrCloseChapters = (index) => {
    const ulChilds = document.querySelector(`#chapters-${index} > ul`);
    if (ulChilds) {
      openOrCloseChapters(index, false);
      const childNodes = ulChilds.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        let item = childNodes[i].id;
        if (item.startsWith("chapters-")) {
          openOrCloseChapters(item.split("chapters-")[1], true);
        }
      }
    } else {
      return;
    }
  };

  const clickHandler = (event, index) => {
    console.log("event.ctrlKey", event.ctrlKey);
    if (event.ctrlKey) {
      // Perform your desired function here

      doubleClickOpenOrCloseChapters(index);
    } else {
      openOrCloseChapters(index, false);
    }
  };

  useEffect(() => {
    // clear the ideacard selection on page reload
    dispatch(selectIdeaCard(null));
    dispatch(updatePersistentDrawer(null));
    dispatch(updateIdentifyIdeaCardData(null));

    if (!listViewData && openBook) {
      if (!localStorage.getItem("ideacardIcons")) {
        fetchIdeacardIcons();
      }
      dispatch(fetchListViewData(openBook._id));
    }
  }, []);

  useEffect(() => {
    dispatch(updateLevelCounter(maxCount));
  }, [maxCount]);

  return (
    <>
      <div
        className="feedParentContainer"
        style={{ alignItems: !openIdeaCardId ? "center" : "start" }}
      >
        {!openBook ? (
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={2}
            sx={{
              height: "78vh",
              textAlign: "center",
            }}
          >
            <h3>Oops! You have not selected a book yet!</h3>
            <h4>
              Go to the Library and select a book first, please. <br />
              😊
            </h4>
          </Stack>
        ) : viewStatus === LoadingStatus.Success ? (
          <>
            <PersistentDrawerRight
              open={openIdeaCardId !== null}
              resizableWidth={resizableWidth}
              childrenx={
                <div
                  style={{
                    width:
                      openIdeaCardId !== null
                        ? "100%"
                        : `${resizableWidth ? resizableWidth + "px" : "100%"}`,
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  id="listViewResizable-Container"
                >
                  <Breadcum state={state} />
                  {listViewData?.book[0] && (
                    <BookDetails
                      book={listViewData?.book[0]}
                      open={openIdeaCardId !== null}
                      resizableWidth={resizableWidth}
                      setResizableWidth={setResizableWidth}
                    />
                  )}
                  <CardStrucutureBook className="listViewParent">
                    {listViewData?.data?.length ? (
                      <ChaptersUl style={{ margin: "0", border: "none" }}>
                        {listViewData?.data?.map((item, index) => {
                          return (
                            <ChaptersLi key={index} id={`chapters-${index}`}>
                              <div
                                className={`${
                                  item.entries || item.highlights.length
                                    ? `caret level-${levelCount}`
                                    : `caret-without-content-outer level-${levelCount}`
                                }`}
                                id={`caret-${index}`}
                                style={{ display: "flex", gap: "7px" }}
                                onClick={(e) => clickHandler(e, index)}
                                // onDoubleClick={() => doubleClickOpenOrCloseChapters(index)}
                              >
                                <TriangleRight />
                                <TriangleRightOutlined
                                  // fontSize="small"
                                  id="lastItemDot"
                                />
                                <span className="ellipsisStyling">
                                  {item.label || ""}
                                </span>
                              </div>
                              {getContentRecursive(item, levelCount + 1)}
                            </ChaptersLi>
                          );
                        })}
                      </ChaptersUl>
                    ) : (
                      <Stack
                        direction={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        spacing={2}
                        sx={{
                          height: "78vh",
                          textAlign: "center",
                        }}
                      >
                        <h3>
                          Oops! There are no Highlights or Ideacards <br />
                          for this Particular Book
                        </h3>
                        <h4>
                          Highlight your favorite passages and share your
                          insights with us <br />
                          😊
                        </h4>
                      </Stack>
                    )}
                  </CardStrucutureBook>
                </div>
              }
            ></PersistentDrawerRight>
          </>
        ) : viewStatus === LoadingStatus.Loading ? (
          <Loading />
        ) : (
          <div title={viewError}>Loading View Data failed.</div>
        )}
      </div>
    </>
  );
}

export default ListView;
