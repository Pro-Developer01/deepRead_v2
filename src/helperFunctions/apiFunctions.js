import axios from "axios";
import { store } from "../Utils/Store/Store";
const apiEndpoint = process.env.REACT_APP_API_URL;

export const fetchAdjoiningHighlights = async (bookId, position, range = 3) => {
  const { token } = store.getState().auth;
  const fullData = axios
    .get(
      `${apiEndpoint}/api/highlight/range?book_id=${bookId}&position=${position}&range=${range}`,
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log("error fetching adjoining higlights data, ", err);
      return null;
    });
  return fullData;
};

export const fetchIdeaCardData = async ({ cardId, title } = {}) => {
  const { token, userId } = store.getState().auth;
  let params = "";
  if (cardId) {
    params += "&_id=" + cardId;
  }
  if (title) {
    params += "&title=" + title;
  }
  const ideaCardData = axios
    .get(`${apiEndpoint}/api/ideas/index?user_id=${userId}${params}`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log("error fetching idea card data, ", err);
      return null;
    });
  return ideaCardData;
};
