import React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import "./Accordian.css";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getPostByIDAccordian } from "../../../Redux/Actions/Editor/post.action";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { GetDashboardDataWithAuthorization } from "../../../Redux/Actions/Dashboard.Data.action";
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Accordian = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);

  const [expanded, setExpanded] = React.useState("panel1");
  const [parentCategory, setParentCategory] = React.useState([]);
  const [status, setStatus] = React.useState(false);
  const [hide, setHide] = React.useState(true);

  console.log(location?.pathname.split("/"));

  const handleChange = (panel) => (event, newExpanded) => {
    console.log(panel);
    setExpanded(newExpanded ? panel : false);
  };

  let courseid = location?.pathname?.split("/")[5];
  console.log("courseid", courseid);

  const handleDetails = async (
    identifier,
    title,
    categoryid,
    postId,
    courseId,
    meta,
    img
  ) => {
    props.hideAccordianOnClick(hide);
    let hyphenValue = identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");
    navigate(
      `/topic/${hyphenValue}_${title}/${postId}/${categoryid}/${courseId}/${meta}/${img}`
        ?.replace(/\s+/g, "-")
        ?.replace("?", ""),
      {
        state: {
          path: location?.state?.path,
        },
      }
    );
  };

  const authDashboardData = async () => {
    const response = await dispatch(
      GetDashboardDataWithAuthorization(courseid, role, token)
    );
    // console.log("Get Dashboard Data Response two", response);
    // console.log("Get Dashboard Data Response", response?.data?.slice(1));
    setParentCategory(response);
  };

  React.useEffect(() => {
    // postById();
    authDashboardData();
    const timer = setTimeout(() => {
      setStatus(true);
    }, 3000);
  }, [location]);
  return (
    <>
      {parentCategory?.data?.length > 0 ? (
        <div className="mainAccordionContainer">
          {parentCategory?.data?.slice(1)?.map((chapter) => (
            <Accordion
              expanded={expanded === chapter?.id}
              onChange={handleChange(chapter?.id)}
              className="main_accordian_container"
            >
              <AccordionSummary
                className="accordianmain"
                expandIcon={<ExpandMoreIcon className="accordionarrowicon" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className="accordiantext">
                  {chapter?.CategoryName !== undefined ? (
                    chapter?.CategoryName?.charAt(0).toUpperCase() +
                    chapter?.CategoryName?.slice(1)
                  ) : (
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress color="inherit" size={20} />
                    </Box>
                  )}
                </Typography>
              </AccordionSummary>
              {chapter?.lecture?.length > 0 ? (
                <>
                  {chapter?.lecture?.map((topic) => {
                    return (
                      <AccordionDetails className="sub_accordain_text">
                        <Typography
                          className="accordiantext"
                          onClick={() =>
                            handleDetails(
                              topic?.unique_identifier,
                              topic?.title,
                              chapter?.id,
                              topic?.id,
                              topic?.courseid,
                              topic?.meta_description,
                              topic.images?.replaceAll("/", "|")
                            )
                          }
                        >
                          {topic?.title !== undefined &&
                            topic?.title?.charAt(0).toUpperCase() +
                              topic?.title?.slice(1)}
                        </Typography>
                      </AccordionDetails>
                    );
                  })}
                </>
              ) : (
                <AccordionDetails className="sub_accordain_text">
                  <h5 style={{ textAlign: "center", color: "white" }}>
                    No content found
                  </h5>
                </AccordionDetails>
              )}
            </Accordion>
          ))}
        </div>
      ) : (
        <div className="mainAccordionContainer">
          <AccordionSummary
            className="accordianmain"
            // expandIcon={<ExpandMoreIcon className="accordionarrowicon" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {status ? (
              <Typography className="accordiantextTwo">
                No content found
              </Typography>
            ) : (
              <Box
                className="accordiantextTwo"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CircularProgress color="inherit" size={40} />
              </Box>
            )}
          </AccordionSummary>
        </div>
      )}
    </>
  );
};

export default Accordian;
