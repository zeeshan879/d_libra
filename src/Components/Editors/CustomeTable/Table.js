import React, { useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import TableRow from "@material-ui/core/TableRow";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getParentChildCategories } from "../../../Redux/Actions/Editor/Category";
import { home } from "../../../Redux/Actions/Client Side/home.action";

import OpenWithIcon from "@mui/icons-material/OpenWith";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import "../EditCourseStructure.css";
import { GoPrimitiveDot } from "react-icons/go";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(38, 36, 42, 0.7)",
    color: "black",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "transparent",
    border: "none",
    color: "black",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CollapsibleTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [selectedID, setSelectedID] = useState(null);
  const [parentChidCategory, setParentChidCategory] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState(false);

  // console.log("parentChidCategory", parentChidCategory);

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempData = Array.from(parentChidCategory);
    let [source_data] = tempData.splice(e?.source?.index, 1);
    tempData.splice(e?.destination?.index, 0, source_data);
    setParentChidCategory(tempData);
  };

  const hanldeUpdateStatus = () => {
    setOrder(!order);
  };

  const ParentChildCategories = async () => {
    const responseTwo = await dispatch(home(token));
    setParentChidCategory(responseTwo[0]?.data);
  };

  useEffect(() => {
    order ? handleDragEnd() : ParentChildCategories();
  }, []);

  return (
    <>
      <TableContainer style={{ padding: "10px 20px" }}>
        <Table
          sx={{ minWidth: 700 }}
          size="small"
          aria-label="customized table"
        >
          <TableHead>
            <StyledTableCell
              className="tablefirstheader"
              sx={{ borderBottom: "none !important", width: "100px" }}
            ></StyledTableCell>
            <StyledTableCell
              className="tablefirstheader"
              sx={{ borderBottom: "none !important", width: "300px" }}
            >
              TITLE
            </StyledTableCell>
            <StyledTableCell
              className="tablefirstheader"
              sx={{ borderBottom: "none !important", width: "300px" }}
            >
              NAME
            </StyledTableCell>
            <StyledTableCell
              className="tablefirstheader"
              sx={{ borderBottom: "none !important", width: "300px" }}
            >
              UNIQUE IDENTIFIER
            </StyledTableCell>
            <StyledTableCell
              className="tablefirstheader"
              sx={{ borderBottom: "none !important", width: "500px" }}
            >
              IMAGE
            </StyledTableCell>
            <StyledTableCell
              className="tablefirstheader"
              sx={{ borderBottom: "none !important", width: "300px" }}
            >
              CREATED DATE
            </StyledTableCell>
            <StyledTableCell
              className="tablefirstheader"
              sx={{ borderBottom: "none !important", width: "300px" }}
            >
              UPDATED DATE
            </StyledTableCell>
          </TableHead>
          <TableBody>
            <DragDropContext onDragEnd={handleDragEnd}>
              {parentChidCategory?.map((row, index) => (
                <>
                  <Droppable droppableId={row.chaptername}>
                    {(provider) => (
                      <TableRow
                        hover
                        key={row.unique_identifier}
                        onClick={() => {
                          setSelectedID(row.unique_identifier);
                        }}
                        selected={selectedID === row.unique_identifier}
                        ref={provider.innerRef}
                        {...provider.droppableProps}
                        className="zia"
                        style={{
                          backgroundColor:
                            index % 2 === 0
                              ? " rgba(42, 36, 42, 0.9) !important"
                              : "rgba(38, 36, 42, 0.7)",
                          borderBottom: "none !important",
                        }}
                      >
                        <Draggable
                          key={row.chaptername}
                          draggableId={row.chaptername}
                          index={index}
                        >
                          {(provider) => (
                            <>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={8}
                                sx={{
                                  borderBottom: "none !important",
                                }}
                                {...provider.draggableProps}
                                ref={provider.innerRef}
                              >
                                <StyledTableCell
                                  sx={{
                                    border: "none !important",
                                    width: "100px",
                                  }}
                                >
                                  <div className="table_icons">
                                    <IconButton
                                      size="small"
                                      onClick={() => setOpen(!open)}
                                    >
                                      {open ? (
                                        <KeyboardArrowDownIcon
                                          color="white"
                                          className="open_icon_table"
                                          style={{ color: "white" }}
                                        />
                                      ) : (
                                        <KeyboardArrowRightIcon
                                          color="white"
                                          className="open_icon_table"
                                          style={{ color: "white" }}
                                        />
                                      )}
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      {...provider.dragHandleProps}
                                    >
                                      <OpenWithIcon
                                        onClick={hanldeUpdateStatus}
                                        color="info"
                                      />
                                    </IconButton>
                                  </div>
                                </StyledTableCell>
                                <StyledTableCell
                                  className="tableBody"
                                  sx={{
                                    borderBottom: "none !important",
                                    color: "#009af9 !important",
                                    width: "10vw",
                                  }}
                                >
                                  <Typography
                                    noWrap="true"
                                    style={{ width: "120px" }}
                                  >
                                    {row.chaptername}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell
                                  className="tableBody"
                                  sx={{
                                    borderBottom: "none !important",
                                    width: "16vw",
                                  }}
                                >
                                  <Typography
                                    noWrap="true"
                                    style={{ width: "120px" }}
                                  >
                                    {row.chaptername}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell
                                  className="tableBody"
                                  sx={{
                                    borderBottom: "none !important",
                                    width: "16vw",
                                  }}
                                >
                                  <Typography
                                    noWrap="true"
                                    style={{ width: "120px" }}
                                  >
                                    {row.unique_identifier
                                      .toString()
                                      ?.replace(/(\d{4})(\d{2})/, "$1-$2")}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell
                                  className="tableBody"
                                  sx={{
                                    borderBottom: "none",
                                    width: "16vw",
                                  }}
                                >
                                  <Typography
                                    noWrap="true"
                                    className="image_text"
                                    style={{ width: "280px" }}
                                  >
                                    {row.image}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell
                                  className="tableBody"
                                  sx={{
                                    borderBottom: "none !important",
                                    width: "12vw",
                                  }}
                                >
                                  <Typography
                                    noWrap="true"
                                    style={{ width: "150px" }}
                                  >
                                    {row.created_at?.split("T")[0]}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell
                                  className="tableBody"
                                  sx={{
                                    borderBottom: "none !important",
                                    width: "12vw",
                                  }}
                                >
                                  <Typography
                                    noWrap="true"
                                    style={{ width: "150px" }}
                                  >
                                    {row.updated_at?.split("T")[0]}
                                  </Typography>
                                </StyledTableCell>
                              </TableCell>
                            </>
                          )}
                        </Draggable>
                        {provider.placeholder}
                      </TableRow>
                    )}
                  </Droppable>

                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                      sx={{
                        borderBottom: "none !important",
                      }}
                    >
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Table>
                            <TableBody>
                              {row?.items?.map((category, i) => (
                                <Droppable droppableId={category.CategoryName}>
                                  {(provide) => (
                                    <StyledTableRow
                                      hover
                                      key={category.id}
                                      onClick={() => {
                                        setSelectedID(category.id);
                                      }}
                                      selected={selectedID === category.id}
                                      ref={provide.innerRef}
                                      {...provide.droppableProps}
                                    >
                                      <Draggable
                                        key={category.CategoryName}
                                        draggableId={category.CategoryName}
                                        index={i}
                                      >
                                        {(provide) => (
                                          <StyledTableRow
                                            {...provide.draggableProps}
                                            ref={provide.innerRef}
                                          >
                                            <StyledTableCell
                                              {...provide.dragHandleProps}
                                              sx={{
                                                border: "none !important",
                                                width: "150px",
                                                paddingLeft: "30px",
                                              }}
                                            >
                                              <div className="table_icons">
                                                {/* <IconButton
                                                  size="small"
                                                  onClick={() => setOpen(!open)}
                                                >
                                                  {open ? (
                                                    <GoPrimitiveDot
                                                      color="white"
                                                      className="open_icon_table"
                                                    />
                                                  ) : (
                                                    <GoPrimitiveDot
                                                      color="white"
                                                      className="open_icon_table"
                                                    />
                                                  )}
                                                </IconButton> */}
                                                <IconButton size="small">
                                                  <OpenWithIcon
                                                    onClick={hanldeUpdateStatus}
                                                    color="info"
                                                  />
                                                </IconButton>
                                              </div>
                                            </StyledTableCell>
                                            <StyledTableCell
                                              sx={{
                                                borderBottom: "none !important",
                                                color: "#009af9 !important",
                                                width: "180px",
                                              }}
                                            >
                                              {category.CategoryName}
                                            </StyledTableCell>
                                            <StyledTableCell
                                              sx={{
                                                borderBottom: "none !important",
                                                color: "#ffffff !important",
                                                width: "235px",
                                              }}
                                            >
                                              {category.CategoryName}
                                            </StyledTableCell>
                                            <StyledTableCell
                                              sx={{
                                                borderBottom: "none !important",
                                                color: "#ffffff !important",
                                                width: "260px",
                                              }}
                                            >
                                              {category.unique_identifier
                                                .toString()
                                                ?.replace(
                                                  /(\d{4})(\d{2})(\d{2})/,
                                                  "$1-$2-$3"
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell
                                              sx={{
                                                borderBottom: "none !important",
                                                color: "#009af9 !important",
                                                width: "380px",
                                                textAlign: "left",
                                                paddingLeft: "40px",
                                              }}
                                            >
                                              {category.image}
                                            </StyledTableCell>
                                            <StyledTableCell
                                              sx={{
                                                borderBottom: "none !important",
                                                color: "#ffffff !important",
                                                width: "220px",

                                                textAlign: "left",
                                              }}
                                              className="date_text_container_one"
                                            >
                                              {
                                                category.created_at?.split(
                                                  "T"
                                                )[0]
                                              }
                                            </StyledTableCell>
                                            <StyledTableCell
                                              sx={{
                                                borderBottom: "none !important",
                                                color: "#ffffff !important",
                                                width: "240px",
                                                textAlign: "left",
                                              }}
                                              className="date_text_container_two"
                                            >
                                              {
                                                category.updated_at?.split(
                                                  "T"
                                                )[0]
                                              }
                                            </StyledTableCell>
                                          </StyledTableRow>
                                        )}
                                      </Draggable>
                                      {provide.placeholder}
                                    </StyledTableRow>
                                  )}
                                </Droppable>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </DragDropContext>
          </TableBody>
        </Table>
      </TableContainer>
      <span style={{ padding: "0px 20px" }}>
        {parentChidCategory?.length} categories
      </span>
    </>
  );
};
export default CollapsibleTable;
