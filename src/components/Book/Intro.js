import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import PortraitIcon from "@mui/icons-material/Portrait";

import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import InfoIcon from "@mui/icons-material/Info";

import "../../pages/MyLibrary/MyLibrary.css";
import ChromeExtensionConnector from "../Connectors/ChromeExtensionCommunication";

import { updateBook } from "../../Utils/Features/librarySlice";
import { formatDateString } from "../../helperFunctions/timing";

import {
  QontoConnector,
  QontoStepIcon,
  stepLabelStyling,
  timelineSpanStyle,
} from "./styled";
const steps = ["Read", "Highlights", "Idea Cards"];

export const BookIntro = ({ bookData, list }) => {
  const dispatch = useDispatch();

  const { userId, token } = useSelector((state) => state.auth);
  const { amazonSyncDisabled, singleBookSyncMessage } = useSelector(
    (state) => state.amazonSync
  );

  const syncInfoMessage =
    `Initiates the book sync for ${bookData?.title}.\n` +
    `And immediately after the full highlights sync to sync any highlights that are clipped in book sync because they are very long.`;

  const fillUpdatedTimeForSyncMessage = (message) => {
    return message.replace(
      "#TIME#",
      formatDateString(new Date(bookData?.updated_at))
    );
  };

  const handleAmazonSingleBookSync = async (bookId) => {
    try {
      ChromeExtensionConnector.SyncAmazonSingleBook(token, userId, bookId);
    } catch (error) {
      console.log("Error handleAmazonSingleBookSync: ", error);
    }
  };

  return (
    <div className="libraryLists">
      <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
        <div>
          <div style={{ position: "relative" }}>
            <img
              src={bookData?.img_path}
              alt={bookData?.title}
              className="libraryListsImg"
            />
            {(bookData?.source_type === "EBOOK_SAMPLE" || bookData?.demo) && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  color: "#000000",
                  background: "#F1F1F1",
                  width: "100%",
                  transition: ".5s ease",
                  opacity: 0.7,
                  fontSize: "20px",
                  padding: "px",
                  textAlign: "center",
                }}
              >
                {bookData?.source_type === "EBOOK_SAMPLE" && (
                  <span>SAMPLE</span>
                )}
                {bookData?.demo && <span>DEMO</span>}
              </div>
            )}
          </div>
          <div className="rating">
            {list ? (
              <Rating
                name="read-only"
                sx={{ color: "#FF6600" }}
                value={bookData?.rating}
                readOnly
              />
            ) : (
              <div>
                <Rating
                  name="bookRating"
                  sx={{ color: "#FF6600" }}
                  value={bookData?.rating}
                  onChange={(event, newRating) => {
                    dispatch(
                      updateBook({
                        bookId: bookData?._id,
                        newData: {
                          rating: newRating,
                        },
                      })
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          {/* //CardHeaderTitle */}
          <div className="">
            {/* <Tooltip title={item.title} arrow> */}
            <Stack
              direction="row"
              justifyContent="left"
              alignItems="center"
              spacing={1}
              mb={1}
            >
              {" "}
              <PortraitIcon
                sx={{ fontSize: "14px", color: "lightslategrey" }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "lightslategrey",
                }}
              >
                Shared By: <b>{bookData?.demo ? "DeepRead" : "Me"}</b>
              </span>
            </Stack>
            <h3>
              {bookData?.title.length > 98
                ? bookData?.title.slice(0, 99) + "..."
                : bookData?.title}
            </h3>
            {/* </Tooltip> */}
            <span className="">
              By{" "}
              {bookData?.author
                .replace(/;/g, " & ")
                .split(" & ")
                .map((name) => name.split(", ").reverse().join(" "))
                .join(" & ")}
            </span>
          </div>

          {/* //Timline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            {bookData?.source_type !== "EBOOK_SAMPLE" && (
              <div style={{ flex: 1 }}>
                <Box sx={{ width: "100%", marginTop: "32px" }}>
                  <Stepper
                    alternativeLabel
                    activeStep={3}
                    connector={<QontoConnector />}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel
                          StepIconComponent={QontoStepIcon}
                          sx={stepLabelStyling}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    textAlign: "center",
                    // marginTop: "16px",
                  }}
                >
                  <>
                    {bookData?.progress !== null ? (
                      <span style={timelineSpanStyle}>
                        {bookData?.progress
                          ? `${Math.round(bookData?.progress)}%`
                          : "0%"}
                      </span>
                    ) : (
                      <span>...</span>
                    )}
                    {bookData?.h_progress !== null ? (
                      <span style={timelineSpanStyle}>
                        {bookData?.h_progress
                          ? `${Math.round(bookData?.h_progress)}%`
                          : "0%"}
                      </span>
                    ) : (
                      <span>...</span>
                    )}
                    {bookData?.i_progress !== null ? (
                      <span style={timelineSpanStyle}>
                        {bookData?.i_progress ? bookData?.i_progress : "0"}
                      </span>
                    ) : (
                      <span>...</span>
                    )}
                  </>
                </div>
              </div>
            )}
          </div>
        </Stack>
      </Stack>
      <div
        className={
          list
            ? "fetchStatusIconContainer"
            : "fetchStatusIconContainer cursor-pointer"
        }
      >
        <Stack direction="row" justifyContent="left" alignItems="center">
          {amazonSyncDisabled ? (
            <div title={fillUpdatedTimeForSyncMessage(singleBookSyncMessage)}>
              <PublishedWithChangesIcon sx={{ color: "red" }} />
            </div>
          ) : (
            <div title={fillUpdatedTimeForSyncMessage(singleBookSyncMessage)}>
              <PublishedWithChangesIcon
                sx={{ color: "lightgreen" }}
                onClick={() => handleAmazonSingleBookSync(bookData?._id)}
              />
            </div>
          )}
          <div title={syncInfoMessage}>
            <InfoIcon sx={{ color: "lightgreen", width: 20 }} />
          </div>
        </Stack>
      </div>
    </div>
  );
};
