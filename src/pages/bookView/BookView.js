import { useSelector } from "react-redux";

import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import Stack from "@mui/material/Stack";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";

import BookInsights from "../../components/Insights/Insights";
import SuggestedView from "../../components/SuggestedView/SuggestedView";
import Breadcum from "../../components/Breadcum/Breadcum";
import "../MyLibrary/MyLibrary.css";

import { getCurrentBook } from "../../Utils/Features/librarySlice";

import { BookIntro } from "../../components/Book/Intro";

const socialButtonsStyle = { color: "darkgrey" };

export default function BookView() {
  const bookState = JSON.parse(localStorage.getItem("bookState"));
  const { bookName } = bookState;

  const bookData = useSelector((state) => getCurrentBook(state));

  const suggestedViewContainer = {
    position: "absolute",
    top: "0px",
    right: "-229px",
  };

  return (
    <div className="feedParentContainer">
      <div className="feedBoxLayout">
        <Breadcum />
        <div
          key={bookData?.id}
          id={bookData?.title}
          className="libraryListsContainer"
        >
          <div
            style={{
              border: "1px solid var(--borderColors)",
              borderRadius: "12px ",
              background: "white",
              padding: "0.7rem 0",
            }}
          >
            <Stack direction={"column"} sx={{ width: "100%" }}>
              <BookIntro bookData={bookData} />
              {/* //SocialButtons */}
              <div
                className="reactionButtonsContainer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="socialButtons">
                  <Stack direction="row" spacing={3}>
                    <FavoriteBorder sx={{ color: "#FF6600" }} />
                    <ChatBubbleOutline sx={socialButtonsStyle} />
                    <ShareIcon sx={socialButtonsStyle} />
                  </Stack>
                </div>
                <div className="bookmarkButtons">
                  <Stack direction="row" spacing={3}>
                    <BookmarkBorderIcon sx={socialButtonsStyle} />
                    <MoreVertIcon sx={socialButtonsStyle} />
                  </Stack>
                </div>
              </div>
              <hr style={{ border: "1px solid var(--borderColors)" }} />
              <div className="otherAccordians">
                <BookInsights id={bookData?._id} />
              </div>
            </Stack>
          </div>
          <div style={suggestedViewContainer}>
            {bookData?.source_type !== "EBOOK_SAMPLE" && (
              <SuggestedView
                bookId={bookData?._id}
                userId={bookData?.user_id}
                bookName={bookName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
