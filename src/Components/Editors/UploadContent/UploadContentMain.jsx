import React, { useState, useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ArrowBack } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "./UploadContentMain.css";
import { addPost } from "../../../Redux/Actions/Editor/post.action";
import {
  getChildCategories,
  getParentChildCategories,
} from "../../../Redux/Actions/Editor/Category";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CKEditor from "ckeditor4-react-advanced";
import { FileUploader } from "react-drag-drop-files";
import Tooltip from "@mui/material/Tooltip";

const UploadContentMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [contentTitle, setContentTitle] = useState("");
  const [contentId, setContentId] = useState("");
  const [uniqueIdentity, setUniqueIdentity] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [clearImage, setClearImage] = useState(false);
  const [metaDescription, setMetaDiscription] = useState("");
  const [OGP, setOGP] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [imageName, setImageName] = useState("");
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);
  const role = useSelector((state) => state.auth.role);

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionContent, setSelectedOptionContent] = useState("");

  const [CKEditorState, setCKEditorState] = useState("");

  const fileTypes = ["JPEG", "PNG", "SVG", "GIF", "JPG"];

  // console.log("image image", image);
  // console.log("image imageName", imageName);

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  // const onEditorStateChange = (editorState) => {
  //   return setEditorState(editorState);
  // };
  // const htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  // console.log("hrmlText", htmlText);

  const [parentCategory, setParentCategory] = useState([]);
  const [childCategory, setChildCategory] = useState([]);

  let uniqueIdentifierWithOutHyphens = uniqueIdentity?.replace(/-/g, "");

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

  const hanldeSetUniqueIdentity = (target) => {
    let hyphenValue = target.value?.replace(/\D/g, "");

    setUniqueIdentity(
      hyphenValue?.replace(/(\d{4})(\d{2})(\d{2})(\d{4})/, "$1-$2-$3-$4")
    );
  };

  const handleButton = async (e) => {
    e.preventDefault();
    // navigate("/editormainpage")
    setIsLoading(true);

    const response = await dispatch(
      addPost(
        contentTitle,
        contentId,
        tags,
        CKEditorState,
        imageName,
        metaDescription,
        "OGP",
        uniqueIdentifierWithOutHyphens,
        token
      )
    );
    // console.log("response", response);
    setMessage(response?.message);
    if (response?.message === "Add Post Successfully") {
      navigate("/editormainpage");
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);

    setIsLoading(false);
    return () => clearTimeout(timer);
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
    control: (base) => ({
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
    menu: (base, state) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "yellow",
      color: " #363636",
    }),
    menuList: (base, state) => ({
      ...base,
      padding: 0,
      background: "white",
      color: " #363636",
    }),
    singleValue: (base, state) => ({
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
    control: (base) => ({
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
    menu: (base, state) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "yellow",
      color: "black",
    }),
    menuList: (base, state) => ({
      ...base,
      padding: 0,
      background: "white",
      color: "black",
    }),
    singleValue: (base, state) => ({
      ...base,
      color: "#FFFFFF",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "white",
    }),
  };

  const handleBackgroung = () => {
    if (
      theme === true &&
      window.location.href.split("/")[3] === "uploadcontentmain"
    ) {
      return "#eeeeee";
    }
  };

  const handleBack = () => {
    navigate("/editormainpage");
  };

  const handleParentChildeCategory = async () => {
    const response = await dispatch(getParentChildCategories(token, role));
    // console.log("getParentChildCategories response", response)
    setParentCategory(response);
  };

  useEffect(() => {
    handleParentChildeCategory();
  }, []);

  const parentOptions = parentCategory?.map((category) => {
    // console.log("category.id", category.id);
    return { id: category.id, label: category.CategoryName };
  });
  // console.log("parentCategory", parentOptions, selectedOption);

  const handleSelector = async (selectedOption) => {
    setSelectedOption(selectedOption);
    // console.log("selectedOption ID", selectedOption);
    setContentId(selectedOption?.id);

    const response = await dispatch(
      getChildCategories(selectedOption.id, token)
    );
    setChildCategory(response);
    // console.log("response", response);
  };

  const childOptions = childCategory?.map((category) => {
    // console.log("category.id", category.id);
    return {
      id: category?.id,
      label: category?.course,
      identifier: category?.unique_identifier,
    };
  });

  const handleSelectorContent = (selectedOptionContent) => {
    setSelectedOptionContent(selectedOptionContent);
    // console.log("selectedOption ID", selectedOptionContent);
    let hypenIdentifierContent = (selectedOptionContent?.identifier)
      .toString()
      ?.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    setUniqueIdentity(hypenIdentifierContent);
  };

  const handleEditorChange = (evt) => {
    setCKEditorState(evt.editor.getData());
  };

  // const editorConfig = {
  //   toolbar: [
  //     {
  //       name: "document",
  //       items: ["Source", "-", "NewPage", "Preview", "-", "Templates"],
  //     },
  //     {
  //       name: "clipboard",
  //       items: [
  //         "Cut",
  //         "Copy",
  //         "Paste",
  //         "PasteText",
  //         "PasteFromWord",
  //         "-",
  //         "Undo",
  //         "Redo",
  //       ],
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
  //         "RemoveFormat",
  //       ],
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
  //       items: ["Image", "Link", "Unlink", "Table", "HorizontalRule", "doctools"],
  //     },

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
  //       name: "items",
  //       items: [
  //         "Save",
  //         "Print",
  //         "document",
  //         "tools",
  //         "PasteFromWord",
  //         "SelectAll",
  //         "Scayt",
  //         "Form",
  //         "Checkbox",
  //         "Textarea",
  //         "Select",
  //         "Button",
  //         "ImageButton",
  //         "HiddenField",
  //         "Language",

  //         "Smiley",
  //         "SpecialChar",
  //         "PageBreak",
  //         "Iframe",
  //         "Anchor",
  //         "ShowBlocks",
  //         "CopyFormatting",
  //       ],
  //     },
  //     "/",
  //     {
  //       name: "styles",
  //       items: [
  //         "Styles",
  //         "Format",
  //         "-",
  //         "Font",
  //         "-",
  //         "FontSize",
  //         "Flash",
  //         "fontfamily",
  //       ],
  //     },
  //     {
  //       name: "hello",
  //       items: ["CreateDiv", "Find", "Replace", "CreatePlaceholder"],
  //     },
  //     {
  //       name: "colorStyles",
  //       items: ["TextColor", "BGColor", "Maximize", "BidiLtr", "BidiRtl"],
  //     },
  //     '/',
  //     { name: 'base', items: [ 'basicstyles', 'cleanup' ] },
  //   ],
  //   skin: "moono",
  //   extraPlugins: "justify, colorbutton, font",
  //   removeButtons: "",
  //   shouldNotGroupWhenFull: true,
  // };

  // CKEditor.editorbgcolor = 'grey';
  // CKEditor.config.removeButtons  = 'help';

  return (
    <>
      <div style={{ background: handleBackgroung() }}>
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
          Upload a New Content
        </div>
        <Grid container className="main_root_container_upload_content">
          <Grid
            item
            lg={4}
            md={4}
            sm={12}
            xs={12}
            style={{ marginTop: "-15px" }}
          >
            {message === "Add Post Successfully" ? (
              <div className={theme ? "successMessage" : "successMessageTwo"}>
                <h4>Post added Successfully.</h4>
              </div>
            ) : message === "All Fields are Required" ? (
              <div className="errorMessage">{message}</div>
            ) : message === "title Already Exist" ? (
              <div className="errorMessage">Content title already exist.</div>
            ) : message === "Image format is incorrect" ? (
              <div className="errorMessage">
                {message}. Please upload in jpeg,png file foramte
              </div>
            ) : message ===
              "['title', 'Categroyid', 'tags', 'image', 'content', 'meta_description', 'OGP', 'uniqueidentifier'] all keys are required" ? (
              <div className="errorMessage">All Fields are Required</div>
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
                placeholder="Git & GitHub Introduction"
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
                // placeholder="Git & GitHub Introduction"
                options={childOptions}
                onChange={handleSelectorContent}
                value={selectedOptionContent}
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
                    ? "uploadcontentinputfieldtwo widthautoclass "
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
                value={uniqueIdentity}
                maxLength={12}
                minLength={8}
                onChange={(e) => hanldeSetUniqueIdentity(e.target)}
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
                placeholder="Tags"
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
            style={{ float: "right" }}
          >
            <div className="widthautoclass">
              <Grid container spacing={1}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <div className="main_slide_container">
                    <div style={{ paddingBottom: "10px" }}></div>
                    <span>{imageName?.name}</span>
                    <div style={{ marginTop: "10px" }}>
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
                          className="image_button selectanimagebutton"
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
                  className={
                    theme ? "addcategory_text_two" : "addcategory_text"
                  }
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
                    // data="Type here..."
                    // config={editorConfig}
                    onChange={(evt) => handleEditorChange(evt)}
                    placeholder="Write description here"
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
              <button className="update_button_new" onClick={handleButton}>
                Upload
              </button>
            )}
          </div>
        </Grid>
      </div>
    </>
  );
};

export default UploadContentMain;
