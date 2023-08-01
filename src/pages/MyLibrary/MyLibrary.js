import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Breadcum from "../../components/Breadcum/Breadcum";

import "./MyLibrary.css";

import {
  selectBook,
  fetchLibrary,
  LoadingStatus,
} from "../../Utils/Features/librarySlice";
import { BookIntro } from "../../components/Book/Intro";
import { Loading } from "../../components/Loading";

const BookViewCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLocation = window.location.pathname;

  const itemIdCreator = (title) => {
    const splitedTitle = title.split(" ");
    const requiredTitle = splitedTitle.join("-");
    const requiredTitleSplit = requiredTitle.split("#");
    const titleWithoutHash = requiredTitleSplit.join("");
    return titleWithoutHash;
  };

  const bookCardClickHandler = (index, item) => {
    const bookState = {
      index,
      item,
      bookName: itemIdCreator(item.title),
    };
    localStorage.setItem("bookState", JSON.stringify(bookState));

    dispatch(selectBook(index));
    navigate(currentLocation + "/" + itemIdCreator(item.title));
    // TODO call the sync for highlights event towards our extension
  };

  return (
    <div
      key={item?.id}
      id={item?.title}
      className="libraryListsContainer"
      onClick={() => bookCardClickHandler(index, item)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          border: "1px solid var(--borderColors)",
          borderRadius: "12px ",
          background: "white",
          padding: "0.7rem",
        }}
      >
        <Stack direction={"column"} sx={{ width: "100%" }}>
          <BookIntro bookData={item} list="true" />
        </Stack>
      </div>
    </div>
  );
};

export default function MyLibrary() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.library.libraryData);
  const libraryStatus = useSelector((state) => state.library.libraryStatus);
  const libraryError = useSelector((state) => state.library.libraryError);

  useEffect(() => {
    if (!data) {
      dispatch(fetchLibrary());
    }
  }, []);

  return (
    <div className="feedParentContainer" style={{ overflow: "auto" }}>
      <div className="feedBoxLayout">
        <Breadcum />
        {libraryStatus === LoadingStatus.Failed ? (
          <div title={libraryError}>Loading Library failed.</div>
        ) : libraryStatus === LoadingStatus.Loading ? (
          <Loading />
        ) : (
          <div>
            {data?.map((item, i) => {
              return <BookViewCard key={item._id} item={item} index={i} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
