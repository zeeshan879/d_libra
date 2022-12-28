import Vector92 from "../../assests/Vector92.png";
import Vector91 from "../../assests/Vector91.png";
import WhatIsGit_ from "../../assests/SVG_Files/Slides/WhatIsGit_.svg";
import WhatIsVersionControl_ from "../../assests/SVG_Files/Slides/WhatIsVersionControl_.svg";
import CollaboratingOnGitGitHubRemoteRepository from "../../assests/SVG_Files/Slides/CollaboratingOnGitGitHubRemoteRepository.svg";
import CollaboratingOnGitGitHubBranch from "../../assests/SVG_Files/Slides/CollaboratingOnGitGitHubBranch.svg";
import GitGitHubBasicLifeCycleOverview from "../../assests/SVG_Files/Slides/GitGitHubBasicLifeCycleOverview.svg";
import ThreeCasesToLaunchGitProject from "../../assests/SVG_Files/Slides/ThreeCasesToLaunchGitProject.svg";

const libcourse = [
  {
    chapterName: "Git & GitHub Introduction",
    items: [
      {
        id: 1,
        image: WhatIsGit_,

        Tags: "What is Git?",
        TagsImageTwo: Vector92,
      },
      {
        id: 2,
        image: WhatIsVersionControl_,
        Tags: "What Is Version Control?",
        TagsImageTwo: Vector91,
      },
      {
        id: 2,
        image: CollaboratingOnGitGitHubRemoteRepository,
        Tags: "Collaborating On Git & GitHub",
        TagsImageTwo: Vector91,
      },
      {
        id: 2,
        image: CollaboratingOnGitGitHubBranch,
        Tags: "Collaborating On Git & GitHub - Branch",
        TagsImageTwo: Vector91,
      },
      {
        id: 2,
        image: GitGitHubBasicLifeCycleOverview,
        Tags: "Git & GitHub Basic Life Cycle",
        TagsImageTwo: Vector91,
      },
    ],
  },

  {
    chapterName: "Course A",

    items: [
      {
        id: 1,
        image: ThreeCasesToLaunchGitProject,
        Tags: "xxxxx",
        disabled: true,
        TagsImageTwo: Vector92,
      },
      {
        id: 2,
        image: ThreeCasesToLaunchGitProject,
        Tags: "xxxxx",
        disabled: true,
        TagsImageTwo: Vector92,
      },
    ],
  },
  {
    chapterName: "Course B",
    items: [
      {
        id: 1,
        image: ThreeCasesToLaunchGitProject,
        Tags: "xxxxx",
        disabled: true,
        TagsImageTwo: Vector92,
      },
      {
        id: 2,
        image: ThreeCasesToLaunchGitProject,
        Tags: "xxxxx",
        disabled: true,
        TagsImageTwo: Vector92,
      },
    ],
  },
];

export default libcourse;
