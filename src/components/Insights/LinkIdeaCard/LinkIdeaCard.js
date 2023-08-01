import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import AddIcon from "@mui/icons-material/AddCircle";

import { updateIdeaCardRelation } from "../../../Utils/Features/librarySlice";
import { getIdeacardIcons } from "../../../helperFunctions/getIdeacardIcons";

export const LinkIdeaCard = ({
  ideaCardToLinkId,
  resultCards,
  linkedCardsData,
  setLinkedCardsCallback,
}) => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState(resultCards);
  useEffect(() => {
    setCards(resultCards);
  }, [resultCards]);

  const handleAdd = (cardId, cardTitle) => {
    let linkedCardsDataTemp = Object.assign([], linkedCardsData);
    linkedCardsDataTemp.push({
      relation: "parent",
      idea_id: cardId,
      title: cardTitle,
    });
    setLinkedCardsCallback(linkedCardsDataTemp);

    dispatch(
      updateIdeaCardRelation({
        ideaCardId: ideaCardToLinkId,
        newData: {
          linked_structure: linkedCardsDataTemp,
        },
      })
    );
    setCards([]);
  };
  return (
    <>
      {cards?.map((card, index) => {
        return (
          <div
            key={card._id}
            style={{
              display: "flex",
              gap: "8px",
              margin: "3px 0px",
              paddingLeft: "10px",
            }}
          >
            <AddIcon onClick={() => handleAdd(card._id, card.title)} />
            {getIdeacardIcons(card.label_id)}
            <span>{card.title}</span>
          </div>
        );
      })}
    </>
  );
};
