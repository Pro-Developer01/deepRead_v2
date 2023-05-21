import react, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux';

/* STYLES */
import { CardStrucutureBook, ChaptersUl, ChaptersLi } from "./styled";

/* COMPONENTS */
import Stack from "@mui/material/Stack";
import BookDetails from "../../components/BookDetails/index";
import CONTENT_TEMP from "../../mongodb_collections/contentHighlights.json";
import "./ListView.css";
import PersistentDrawerRight from "../../components/Drawer/Drawer";
import { useLocation } from "react-router-dom";
import { apiRoot } from "../../helperFunctions/apiRoot";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SquareIcon from "@mui/icons-material/Square";
import { getIdeacardIcons } from "../../helperFunctions/getIdeacardIcons";
import { useSelector, useDispatch } from "react-redux";
import { updateIdeacardData } from "../../Utils/Features/IdeacardSlice";
import Breadcum from "../../components/Breadcum/Breadcum";
import TriangleRight, {
  TriangleRightOutlined,
} from "../../Assets/triangleRight";

import GoogleSearch from "../../components/GoogleCSE/googlesearch"; // assuming this is the path to GoogleSearch component
import { updateLevelCounter } from "../../Utils/Features/levelCounterSlice";
import listViewDatax from "./listData.json";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateFetchListviewState } from "../../Utils/Features/fetchListviewSlice";

// let book = {
//     asin: "B01N5AX61W",
//     author: "Clear, James",
//     created_at: 1678962214701,
//     deleted_at: null,
//     demo: true,
//     img_path: "https://m.media-amazon.com/images/I/51-nXsSRfZL._SY400_.jpg",
//     my_notes: [],
//     rating: 0,
//     recomendation: "",
//     seen_at: null,
//     tags: [],
//     title: "Atomic Habits: the life-changing million-copy #1 bestseller",
//     updated_at: null,
//     user_id: "6412ede6ce27a2003406a81c",
//     _id: "6412ee26ce27a2003406a84e",
// };

// styling
const sub_chapter_divs = {
  display: "flex",
  gap: "7px",
};
const ideacardIconStyling = {
  backgroundColor: "var(--primaryColor)",
  borderRadius: "33px",
  color: "white",
  padding: "3px",
  marginTop: "1px",
  marginRight: "3px",
  marginLeft: "4px",
};

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

function ListView(props) {
  /* STATES */
  let fetchListview = useSelector((state) => state.fetchListviewReducer.value);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [resizableWidth, setResizableWidth] = useState(null);
  const [listViewData, setListViewData] = useState({});
  const [bookMetaData, setBookMetaData] = useState({});

  // used for ideacarddivcomponent as props
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };
  const [maxCount, setMaxCount] = useState(1);
  let levelCount = 1;
  // let levelCount = useSelector((state) => state.levelCounterReducer.value);
  const dispatch = useDispatch();

  let { state } = useLocation();

  const callForLevelCounter = (levelCounter) => {
    if (levelCounter > maxCount) {
      setMaxCount(levelCounter);
    }
  };

  // console.log("listViewData", listViewData.data);
  const fetchListViewData = () => {
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
        setListViewData(res.data.data[0]);
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

  // const handleDrawerClose = () => {
  //     setOpen(false);
  // };
  /* HOOKS  */
  //   const { book } = useSelector((state) => state.library);

  /* ARROW FUNCTIONS */

  /* FUNCTION RECURSIVE TO SHOW ALL SUBCHAPTERS */
  const getContentRecursive = (item, levelCount) => {
    callForLevelCounter(levelCount);
    return (
      <>
        {item.entries?.length ? (
          <ChaptersUl className="d-none">
            {item.entries.map((k, i) => (
              <ChaptersLi key={i} id={`chapters-${k.tocPositionId}`}>
                <div
                  className={`${
                    k.entries || k.highlights?.length
                      ? `caret level-${levelCount}`
                      : `caret-without-content level-${levelCount}`
                  }`}
                  style={sub_chapter_divs}
                  id={`caret-${k.tocPositionId}`}
                  // onClick={() => openOrCloseChapters(k.tocPositionId)}
                  onClick={(e) => clickHandler(e, k.tocPositionId)}
                  // onDoubleClick={() => doubleClickOpenOrCloseChapters(k.tocPositionId)}
                >
                  <TriangleRight id="caret-arrow" />
                  {k.ideacard ? (
                    <IdeacardDivComponent
                      setOpen={setOpen}
                      label={k.ideacard}
                      type={k.type}
                      searchQuery={searchQuery}
                      handleImageSelect={handleImageSelect}
                      selectedImage={selectedImage}
                    />
                  ) : (
                    <>
                      <TriangleRightOutlined
                        // fontSize="small"
                        id="lastItemDot"
                      />{" "}
                      <span>{k.label || ""}</span>
                    </>
                  )}
                </div>
                {getContentRecursive(k, levelCount + 1)}
              </ChaptersLi>
            ))}
          </ChaptersUl>
        ) : null}
        {item.highlights?.length ? (
          <ChaptersUl className="d-none highlightUl">
            {item.highlights.map((highlight, i) => (
              <>
                {highlight.idea_cards?.length
                  ? highlight.idea_cards.map((ideacards, index) => {
                      return (
                        <IdeacardDivComponent
                          data={ideacards}
                          setOpen={setOpen}
                          searchQuery={searchQuery}
                          handleImageSelect={handleImageSelect}
                          selectedImage={selectedImage}
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
              </>
            ))}
          </ChaptersUl>
        ) : null}
      </>
    );
  };
  const arrowOpenCloseHandler = (elementItself) => {
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
          for (var i = 0; i < liChilds.length; i++) {
            let item = liChilds[i].id;
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
        openOrCloseChapters(item.split("chapters-")[1], true);
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
    // console.log('listViewData', listViewDatax)
    // setListViewData(listViewDatax.data[0])
    fetchListViewData();
  }, []);
  useEffect(() => {
    if (fetchListview) {
      fetchListViewData();
      dispatch(updateFetchListviewState(false));
    }
  }, [fetchListview]);
  useEffect(() => {
    dispatch(updateLevelCounter(maxCount));
  }, [maxCount]);
  useEffect(() => {
    if (listViewData?.book) {
      setBookMetaData(listViewData?.book[0]);
    }
  }, [listViewData]);

  return (
    <>
      <div
        className="feedParentContainer"
        style={{ alignItems: !open ? "center" : "start" }}
      >
        {!loading ? (
          <>
            <PersistentDrawerRight
              open={open}
              resizableWidth={resizableWidth}
              childrenx={
                <div
                  style={{
                    width: open
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
                  {bookMetaData && (
                    <BookDetails
                      book={bookMetaData}
                      open={open}
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
      </div>
    </>
  );
  return (
    <>
      <div
        className="feedParentContainer"
        style={{ alignItems: !open ? "center" : "start" }}
      >
        {!loading ? (
          <>
            <PersistentDrawerRight
              childrenx={
                <div
                  style={{
                    width: open ? "100%" : `${resizableWidth}px`,
                    position: "relative",
                    height: "84%",
                  }}
                >
                  <Breadcum state={state} />

                  {bookMetaData && (
                    <BookDetails
                      book={bookMetaData}
                      open={open}
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
      </div>
    </>
  );
}

export default ListView;
