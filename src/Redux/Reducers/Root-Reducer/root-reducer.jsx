import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { auth, theme, pin, searchSTate } from "../auth.reducer";
import { viewRecentCourseStatus } from "../course.status.action";
import { dashboardData } from "../dashboard.data.reducer";
import { parentChildCategory } from "../editor/category";
import { mainCategoryData } from "../main.category.reducer";
import { searchResultData } from "../search.result.reducer";

// Redux persist configiration
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "theme",
    "dashboardData",
    "pin",
    "searchSTate",
    "mainCategoryData",
    "searchResultData",
    "viewRecentCourseStatus",
    "parentChildCategory",
  ],
};

const rootReducer = combineReducers({
  // Add reducers here
  auth,
  theme,
  dashboardData,
  pin,
  searchSTate,
  mainCategoryData,
  searchResultData,
  viewRecentCourseStatus,
  parentChildCategory,
});

export default persistReducer(persistConfig, rootReducer);
