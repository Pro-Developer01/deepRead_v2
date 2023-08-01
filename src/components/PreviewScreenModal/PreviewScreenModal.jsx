import { Modal } from 'antd';
import React from 'react'
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import Stack from "@mui/material/Stack";
import { getIdeacardIcons } from '../../helperFunctions/getIdeacardIcons';
import { PreviewScreenTabs } from '../AccordianCollections/AccordianCollections';

export default function PreviewScreenModal(props) {
    const { isModalOpen = false, setIsModalOpen = () => { }, selectedImage = '', data = {} } = props

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div>
                    <div className="ideacard-Title">
                        {/* //Shared by */}
                        <Stack
                            direction="row"
                            justifyContent="left"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                            sx={{ paddingLeft: "3.4rem", paddingRight: "0.5rem" }}
                        >
                            <DiamondOutlinedIcon
                                sx={{ fontSize: "14px", color: "lightslategrey" }}
                            />
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "lightslategrey",
                                }}
                            >

                                <b>My own content</b>{" "}
                            </span>
                        </Stack>
                        {/* //CardHeaderTitle */}
                        <Stack
                            direction="row"
                            justifyContent="left"
                            alignItems="flex-start"
                            spacing={1.5}
                            mb={1}
                            sx={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
                        >
                            <span
                                id="ideaCardLabels"
                                // aria-controls={open ? "ideaCardLabelsMenu" : undefined}
                                // aria-haspopup="true"
                                // aria-expanded={open ? "true" : undefined}
                                // onClick={(e) => {
                                //     handleClick(e, data.label_id);
                                //     e.stopPropagation();
                                // }}
                                style={{
                                    marginTop: "-7px",
                                }}
                                className="cursor-pointer"
                            >
                                {getIdeacardIcons(data.label_id, "large")}
                            </span>
                            <h3 className="text-lg font-bold"> {data.title?.length > 253 ? data.title?.slice(0, 253) + '...' : data.title}</h3>
                        </Stack>
                    </div>

                    <PreviewScreenTabs data={data} />
                </div>


            </Modal>
        </div>
    )
}
