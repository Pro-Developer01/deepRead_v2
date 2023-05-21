import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Pages.css";


export default function SearchMenu() {
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "auto",
      padding: "5px 10px",
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <div className="SearchMenu">
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={inputAnimation}
          className="search"
        >
          <motion.input
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={inputAnimation}
            type="text"
            placeholder="Search"
            className="inputElement"
          />
          <div>
            <span className="material-symbols-outlined search_icon">
              search{" "}
            </span>
          </div>
        </motion.div>

        <div className="radioInputs">
          <span className="link">
            <input
              type="radio"
              id="suggestion1"
              name="suggestions"
              value="suggestion1"
            />
            <label for="suggestion1">Suggestion 1 </label>
          </span>
          <span className="link">
            <input
              type="radio"
              id="suggestion2"
              name="suggestions"
              value="suggestion2"
            />
            <label for="suggestion2">Suggestion 2 </label>
          </span>
          <span className="link">
            <input
              type="radio"
              id="suggestion3"
              name="suggestions"
              value="suggestion3"
            />
            <label for="suggestion3">Suggestion 3 </label>
          </span>
          <span className="link">
            <input
              type="radio"
              id="suggestion4"
              name="suggestions"
              value="suggestion4"
            />
            <label for="suggestion4">Suggestion 4 </label>
          </span>
        </div>
      </AnimatePresence>
      
    </div>
  );
}
