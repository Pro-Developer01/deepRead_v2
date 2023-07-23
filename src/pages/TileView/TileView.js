import React, { useState, useEffect } from "react";
import Breadcum from "../../components/Breadcum/Breadcum";
import { useLocation } from "react-router-dom";
//style component
import { CardStrucutureBook, ChaptersUl, ChaptersLi } from "../ListView/styled";
import { Col, Row } from "antd";


import Stack from "@mui/material/Stack";
import BookDetails from "../../components/BookDetails/index";
import CONTENT_TEMP from "../../mongodb_collections/contentHighlights.json";
import "../ListView/ListView.css";
import PersistentDrawerRight from "../../components/Drawer/Drawer";
import { apiRoot } from "../../helperFunctions/apiRoot";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SquareIcon from "@mui/icons-material/Square";
import { getIdeacardIcons } from "../../helperFunctions/getIdeacardIcons";
import { useSelector, useDispatch } from "react-redux";
import { updateIdeacardData } from "../../Utils/Features/IdeacardSlice";
import TriangleRight, {
  TriangleRightOutlined,
} from "../../Assets/triangleRight";

import GoogleSearch from "../../components/GoogleCSE/googlesearch"; // assuming this is the path to GoogleSearch component
import { updateLevelCounter } from "../../Utils/Features/levelCounterSlice";
// import listViewDatax from "./listData.json";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateFetchListviewState } from "../../Utils/Features/fetchListviewSlice";

const IdeacardDivComponent = ({
  data,
  setOpen,
  selectedImage,
  handleImageSelect,
}) => {
  const [callingIdeaCard, setCallingIdeaCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ideacardData = useSelector((state) => state.ideacardReducer.value);
  const dataType = useSelector((state) => state.persistentDrawerReducer.value);
  const dispatch = useDispatch();

  const clickHandler = () => {
    setCallingIdeaCard(!callingIdeaCard);
    if (!callingIdeaCard) {
      dispatch(updateIdeacardData(data));
      dispatch(updatePersistentDrawer("ideaCard"));
    } else {
      dispatch(updatePersistentDrawer(null));
      dispatch(updateIdeacardData(null));
    }
  };

  // console.log('ideacard data', data)
  useEffect(() => {
    if (!ideacardData) {
      setCallingIdeaCard(false);
    }
    setOpen(ideacardData);
  }, [ideacardData]);

  const handleSave = async () => {
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    const updatedData = {
      ...ideacardData,
      picture_link: selectedImage,
    };

    dispatch(updateIdeacardData(updatedData));
    setOpen(false);

    /*
        try {
          await axios.
          //put(`/api/ideacards/${ideacardData.id}`, updatedData);
          put(
            `${apiRoot.endpoint}/api/ideas/update?_id=${updatedData._id}`,
            {
                headers: {
                    authorization: token,
                },
            }
        )
          dispatch(updateIdeacardData(updatedData));
          setOpen(false);
        } catch (error) {
          console.error(error);
        }*/
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div
      className={`ideacardDiv ideacard-${data.label_id}`}
      style={{
        border: callingIdeaCard ? "2px solid var(--primaryColor)" : null,
        marginLeft: '-15px'
      }}
      onClick={clickHandler}
      aria-label="open drawer"
    >
      {callingIdeaCard && (
        <div>
          <div>
            <input
              type="text"
              onClick={(e) => e.stopPropagation()}
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Enter search query"
            />
            <button onClick={() => setSearchQuery("")}>Clear</button>
          </div>
          {searchQuery && (
            <GoogleSearch
              searchQuery={searchQuery}
              onSelect={handleImageSelect}
            />
          )}
          <img
            className="ideaCardImg"
            src={selectedImage || data.picture_link}
            alt="idea"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
      <span>{getIdeacardIcons(data.label_id)}</span>
      <span>
        <b> {data.title || ""}</b>
      </span>
    </div>
  );
};
export default function TileView() {
  let { state } = useLocation();
  let levelCountGlobal = useSelector((state) => state.levelCounterReducer.currentLevel.value);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [resizableWidth, setResizableWidth] = useState(null);
  const [tileViewData, setTileViewData] = useState({});
  const [bookMetaData, setBookMetaData] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const [maxCount, setMaxCount] = useState(1);
  let levelCount = 1;
  const dispatch = useDispatch();
  console.log({ levelCountGlobal });
  const callForLevelCounter = (levelCounter) => {
    if (levelCounter > maxCount) {
      setMaxCount(levelCounter);
    }
  };
  const fetchTileViewData = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    axios
      .get(
        `${apiRoot.endpoint}/api/content/highlights?user_id=${userId}&book_id=${state?.bookId}`,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        console.log("res, ", res.data.data[0]);
        const datax = res.data.data[0];
        setTileViewData(res.data.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        // loginAuths()
        // setTimeout(() => {
        //     alert('Token or UserId is Invalid Please Reload!')
        // }, 4000)
      });
  };


  const getContentRecursive = (item, levelCount) => {
    callForLevelCounter(levelCount);
    return (
      <>
        {item.entries?.length ? (
          <ChaptersUl className="!mx-0 !border-x-0">
            {item.entries.map((k, i) => (<>{getContentRecursive(k, levelCount + 1)}</>)
            )}
          </ChaptersUl>
        ) : null}
        {item.highlights?.length ? (
          <ChaptersUl className=" highlightUl !mx-0 !border-x-0">
            {item.highlights.map((highlight, i) => (
              <>
                {highlight.idea_cards?.length
                  ? highlight.idea_cards.map(
                    (ideacards, index) => {
                      return (
                        <IdeacardDivComponent
                          data={ideacards}
                          setOpen={setOpen}
                          searchQuery={searchQuery}
                          handleImageSelect={
                            handleImageSelect
                          }
                          selectedImage={selectedImage}
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
                    <div className="highlightDiv !ml-0" >
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
              </>
            ))}
          </ChaptersUl>
        ) : null}{" "}
      </>
    );
  };

  const clickHandler = (event, index) => {
    console.log("event.ctrlKey", event.ctrlKey);
    // if (event.ctrlKey) {
    //   // Perform your desired function here

    //   doubleClickOpenOrCloseChapters(index);
    // } else {
    //   openOrCloseChapters(index, false);
    // }
  };
  useEffect(() => {
    // console.log('tileViewData', listViewDatax)
    // setTileViewData(listViewDatax.data[0])
    fetchTileViewData();
  }, []);

  useEffect(() => {
    dispatch(updateLevelCounter(maxCount));
  }, [maxCount]);

  useEffect(() => {
    if (tileViewData?.book) {
      setBookMetaData(tileViewData?.book[0]);
    }
  }, [tileViewData]);
  console.log("from tileview", state);
  console.log({ tileViewData });
  return (
    <>
      <div
        className="feedParentContainer"
        style={{ alignItems: !open ? "center" : "start", overflow: 'auto' }}
      >
        {!loading ? (
          <>
            {/* <PersistentDrawerRight
                open={open}
                resizableWidth={resizableWidth}
               
              ></PersistentDrawerRight> */}
            <div
              style={{
                width: true
                  ? "100%"
                  : `${resizableWidth ? resizableWidth + "px" : "100%"}`,
                //   width: open
                //     ? "100%"
                //     : `${resizableWidth ? resizableWidth + "px" : "100%"}`,
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
                {bookMetaData && (
                  <BookDetails
                    book={bookMetaData}
                    open={open}
                    resizableWidth={resizableWidth}
                    setResizableWidth={setResizableWidth}
                  />
                )}
              </div>

              {tileViewData?.data?.length ? (
                <Row className="justify-center gap-2.5">
                  {tileViewData?.data?.map((item, index) => {
                    return item.highlights?.length || item.entries?.length ? (
                      <Col span={11}>
                        <CardStrucutureBook className="listViewParent ">
                          <ChaptersUl style={{ margin: "0", border: "none" }} className="h-44">
                            <ChaptersLi key={index} id={`chapters-${index}`}>
                              <div
                                className={`${item.entries || item.highlights.length
                                  ? `caret level-${levelCount}`
                                  : `caret-without-content-outer level-${levelCount}`
                                  }`}
                                id={`caret-${index}`}
                                style={{
                                  display: "flex", gap: "7px", position: 'sticky', top: '-7px', background: 'white',
                                  marginLeft: '-15px',
                                  paddingLeft: '15px'
                                }}
                                onClick={(e) => clickHandler(e, index)}
                              // onDoubleClick={() => doubleClickOpenOrCloseChapters(index)}
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
                                          (ideacards, index) => {
                                            return (
                                              <IdeacardDivComponent
                                                data={ideacards}
                                                setOpen={setOpen}
                                                searchQuery={searchQuery}
                                                handleImageSelect={
                                                  handleImageSelect
                                                }
                                                selectedImage={selectedImage}
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
                                          <div className="highlightDiv !ml-0" >
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
        ) : (
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ height: "100vh" }}
          >
            <CircularProgress sx={{ color: "var(--primaryColor)" }} />
          </Stack>
        )}
      </div >
    </>
  );
}
