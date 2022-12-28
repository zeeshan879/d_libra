import Vector90 from "../../../assests/Vector90.png";
import Vector92 from "../../../assests/Vector92.png";
import Vector91 from "../../../assests/Vector91.png";
import GitGitHubInitialSettings from "../../../assests/SVG_Files/Slides/GitGitHubInitialSettings.svg";
import WhatIsGit_ from "../../../assests/SVG_Files/Slides/WhatIsGit_.svg";
import WhatIsVersionControl_ from "../../../assests/SVG_Files/Slides/WhatIsVersionControl_.svg";
import CollaboratingOnGitGitHubRemoteRepository from "../../../assests/SVG_Files/Slides/CollaboratingOnGitGitHubRemoteRepository.svg";
import GitGitHubLifeCycle from "../../../assests/SVG_Files/Slides/GitGitHubLifeCycle.svg";
import GitRegularWorkflowWorkWithBranches from "../../../assests/SVG_Files/Slides/GitRegularWorkflowWorkWithBranches.svg";
import ThreeCasesToLaunchGitProject from "../../../assests/SVG_Files/Slides/ThreeCasesToLaunchGitProject.svg";
import Bookmark_blue from "../../../assests/SVG_Files/New folder/Bookmark_blue.svg";
import Bookmark_red from "../../../assests/SVG_Files/New folder/Bookmark_red.svg";
import Bookmark_green from "../../../assests/SVG_Files/New folder/Bookmark_green.svg";

const LibraryBookmarkContent = [
  {
    chapterName: "High Priority Review List",
    TagsImageOne: Bookmark_red,
    items: [
      {
        id: 1,
        image: WhatIsGit_,

        Tags: "What is Git?",
        TagsImageTwo: Vector92,
      },
      {
        id: 2,
        image: GitGitHubLifeCycle,
        Tags: "Git & GitHub Basic Life Cycle",
        TagsImageTwo: Vector92,
      },
      {
        id: 2,
        image: GitGitHubInitialSettings,
        Tags: "Git & GitHub Initial Setting Overview",
        TagsImageTwo: Vector92,
      },
      {
        id: 2,
        image: ThreeCasesToLaunchGitProject,
        Tags: "XXXX",
        disabled: true,
        TagsImageTwo: Vector92,
      },
    ],
  },

  {
    chapterName: "Review List",
    TagsImageOne: Bookmark_blue,
    items: [
      {
        id: 1,
        image: WhatIsVersionControl_,
        Tags: "What Is Version Control?",
        TagsImageTwo: Vector90,
      },
      {
        id: 2,
        image: GitRegularWorkflowWorkWithBranches,
        Tags: "Git Regular Workflow - Edit & Commit",
        TagsImageTwo: Vector90,
      },
    ],
  },

  {
    chapterName: "For Future Read",
    TagsImageOne: Bookmark_green,
    items: [
      {
        id: 1,
        image: CollaboratingOnGitGitHubRemoteRepository,
        Tags: "Collaborating On Git & GitHub -- Remote",
        TagsImageTwo: Vector91,
      },
    ],
  },
];

export default LibraryBookmarkContent;
