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
            <Modal open={isModalOpen} onCancel={handleCancel} style={{
                maxwidth: '520px'
            }}>
                <div>
                    <div className="ideacard-Title">
                        {/* //Shared by */}
                        <Stack
                            direction="row"
                            justifyContent="left"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                            sx={{ paddingLeft: "29px", paddingRight: "0.5rem" }}
                        >
                            <DiamondOutlinedIcon
                                sx={{ fontSize: "14px", color: "lightslategrey" }}
                            />
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "lightslategrey",
                                    marginLeft: '13px'
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
                                style={{
                                    marginTop: "-7px",
                                }}
                                className="cursor-pointer"
                            >
                                {getIdeacardIcons(data.label_id, "large")}
                            </span>
                            <h3 className="text-lg font-bold"> {data.title?.length > 108 ? data.title?.slice(0, 108) + '...' : data.title}</h3>
                        </Stack>
                    </div>

                    <PreviewScreenTabs data={data} />
                </div>


            </Modal>

            <style>{`
      .ant-modal .ant-modal-footer {
        display:none;
      }
      `}</style>
        </div>
    )
}
