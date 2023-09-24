import {
  paragraphs,
} from 'react-interactive-tutorials'

export const TUTORIALS = {
  'demo': {
    key: 'demo',
    title: 'MantisXR Tutorial',
    steps: [
      {
        key: 'intro',
        announce: paragraphs`
        Thanks for stopping by. Allow us to quickly show you around. Quit anytime by pressing 'Exit Tutorial'. 

        We use cookies so we know if you've seen the tutorial before.
        `,
        announceDismiss: "Begin",
        activeWhen: [],
      },
      {
        key: 'home',
        announce: paragraphs`Clicking the home icon or 'Home' will bring you back to the home page`,
        announceDismiss: "Next",
        activeWhen: [
          {
            compare: 'checkpointComplete',
            checkpoint: 'demo_intro',
          },
        ],
      },
      {
        key: 'cart',
        announce: paragraphs`Clicking the home icon or 'Cart' is for viewing what's in your cart and checking out.`,
        announceDismiss: "Next",
        activeWhen: [
          {
            compare: 'checkpointComplete',
            checkpoint: 'demo_home',
          },
        ],
      },
      {
        key: 'tutorial',
        announce: paragraphs`Use the ? icon or 'Tutorial' to view the tutorial `,
        announceDismiss: "Next",
        activeWhen: [
          {
            compare: 'checkpointComplete',
            checkpoint: 'demo_cart',
          },
        ],
      },
      {
        key: 'complete',
        announce: paragraphs`Use the map icon or 'Floor Plan' to view a map of the room and move to different areas`,
        announceDismiss: "Next",
        activeWhen: [
          {
            compare: 'checkpointComplete',
            checkpoint: 'demo_tutorial',
          },
        ],
      },
    ],
    complete: {
      on: 'checkpointReached',
      checkpoint: 'complete',
      title: 'MantisXR Tutorial Complete!',
      message: paragraphs`
      Great work, and happy shopping!
      `,
    },
  },
};