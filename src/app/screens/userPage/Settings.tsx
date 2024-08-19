import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { useState } from "react";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember?.memberImage}`
      : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberDesc: authMember?.memberDesc,
      memberAdress: authMember?.memberAdress,
      memberImage: authMember?.memberImage,
      memberPassword: authMember?.memberPassword,
    }
  );

  // HANDLERS

  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };
  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };
  const memberDescHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };
  const memberAdressHandler = (e: T) => {
    memberUpdateInput.memberAdress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };
  const memberImageHandler = (e: T) => {
    memberUpdateInput.memberImage = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPasswordHandler = (e: T) => {
    memberUpdateInput.memberPassword = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const submitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAdress === "" ||
        memberUpdateInput.memberDesc === ""
      )
        throw new Error(Messages.error3);

      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Modified Successfully");
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0],
      fileType = file.type,
      validateImageTypes = ["image.jpg", "image.jpeg", "image.png"];

    if (validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else if (file) {
      memberUpdateInput.memberImage = file;
      setMemberUpdateInput({ ...memberUpdateInput });
      setMemberImage(URL.createObjectURL(file));
    }
  };
  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img src={memberImage} className={"mb-image"} />
        <div className={"media-change-box"}>
          <span>Upload image</span>
          <p>JPG, JPEG, PNG formats only!</p>
          <div className={"up-del-box"}>
            <Button component="label" onChange={handleImageViewer}>
              <CloudDownloadIcon />
              <input type="file" hidden />
            </Button>
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={authMember?.memberNick}
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={memberNickHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={authMember?.memberPhone ?? "no phone"}
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandler}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={authMember?.memberAdress ?? "no address"}
            value={memberUpdateInput.memberAdress}
            name="memberAdress"
            onChange={memberAdressHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Password</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={"Password"}
            value={memberUpdateInput.memberPassword}
            name="memberPassword"
            onChange={memberPasswordHandler}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Repeat Password</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={"Confirm Password"}
            value={memberUpdateInput.memberPassword}
            name="memberPassword"
            onChange={memberPasswordHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={
              authMember?.memberDesc ? authMember.memberDesc : "no description"
            }
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            onChange={memberDescHandler}
          />
        </div>
      </Box>
      <Box className={"save-box"}>
        <Button variant={"contained"} onClick={submitButton}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
