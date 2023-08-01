import React, { useState, useEffect } from "react";
import Breadcum from "../../components/Breadcum/Breadcum";
import { useLocation } from "react-router-dom";
import { Col, Row } from "antd";

import Stack from "@mui/material/Stack";
import SquareIcon from "@mui/icons-material/Square";

import "../ListView/ListView.css";
//style component
import { CardStrucutureBook, ChaptersUl, ChaptersLi } from "../ListView/styled";

import BookDetails from "../../components/BookDetails/index";
import { fetchIdeacardIcons } from "../../helperFunctions/getIdeacardIcons";
import { useSelector, useDispatch } from "react-redux";

import { updateLevelCounter } from "../../Utils/Features/levelCounterSlice";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateIdentifyIdeaCardData } from "../../Utils/Features/IdentifyIdeaCardSlice";

import {
  fetchListViewData,
  selectIdeaCard,
  getCurrentBook,
  LoadingStatus,
} from "../../Utils/Features/librarySlice";

import { Loading } from "../../components/Loading";
import { IdeaCard } from "../../components/Views/IdeaCard";

export default function TileView() {
  let { state } = useLocation();
  let levelCountGlobal = useSelector((state) =>
    state?.levelCounterReducer?.currentLevel?.value
      ? state?.levelCounterReducer?.currentLevel?.value
      : 1
  );

  const [resizableWidth, setResizableWidth] = useState(null);
  const [filteredTileViewData, setFilteredTileViewData] = useState({});
  const [bookMetaData, setBookMetaData] = useState({});

  const tileViewData = useSelector((state) => state.library.listViewData);
  const openBook = useSelector((state) => getCurrentBook(state));
  const viewStatus = useSelector((state) => state.library.viewStatus);
  const viewError = useSelector((state) => state.library.viewError);

  const [maxCount, setMaxCount] = useState(1);
  let levelCount = 1;
  const dispatch = useDispatch();
  console.log({ levelCountGlobal });

  const callForLevelCounter = (levelCounter) => {
    if (levelCounter > maxCount) {
      setMaxCount(levelCounter);
    }
  };

  const dataIterator = (data) => {
    const iteratedData = [];
    data?.forEach((item) => {
      if (item.entries?.length) {
        item.entries.forEach((data) => {
          iteratedData.push(data);
        });
      }
    });
    return iteratedData;
  };

  const dataFilterByLevel = (levelCountGlobal) => {
    if (levelCountGlobal === 1) {
      setFilteredTileViewData(tileViewData?.data);
    }
    let filteredData = [];
    if (levelCountGlobal === 2) {
      filteredData = [];
      filteredData = [...dataIterator(tileViewData?.data)];
      setFilteredTileViewData(filteredData);
    }
    if (levelCountGlobal === 3) {
      filteredData = [];
      tileViewData?.data?.forEach((item) => {
        if (item.entries?.length) {
          filteredData = [...filteredData, ...dataIterator(item.entries)];
        }
      });
      setFilteredTileViewData(filteredData);
    }
    if (levelCountGlobal === 4) {
      filteredData = [];
      tileViewData?.data?.forEach((item) => {
        if (item.entries?.length) {
          item.entries.forEach((item) => {
            if (item.entries?.length) {
              filteredData = [...filteredData, ...dataIterator(item.entries)];
            }
          });
        }
      });
      setFilteredTileViewData(filteredData);
    }

    if (levelCountGlobal === 5) {
      filteredData = [];
      tileViewData?.data?.forEach((item) => {
        if (item.entries?.length) {
          item.entries.forEach((item) => {
            if (item.entries?.length) {
              item.entries.forEach((item) => {
                if (item.entries?.length) {
                  filteredData = [
                    ...filteredData,
                    ...dataIterator(item.entries),
                  ];
                }
              });
            }
          });
        }
      });
      setFilteredTileViewData(filteredData);
    }
  };

  const getContentRecursive = (item, levelCount) => {
    callForLevelCounter(levelCount);
    return (
      <>
        {item.entries?.length ? (
          <ChaptersUl className="!mx-0 !border-x-0">
            {item.entries.map((k, i) => (
              <>{getContentRecursive(k, levelCount + 1)}</>
            ))}
          </ChaptersUl>
        ) : null}
        {item.highlights?.length ? (
          <ChaptersUl className=" highlightUl !mx-0 !border-x-0">
            {item.highlights.map((highlight, i) => (
              <>
                {highlight.idea_cards?.length
                  ? highlight.idea_cards.map((ideacard, index) => {
                      return <IdeaCard ideaCardId={ideacard._id} />;
                    })
                  : null}
                {highlight.context ? (
                  <ChaptersLi
                    key={highlight._id}
                    id={`highlight-${highlight.position}`}
                    className="highlightLi !pl-0"
                  >
                    <div className="highlightDiv !ml-0">
                      <SquareIcon fontSize={"small"} />
                      <span
                        data-start={highlight.start}
                        data-book_id={highlight.book_id}
                        id={highlight._id}
                        className="highlightSpan "
                      >
                        {highlight.context.length > 152
                          ? highlight.context.slice(0, 151) + "..."
                          : highlight.context}
                      </span>
                    </div>
                  </ChaptersLi>
                ) : null}
              </>
            ))}
          </ChaptersUl>
        ) : null}{" "}
      </>
    );
  };

  useEffect(() => {
    // clear the ideacard selection on page reload
    dispatch(selectIdeaCard(null));
    dispatch(updatePersistentDrawer(null));
    dispatch(updateIdentifyIdeaCardData(null));

    if (!tileViewData && openBook) {
      if (!localStorage.getItem("ideacardIcons")) {
        fetchIdeacardIcons();
      }
      dispatch(fetchListViewData(openBook._id));
    }
    if (tileViewData && !filteredTileViewData) {
      console.log("..... filter lvl count", levelCountGlobal);
      dataFilterByLevel(levelCountGlobal);
    }
  }, []);

  useEffect(() => {
    dispatch(updateLevelCounter(maxCount));
  }, [maxCount]);

  useEffect(() => {
    if (tileViewData?.book) {
      setBookMetaData(tileViewData?.book[0]);
    }
  }, [tileViewData]);
  useEffect(() => {
    dataFilterByLevel(levelCountGlobal);
  }, [levelCountGlobal, tileViewData]);

  return (
    <>
      <div
        className="feedParentContainer"
        style={{ alignItems: "center", overflow: "auto" }}
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
            <div
              style={{
                width: true
                  ? "100%"
                  : `${resizableWidth ? resizableWidth + "px" : "100%"}`,
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              className="items-center"
              id="listViewResizable-Container"
            >
              <div className="w-1/2">
                <Breadcum state={state} />
                {bookMetaData && bookMetaData.title && (
                  <BookDetails
                    book={bookMetaData}
                    open={true}
                    resizableWidth={resizableWidth}
                    setResizableWidth={setResizableWidth}
                    showResize={false}
                  />
                )}
              </div>

              {filteredTileViewData?.length ? (
                <Row className="justify-center gap-2.5">
                  {filteredTileViewData?.map((item, index) => {
                    return item.highlights?.length || item.entries?.length ? (
                      <Col span={11}>
                        <CardStrucutureBook className="listViewParent ">
                          <ChaptersUl
                            style={{ margin: "0", border: "none" }}
                            className="h-44"
                          >
                            <ChaptersLi key={index} id={`chapters-${index}`}>
                              <div
                                className={`${
                                  item.entries || item.highlights.length
                                    ? `caret level-${levelCount}`
                                    : `caret-without-content-outer level-${levelCount}`
                                }`}
                                id={`caret-${index}`}
                                style={{
                                  display: "flex",
                                  gap: "7px",
                                  position: "sticky",
                                  top: "-7px",
                                  background: "white",
                                  marginLeft: "-15px",
                                  paddingLeft: "15px",
                                }}
                              >
                                <span className="ellipsisStyling">
                                  {item.label || ""}
                                </span>
                              </div>
                              {item.highlights?.length ? (
                                <ChaptersUl className=" highlightUl !mx-0 !border-x-0">
                                  {item.highlights.map((highlight, i) => (
                                    <>
                                      {highlight.idea_cards?.length
                                        ? highlight.idea_cards.map(
                                            (ideacard, index) => {
                                              return (
                                                <IdeaCard
                                                  ideaCardId={ideacard._id}
                                                />
                                              );
                                            }
                                          )
                                        : null}
                                      {highlight.context ? (
                                        <ChaptersLi
                                          key={highlight._id}
                                          id={`highlight-${highlight.position}`}
                                          className="highlightLi !pl-0"
                                        >
                                          <div className="highlightDiv !ml-0">
                                            <SquareIcon fontSize={"small"} />
                                            <span
                                              data-start={highlight.start}
                                              data-book_id={highlight.book_id}
                                              id={highlight._id}
                                              className="highlightSpan "
                                            >
                                              {highlight.context.length > 154
                                                ? highlight.context.slice(
                                                    0,
                                                    151
                                                  ) + "..."
                                                : highlight.context}
                                            </span>
                                          </div>
                                        </ChaptersLi>
                                      ) : null}
                                    </>
                                  ))}
                                </ChaptersUl>
                              ) : null}{" "}
                              {getContentRecursive(item, levelCount + 1)}
                            </ChaptersLi>
                          </ChaptersUl>
                        </CardStrucutureBook>
                      </Col>
                    ) : null;
                  })}
                </Row>
              ) : (
                <CardStrucutureBook className="listViewParent">
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
                      Highlight your favorite passages and share your insights
                      with us <br />
                      😊
                    </h4>
                  </Stack>
                </CardStrucutureBook>
              )}
            </div>
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
