import { useSelector, useDispatch } from "react-redux";

import { getIdeacardIcons } from "../../helperFunctions/getIdeacardIcons";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateIdentifyIdeaCardData } from "../../Utils/Features/IdentifyIdeaCardSlice";

import {
  selectIdeaCard,
  getIdeaCardById,
  getCurrentIdeaCardId,
} from "../../Utils/Features/librarySlice";

export const IdeaCard = ({ ideaCardId }) => {
  const ideaCard = useSelector((state) => getIdeaCardById(state, ideaCardId));
  const currentIdeaCardId = useSelector((state) => getCurrentIdeaCardId(state));

  const dispatch = useDispatch();

  const clickHandler = () => {
    if (currentIdeaCardId !== ideaCard?._id) {
      dispatch(selectIdeaCard(ideaCard._id));
      dispatch(updatePersistentDrawer("ideaCard"));

      // clearing identify data in case previous was identify idea card type
      dispatch(updateIdentifyIdeaCardData(null));
    } else {
      dispatch(selectIdeaCard(null));
      dispatch(updatePersistentDrawer(null));
      dispatch(updateIdentifyIdeaCardData(null));
    }
  };

  return (
    <div
      className={`ideacardDiv ideacard-${ideaCard?.label_id}`}
      style={{
        border:
          currentIdeaCardId === ideaCard?._id
            ? "2px solid var(--primaryColor)"
            : null,
      }}
      onClick={clickHandler}
      aria-label="open drawer"
    >
      <span>{getIdeacardIcons(ideaCard?.label_id)}</span>
      <span>
        <b> {ideaCard?.title || ""}</b>
      </span>
    </div>
  );
};
