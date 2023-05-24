import React, { useEffect } from "react";
import "./NewIdea.css";
import { AnimatePresence, motion } from "framer-motion";
import Drawer from "@mui/material/Drawer";
import CreateIdeaCardPage from "../../pages/CreateIdeaCardPage/CreateIdeaCardPage";
import IdeaCardPage from "../../pages/IdeacardPage/IdeaCardPage";
import Filter from "../../pages/Filter";
import highlightTester from "../../helperFunctions/highlightTester";
import { useSelector, useDispatch } from 'react-redux'
import { updateIdeacardData } from "../../Utils/Features/IdeacardSlice";
import {
    getLabelId
} from "../../helperFunctions/getIdeacardIcons";
import { updatePersistentDrawer } from "../../Utils/Features/persistentDrawerSlice";
import { updateIdentifyIdeaCardData } from "../../Utils/Features/IdentifyIdeaCardSlice";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Identify from "../../Assets/Identify";
import Identify_White from "../../Assets/Identify_White";
import Marker from "../../Assets/Marker";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const clossDoubleArrowStyle = {
    background: "var(--white)",
    borderRadius: "33px",
    border: "1px solid var(--borderColors)",
    position: "relative",
    top: "-3px",
    right: "-0.5rem",
    cursor: "pointer",
    color: "var(--fontColor)",
};
const closeCrossButtonStyle = {
    borderRadius: "33px",
    position: "fixed",
    top: "34px",
    right: "11px",
    zIndex: 13,
    cursor: "pointer",
    color: "var(--fontColor)",
};

export default function NewIdeaButton() {
    // const open = useState(false)[0]
    // const setOpen = useState(false)[1]
    const [openOptions, setopenOptions] = React.useState(false);
    let showIdentifyIC = highlightTester();
    const currentLocation = window.location.pathname;
    useEffect(() => {

    }, []);
    useEffect(() => {
        showIdentifyIC = highlightTester();
        console.log('showIdentifyIC', showIdentifyIC)
    }, [currentLocation]);

    // console.log(open);
    return (
        <>
            <div className="NewIdeaParent">
                <div className="NewIdeaPosition">
                    {openOptions && (
                        <>
                            <IdeaOptions text={"Create idea"} icon={"tips_and_updates"} setopenOptions={setopenOptions} />
                            {showIdentifyIC && <IdeaOptions
                                text={"Identify idea"}
                                icon={"drive_file_rename_outline"}
                                setopenOptions={setopenOptions}
                            />}
                        </>
                    )}
                    {!openOptions && (
                        <div className="NewIdeaButton" onClick={() => setopenOptions(true)}>
                            <span className="material-symbols-outlined search_icon">add</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}



const IdeaOptions = ({ text, icon, setopenOptions }) => {

    const [open, setOpen] = React.useState(false);
    const [buttonState, setButtonState] = React.useState(null);
    const [count, setCount] = React.useState(false);

    const IdentifyIdeaCardData = useSelector((state) => state.IdentifyIdeaCardReducer.value)
    const dispatch = useDispatch()

    const showAnimation = {
        hidden: {
            width: 0,
            opacity: 0,
            transition: {
                duration: 0.1,
            },
        },
        show: {
            opacity: 1,
            width: "auto",
            transition: {
                duration: 0,
            },
        },
    };

    const setCursorClass = () => {
        const allItems = document.querySelectorAll('.highlightLi');
        const dashboard = document.querySelector('#dashboard');
        dashboard.classList.add('cursoreChangeAll');
        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.add('customCursor');
            allItems[i].children[0].children[1].classList.add('customCursor')
        }
    }

    const removeCursorClass = () => {
        const allItems = document.querySelectorAll('.highlightLi');
        const dashboard = document.querySelector('#dashboard');
        dashboard.classList.remove('cursoreChangeAll');
        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.remove('customCursor');
            allItems[i].children[0].children[1].classList.remove('customCursor')
        }
    }
    const handleTextPopup = (event) => {
        const selection = window.getSelection().toString().trim();
        if (selection !== '') {
            const popup = document.createElement('div');
            popup.className = 'popup';
            popup.textContent = 'Press ENTER to Create Ideacard';
            document.body.appendChild(popup);

            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            popup.style.top = `${rect.bottom - 53}px`;
            popup.style.left = ((rect.left + rect.right) / 2 - 88) + 'px';
        };
    }
    const removePopup = () => {
        const popupElement = document.querySelector('.popup');
        popupElement?.parentNode.removeChild(popupElement);

    }
    const handleEnter = (event) => {
        if (event.keyCode === 13 && window.getSelection().toString().length > 0) {
            console.log('Enter is pressed');
            identifyICCreater()
            removePopup()
        }
    };
    const handleEscGlobal = (event) => {
        if (event.keyCode === 27) { // esc clicked
            if (!count) {
                console.log('count first', count);
                setButtonState(false)
                setopenOptions(false);
            }
            else {
                console.log('count else', count);
                window.getSelection().removeAllRanges();
            }
        }

    };

    const identifyICCreater = () => {
        const userId = localStorage.getItem("userId");
        const selection = window.getSelection();
        const title = selection.toString()
        const itemSelf = selection.anchorNode.parentElement
        const start = itemSelf.dataset.start;
        const book_id = itemSelf.dataset.book_id;
        const highlight_id = selection.anchorNode.parentElement.id;
        const ideacardObj = {
            book_id,
            "label_id": getLabelId('KEYWORDS'),
            highlight_id,
            title,
            start,
            "user_id": userId,
            "my_notes": [],
            "picture_link": "",
            "rating": 0,
            "tags": [],
            "level": 0,
            "end": null
        }
        if (highlight_id.length && start.length) {
            removeCursorClass();
            dispatch(updateIdentifyIdeaCardData(ideacardObj));
            dispatch(updatePersistentDrawer('identify Ideacard'))
            window.removeEventListener("keydown", handleEnter);
            window.removeEventListener("mouseup", handleTextPopup);
            window.removeEventListener('mousedown', removePopup);
            console.log("selectedText", ideacardObj);
        }
    }



    const clickHandler = (type) => {
        if (type === buttonState) {
            setButtonState(null)
        }
        else {
            setButtonState(type)
        }
    }

    const buttonStateHandler = () => { //this func will run after clickhandler
        if (buttonState) {
            if (buttonState === 'Create idea') {
                setOpen(true)
            }
            else if (buttonState === 'Identify idea') {
                setCount(true)
                window.addEventListener("keydown", handleEnter);
                window.addEventListener('mouseup', handleTextPopup);
                window.addEventListener('mousedown', removePopup);
                setCursorClass();
                setOpen(false)
            }
        }
        else {
            console.log("buttonState null runned", buttonState);
            dispatch(updatePersistentDrawer(null))
            dispatch(updateIdentifyIdeaCardData(null));
            setOpen(false)
            removeCursorClass();
            window.getSelection().removeAllRanges();
            window.removeEventListener("keydown", handleEnter);
            window.removeEventListener('mousedown', removePopup);

        }
    }

    const Close = () => {
        setOpen(false);
        setopenOptions(false);
    };

    useEffect(() => {

        window.addEventListener("keydown", handleEscGlobal);

        return () => {
            console.log('removed')
            window.removeEventListener("keydown", handleEscGlobal);
        };
    }, [])

    useEffect(() => {
        buttonStateHandler()
    }, [buttonState])

    useEffect(() => { //for create ideacard drawer only
        if (!open)
            setButtonState(open)
    }, [open])

    useEffect(() => { //for Identify ideacard drawer only
        if (!IdentifyIdeaCardData) {
            setButtonState(IdentifyIdeaCardData)
        }
    }, [IdentifyIdeaCardData])


    return (
        <>
            <button
                className="link IdeaOptions"
                // id={isOpen ? "active" : "activeCollapsible"}
                // id= "IdeaOptions"
                style={buttonState === text ? { backgroundColor: 'var(--primaryColor)', color: 'white' } : null}
                onClick={() => clickHandler(text)}
            >  {buttonState === 'Identify idea' && (
                <style>
                    {`
                    ::selection {
                      background-color: #FFDAC1;
                    }
                  `}
                </style>
            )}
                <AnimatePresence>
                    <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                    >
                        {text}
                    </motion.div>
                    {text === 'Identify idea' ? buttonState !== text ? <Identify /> : <Identify_White />
                        // {text === 'Identify idea' ? <Marker />
                        : <span className="material-symbols-outlined">{icon}</span>}
                </AnimatePresence>
            </button>

            <Drawer anchor={"right"} open={open} onClose={Close}
                PaperProps={{
                    style: {
                        backgroundColor: "transparent", boxShadow: "none", paddingTop: '4px'
                    }
                }}> {/*Making the drawer background transparent*/}
                <KeyboardDoubleArrowRightIcon
                    fontSize="medium"
                    style={clossDoubleArrowStyle}
                    onClick={Close}
                />
                <CloseIcon
                    fontSize="medium"
                    style={closeCrossButtonStyle}
                    onClick={Close}
                />
                <CreateIdeaCardPage />
            </Drawer>
        </>
    );
};
