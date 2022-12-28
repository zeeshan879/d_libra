import React, { useState, useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import "./UploadContentMain.css";
import Select from "react-select";
import {
  getChildCategories,
  getParentChildCategories,
} from "../../../Redux/Actions/Editor/Category";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  getPostByID,
  updatePost,
} from "../../../Redux/Actions/Editor/post.action";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { development } from "../../../endpoints";
import CKEditor from "ckeditor4-react-advanced";
import { FileUploader } from "react-drag-drop-files";
import Tooltip from "@mui/material/Tooltip";

const EditContentMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const { state } = useLocation();
  console.log(params);

  const [contentTitle, setContentTitle] = useState("");
  const [imageName, setImageName] = useState("");
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [unique, setUnique] = useState();
  const [contentId, setContentId] = useState(params?.id);
  const [categoryId, setCategoryId] = useState(params?.categoryid);
  const [tags, setTags] = useState();
  const [image, setImage] = useState("");
  const [clearImage, setClearImage] = useState(false);
  const [metaDescription, setMetaDiscription] = useState("");
  // const [OGP, setOGP] = useState();
  // console.log("contentTitle", contentTitle, tags)
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionChild, setSelectedOptionChild] = useState("");

  const [parentCategory, setParentCategory] = useState([]);
  const [childCategory, setChildCategory] = useState([]);
  const [childCategoryTwo, setChildCategoryTwo] = useState([]);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [CKEditorState, setCKEditorState] = useState("");

  const fileTypes = ["JPEG", "PNG", "SVG", "GIF", "JPG"];

  console.log("CKEditorState", CKEditorState);

  const handleChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageName(e.target.files[0]);
    if (e.target.files[0]) {
      setClearImage(true);
    }
  };

  const handleChangeDragDrop = (file) => {
    console.log("file", file);
    setImage(URL.createObjectURL(file));
    setImageName(file);
    if (file) {
      setClearImage(true);
    }
  };

  const handleClearImage = () => {
    setImage("");
    setImageName("");
    setClearImage(false);
  };

  // console.log("selectedOption", selectedOption);

  const handleBack = () => {
    navigate(
      `/topic/${params?.identifier_name}/${params?.id}/${params?.categoryid}/${params.courseid}/${params.meta}/${params.img}`
        ?.replace(/\s+/g, "-")
        ?.replace("?", ""),
      {
        state: { path: location?.state },
      }
    );
  };

  const customStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      // console.log({ data, isDisabled, isFocused, isSelected });

      return {
        ...styles,
        backgroundColor: isFocused ? " #FFFFFF" : " #FFFFFF",
        color: " #363636",
      };
    },
    control: (base, state) => ({
      ...base,
      background: " #FFFFFF",
      borderRadius: "5px",
      border: "none",
      color: " #363636",
      boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.25)",
      height: "40px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#111111",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "yellow",
      color: " #363636",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      background: "white",
      color: " #363636",
    }),
    singleValue: (base) => ({
      ...base,
      color: " #363636",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: " #363636",
    }),
  };

  const customStyless = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      // console.log({ data, isDisabled, isFocused, isSelected });
      return {
        ...styles,
        backgroundColor: isFocused ? "#4F4F4F" : "#4F4F4F",
        color: "white",
      };
    },
    control: (base, state) => ({
      ...base,
      background: " #4F4F4F",
      borderRadius: "5px",
      border: "none",
      color: "white",
      boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.25)",
      height: "40px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#FFFFFF",
      opacity: 1,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "yellow",
      color: "black",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      background: "white",
      color: "black",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#FFFFFF",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "white",
    }),
  };

  // useEffect(() => {}, [editorState]);

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  // const onEditorStateChange = (editorState) => {
  //   return setEditorState(editorState);
  // };
  // const htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  // console.log("htmlText", htmlText)

  const handleParentChildeCategory = async () => {
    const response = await dispatch(getParentChildCategories(token, role));
    // console.log("getParentChildCategories response", response)
    setParentCategory(response);
  };

  useEffect(() => {
    handleParentChildeCategory();
  }, [contentTitle]);

  const parentOptions = parentCategory?.map((category) => {
    // console.log("category.id", category.id);
    return { id: category.id, label: category.CategoryName };
  });
  // console.log("parentCategory", parentOptions, selectedOption);

  const childOptions = childCategory?.map((category) => {
    // console.log("category.id", category);
    return {
      id: category.id,
      label: category.course,
      identifier: category?.unique_identifier,
    };
  });

  const handleSelector = async (selectedOption) => {
    setSelectedOption(selectedOption);
    // console.log("selectedOption ID", selectedOption.id);

    const response = await dispatch(
      getChildCategories(selectedOption.id, token)
    );
    setChildCategory(response);
    // console.log("response", response);
  };

  const handleSelectorChild = async (selectedOptionChild) => {
    setSelectedOptionChild(selectedOptionChild);
    // console.log("selectedOption ID", selectedOptionChild);
    let hypenIdentifierChild = (selectedOptionChild?.identifier)
      .toString()
      ?.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    setUnique(hypenIdentifierChild);

    const response = await dispatch(
      getChildCategories(selectedOption.id, token)
    );
    setChildCategoryTwo(response);
    // console.log("response", response);
  };

  const handleUpdatePost = async () => {
    setIsLoading(true);
    const response = await dispatch(
      updatePost(
        contentTitle,
        categoryId,
        tags,
        CKEditorState,
        imageName,
        contentId,
        metaDescription,
        "OGP",
        token
      )
    );
    // console.log("handleUpdatePost response", response);
    setMessage(response?.message);
    if (response?.message === "Update Post Successfully") {
      navigate(
        `/topic/${params?.identifier_name}/${params?.id}/${params?.categoryid}/${params.courseid}/${params.meta}/${params.img}`
          ?.replace(/\s+/g, "-")
          ?.replace("?", ""),
        {
          state: { path: state },
        }
      );
    }
    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timer);
  };
  console.log("courseid", params);
  useEffect(() => {
    const postById = async () => {
      const response = await dispatch(
        getPostByID(params.id, role, params.categoryid, params.courseid, token)
      );
      console.log("response", response);
      setTags(response?.post?.tags);
      setContentTitle(response?.post?.title);
      setMetaDiscription(response?.post?.meta_description);
      // setOGP(response?.post?.OGP);
      setImage(`${development}/media/${response?.post?.images}`);
      setTags(response?.post?.tags);
      setCKEditorState(response?.post?.content);

      if (response?.post?.images) {
        setClearImage(true);
      }
    };
    postById();
  }, []);

  // const editorConfig = {
  //   toolbar: [
  //     {
  //       name: "source",
  //       items: ["Source"],
  //     },

  //     {
  //       name: "basicstyles",
  //       items: [
  //         "Bold",
  //         "Italic",
  //         "Underline",
  //         "Strike",
  //         "-",
  //         "Subscript",
  //         "Superscript",
  //       ],
  //     },
  //     {
  //       name: "colorStyles",
  //       items: ["TextColor", "BGColor", "Maximize"],
  //     },
  //     {
  //       name: "paragraph",
  //       items: [
  //         "AlignLeft",
  //         "JustifyLeft",
  //         "JustifyCenter",
  //         "JustifyRight",
  //         "JustifyBlock",
  //       ],
  //     },
  //     {
  //       name: "lists",
  //       items: [
  //         "NumberedList",
  //         "BulletedList",
  //         "-",
  //         "Outdent",
  //         "Indent",
  //         "Blockquote",
  //       ],
  //     },
  //     {
  //       name: "insert",
  //       items: ["Image", "Link", "Unlink", "Table", "HorizontalRule"],
  //     },
  //     "/",

  //     {
  //       name: "clipboard",
  //       items: [
  //         "Undo",
  //         "Redo",
  //         "Cut",
  //         "Copy",
  //         "Paste",
  //         "PasteText",
  //         "Radio",
  //         "TextArea",
  //       ],
  //     },
  //     {
  //       name: "document",
  //       items: [
  //         "Save",
  //         "NewPage",
  //         "Preview",
  //         "Print",
  //         "Templates",
  //         "tools",
  //         "PasteFromWord",
  //         "Find",
  //         "SelectAll",
  //         "Scayt",
  //         "Replace",
  //         "Form",
  //         "Checkbox",
  //         "Textarea",
  //         "Select",
  //         "Button",
  //         "ImageButton",
  //         "HiddenField",
  //         "CreateDiv",
  //         "BidiLtr",
  //         "BidiRtl",
  //         "Language",
  //         "Flash",
  //         "Smiley",
  //         "SpecialChar",
  //         "PageBreak",
  //         "Iframe",
  //         "Anchor",
  //         "ShowBlocks",
  //         "CopyFormatting",
  //       ],
  //     },
  //     {
  //       name: "styles",
  //       items: ["Styles", "Format", "-", "Font", "-", "FontSize"],
  //     },
  //   ],
  //   skin: "moono",
  //   extraPlugins: "justify, colorbutton, font",
  //   removeButtons: "",
  // };

  const handleEditorChange = (evt) => {
    setCKEditorState(evt.editor.getData());
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="back_button"
        style={{ color: `${theme ? " #363636" : "  #C8C8C8"}` }}
      >
        <ArrowBack className="backbutton_icon" />{" "}
        <span className="backbutton_text">Back</span>
      </button>
      <div
        className={
          theme ? "upload_new_content_text_sub" : "upload_new_content_text"
        }
      >
        Edit Contents
      </div>
      <Grid container className="main_root_container_upload_content">
        <Grid item lg={4} md={4} sm={12} xs={12} style={{ marginTop: "-15px" }}>
          {message === "All Fields are Required" ? (
            <div className="errorMessage">{message}</div>
          ) : message === "title Already Exist" ? (
            <div className="errorMessage">Content title already exist.</div>
          ) : message === "Image format is incorrect" ? (
            <div className="errorMessage">
              {message}. Please upload in jpeg,png or svg file foramte
            </div>
          ) : null}
          <div>
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
            >
              Select Course
            </span>
            <Select
              styles={theme ? customStyles : customStyless}
              className={
                theme
                  ? "git_introduction_dropdown_sub_three"
                  : "git_introduction_dropdown_sub_two"
              }
              placeholder="Select"
              options={parentOptions}
              onChange={handleSelector}
              value={selectedOption}
            />
          </div>
          <div>
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
            >
              Select Chapter
            </span>

            <Select
              styles={theme ? customStyles : customStyless}
              className={
                theme
                  ? "git_introduction_dropdown_sub_three"
                  : "git_introduction_dropdown_sub_two"
              }
              placeholder="Select"
              options={childOptions}
              onChange={handleSelectorChild}
              value={selectedOptionChild}
            />
          </div>
          <div>
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
            >
              Content Title
            </span>
            <input
              className={
                theme
                  ? "uploadcontentinputfieldtwo widthautoclass"
                  : "uploadcontentinputfield widthautoclass"
              }
              placeholder="Content Title"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
            />
          </div>
          <div>
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
            >
              Content ID
            </span>
            <input
              className={
                theme
                  ? "uploadcontentinputfieldtwo widthautoclass"
                  : "uploadcontentinputfield widthautoclass"
              }
              placeholder="Content ID"
              value={unique}
            />
          </div>
          <div>
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
            >
              Tags(Max 5 Tags)
            </span>
            <input
              className={
                theme
                  ? "uploadcontentinputfieldtwo widthautoclass"
                  : "uploadcontentinputfield widthautoclass"
              }
              placeholder="Tags(Max 5 Tags)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div>
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
            >
              Meta Descriptions
            </span>
            <textarea
              className={
                theme
                  ? "addcategory_textarea widthautoclass"
                  : "addcategory_textarea_sub widthautoclass"
              }
              id="message"
              rows="6"
              placeholder="Meta Descriptions"
              value={metaDescription}
              onChange={(e) => setMetaDiscription(e.target.value)}
            />
          </div>
          {/* <div>
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
            >
              OGP(Open Graph Protocol)
            </span>
            <textarea
              className={
                theme
                  ? "addcategory_textarea widthautoclass"
                  : "addcategory_textarea_sub widthautoclass"
              }
              id="message"
              rows="6"
              placeholder="OGP(Open Graph Protocol)"
              value={OGP}
              onChange={(e) => setOGP(e.target.value)}
            />
          </div> */}
        </Grid>
        <Grid
          item
          lg={8}
          md={8}
          sm={12}
          xs={12}
          className="reactdraftcontainer"
        >
          <div className="widthautoclass">
            <Grid container spacing={1}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <div className="main_slide_container">
                  <div style={{ paddingBottom: "10px" }}>
                    <span>{imageName?.name}</span>
                  </div>
                  <div>
                    <label htmlFor="contained-button-file">
                      <input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => handleChange(e)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        className="image_button"
                      >
                        Select an Image File
                      </Button>
                    </label>
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <FileUploader
                    multiple={false}
                    // label="Drop a file right here"
                    hoverTitle=""
                    handleChange={handleChangeDragDrop}
                    name="file"
                    types={fileTypes}
                    children={
                      <div>
                        <div
                          className={
                            theme
                              ? "drop_file_container_white"
                              : "drop_file_container"
                          }
                        >
                          <div className="drop_file_container_text">
                            Drop a file here
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
              </Grid>

              <Grid item lg={8} md={8} sm={0} xs={0}>
                <div className="image_none">
                  <div style={{ display: "flex", gap: "13.8rem" }}>
                    <div>
                      <span
                        style={{ color: `${theme ? "#363636" : "#FFFFFF"}` }}
                      >
                        Preview
                      </span>
                    </div>

                    {clearImage && (
                      <Tooltip title="Clear Image" placement="top">
                        <div>
                          <span
                            style={{
                              color: `${theme ? "#363636" : "#FFFFFF"}`,
                              cursor: "pointer",
                            }}
                          >
                            <CancelIcon onClick={handleClearImage} />
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  {image ? (
                    <img src={image} className="noimagecontainer" alt="" />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
              </Grid>
            </Grid>
            <div className="editormaincontainer">
              <span
                className={theme ? "addcategory_text_two" : "addcategory_text"}
              >
                Edit Main Content
              </span>
              <div
                style={{
                  backgroundColor: `${theme ? "white" : "#4f4f4f"}`,
                }}
                // className="editorstatecontainer"
              >
                {/* <Editor
                  editorState={editorState}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={onEditorStateChange}
                  placeholder="Write description here"
                /> */}

                <CKEditor
                  data={CKEditorState}
                  // config={editorConfig}
                  onChange={(evt) => handleEditorChange(evt)}
                />
              </div>
            </div>
          </div>
        </Grid>
        <div className="updatecontainerbutton">
          {isLoading ? (
            <Box
              className="loginbuttontext"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <CircularProgress color="inherit" size={30} />
            </Box>
          ) : (
            <button className="update_button_new" onClick={handleUpdatePost}>
              Update
            </button>
          )}
        </div>
      </Grid>
    </>
  );
};

export default EditContentMain;
