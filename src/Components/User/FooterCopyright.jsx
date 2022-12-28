import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const FooterCopyright = (props) => {
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  const theme = useSelector((state) => state.theme.state);
  const handleFooter = () => {
    if (
      "/editormainpage" === location.pathname ||
      "/register" === location.pathname ||
      "/login" === location.pathname ||
      "/logout" === location.pathname ||
      "/changepassword" === location.pathname ||
      "/ratingsidebar" === location.pathname
    ) {
      return "none";
    } else {
      return "flex";
    }
  };

  return (
    <div
      className="footer_copyright"
      style={{
        color: theme ? " #000000" : " #C8C8C8 ",
        display: handleFooter(),
      }}
    >
      <span style={{ fontSize: "12px" }}  className={role === "normaluser" && "footer_copyright_normaluser"}>
        &copy; D-Libra All Rights Reserved
      </span>
    </div>
  );
};

export default FooterCopyright;
