// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://docs.mrover.org',
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
  },
  integrations: [
    starlight({
      plugins: [starlightLinksValidator()],
      expressiveCode: {
        frames: false,
      },
      title: 'MRover Docs',
      favicon: '/favicon.ico',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/umrover/mrover-ros2' },
      ],
      editLink: {
        baseUrl: 'https://github.com/umrover/mrover-docs/edit/main/',
      },
      customCss: [
        './src/styles/custom.css',
      ],
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
      },
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
            crossorigin: 'anonymous',
          },
        },
      ],
      sidebar: [
        // SIDEBAR_ITEMS_START
        { label: 'MRover Software Introduction', slug: 'introduction' },
        {
          label: 'General Resources',
          collapsed: true,
          items: [
            { label: 'Best Practices', slug: 'general-resources/best-practices' },
            { label: 'Git', slug: 'general-resources/git' },
            { label: 'I Hate Webdev, How Do I Add a Page', slug: 'general-resources/contributing-to-the-wiki' },
            { label: 'IDE Configuration', slug: 'general-resources/ide-configuration' },
            {
              label: 'ROS & Environment',
              collapsed: true,
              items: [
                { label: '1. Introduction to ROS', slug: 'general-resources/ros/intro-to-ros' },
                { label: '2. Install ROS', slug: 'general-resources/ros/install-ros/install-ros' },
                { label: '3. Fundamentals of ROS', slug: 'general-resources/ros/fundamentals-of-ros' },
                { label: 'Install ROS on macOS', slug: 'general-resources/ros/install-ros/install-ros-macos' },
                { label: 'ROS Tools: rqt_bag', slug: 'general-resources/ros/ros-tools-rqt-bag' },
                { label: 'Setting up the Jetson', slug: 'general-resources/setting-up-the-jetson' },
              ]
            },
            {
              label: 'VM Setup',
              collapsed: true,
              items: [
                { label: 'macOS VM Setup', slug: 'general-resources/vm/macos-vm-setup' },
                { label: 'USB Passthrough for UTM', slug: 'general-resources/vm/usb-passthrough-utm' },
              ]
            },
            {
              label: 'Dev-Ops',
              collapsed: true,
              items: [
                { label: 'Updating CI', slug: 'general-resources/devops/updating-ci' },
                { label: 'URC vs. CIRC Switch', slug: 'general-resources/devops/urc-vs-circ-switch' },
              ]
            }
          ]
        },
        // ESW_SIDEBAR_START
        // ESW_SIDEBAR_END
        {
          label: 'Teleop',
          collapsed: true,
          items: [{
              label: 'Getting Started',
              collapsed: true,
              items: [
                { label: 'Teleop Overview', slug: 'teleop/overview' },
                { label: 'Teleop Quickstart', slug: 'teleop/quickstart' },
                { label: 'Teleop Starter Project', slug: 'teleop/starter-project' }
            ]},
            {
              label: 'Guides',
              collapsed: true,
              items: [
                { label: 'Vue Introduction', slug: 'teleop/vue-introduction' },
                { label: 'Sample Vue Component', slug: 'teleop/sample-vue-component' },
                { label: 'Tailwind Introduction', slug: 'teleop/tailwind-introduction' },
                { label: 'Websockets Introduction', slug: 'teleop/websockets-introduction'},
                { label: 'SQLite Introduction', slug: 'teleop/sqlite-introduction'}
              ]
            },
            {
              label: 'Teleop Organization and Tools',
              collapsed: true,
              items: [
                { label: 'Teleop Codebase Organization', slug: 'teleop/organization' },
                { label: 'GUI Style Checking', slug: 'teleop/gui-style-checking' },
                { label: 'Camera Client', slug: 'teleop/camera-client' },
                { label: 'Downloading Offline Map', slug: 'teleop/downloading-offline-map' },
                { label: 'WebSocket Handlers Lookup', slug: 'teleop/consumers-lookup' }
              ]
            },
            { label: 'Teleop Projects', slug: 'teleop/projects' },
            { label: 'Feature Request', slug: 'teleop/feature-request' },
            { label: 'Teleop FAQ', slug: 'teleop/faq' }
          ]
        },
        {
          label: 'Autonomy',
          collapsed: true,
          items: [
            { label: 'Autonomy Overview', slug: 'autonomy/overview' },
            { label: 'Autonomy Quickstart', slug: 'autonomy/quickstart' },
            {
              label: 'Autonomy Starter Project',
              collapsed: true,
              items: [
                { label: 'Overview', slug: 'autonomy/starter-project/overview' },
                { label: 'Localization', slug: 'autonomy/starter-project/localization' },
                { label: 'Perception', slug: 'autonomy/starter-project/perception' },
                { label: 'Navigation', slug: 'autonomy/starter-project/navigation' },
                { label: 'Testing & Completion', slug: 'autonomy/starter-project/testing' }
              ]
            },
            {
              label: 'Localization',
              collapsed: true,
              items: [
                { label: 'Localization', slug: 'autonomy/localization/overview' },
                { label: 'Dual Antenna RTK', slug: 'autonomy/localization/dual-antenna-rtk' },
                { label: 'How to Calibrate the IMU', slug: 'autonomy/localization/imu-calibration' },
                { label: 'In Search of Globally Accurate Orientation', slug: 'autonomy/localization/globally-accurate-orientation' },
                { label: 'Invariant EKF', slug: 'autonomy/localization/invariant-ekf' },
                { label: 'Localization Data Caching State Machine', slug: 'autonomy/localization/data-caching-state-machine' }
              ]
            },
            {
              label: 'Navigation',
              collapsed: true,
              items: [
                { label: 'Navigation', slug: 'autonomy/navigation/overview' },
                { label: '5-DOF IK', slug: 'autonomy/navigation/5dof-ik' },
                { label: 'Adaptive Pure Pursuit', slug: 'autonomy/navigation/adaptive-pure-pursuit' },
                { label: 'Approach Object State', slug: 'autonomy/navigation/approach-object-state' },
                { label: 'Approach Target Base State', slug: 'autonomy/navigation/approach-target-base-state' },
                { label: 'Arm IK', slug: 'autonomy/navigation/arm-ik' },
                { label: 'Arm IK Testing Visualization', slug: 'autonomy/navigation/arm-ik-testing' },
                { label: 'Arm Velocity Control', slug: 'autonomy/navigation/arm-velocity-control' },
                { label: 'Click IK', slug: 'autonomy/navigation/click-ik' },
                { label: 'Cost Map', slug: 'autonomy/navigation/cost-map' },
                { label: 'Costmap Path Planning', slug: 'autonomy/navigation/costmap-path-planning' },
                { label: 'Inward Spiraling', slug: 'autonomy/navigation/inward-spiraling' },
                { label: 'Lander Auto Align', slug: 'autonomy/navigation/lander-auto-align' },
                { label: 'Navigation State Machine Library', slug: 'autonomy/navigation/state-machine-library' },
                { label: 'Obstacle Avoidance', slug: 'autonomy/navigation/obstacle-avoidance' },
                { label: 'Path Execution', slug: 'autonomy/navigation/path-execution' },
                { label: 'Path Smoothing', slug: 'autonomy/navigation/path-smoothing' },
                { label: 'Pure Pursuit', slug: 'autonomy/navigation/pure-pursuit' },
                { label: 'Second Camera Navigation Integration (LongRangeState)', slug: 'autonomy/navigation/second-camera-integration' },
                { label: 'Stuck Detector', slug: 'autonomy/navigation/stuck-detector' },
                { label: 'Surface Normals Costmap', slug: 'autonomy/navigation/surface-normals-costmap' }
              ]
            },
            {
              label: 'Perception',
              collapsed: true,
              items: [
                { label: 'Perception', slug: 'autonomy/perception/overview' },
                { label: 'Key Detection', slug: 'autonomy/perception/key-detection' },
                { label: 'Light Detector', slug: 'autonomy/perception/light-detector' },
                { label: 'Long Range Tag Detection', slug: 'autonomy/perception/long-range-tag-detection' },
                { label: 'Object Detection', slug: 'autonomy/perception/object-detection' },
                { label: 'Object Detector Model', slug: 'autonomy/perception/object-detector-model' }
              ]
            },
            {
              label: 'Resources',
              collapsed: true,
              items: [
                { label: '3D Poses, Transforms, and Rotations', slug: 'autonomy/resources/3d-poses-transforms-rotations' },
                { label: 'Vectorization', slug: 'autonomy/resources/vectorization' }
              ]
            }
          ]
        },
        {
          label: 'Drone',
          collapsed: true,
          items: [
            { label: 'Drone Overview', slug: 'drone/overview' },
            { label: '900x Radio', slug: 'drone/900x-radio' },
            { label: 'Docker Setup (Experimental)', slug: 'drone/docker' },
            { label: 'Flying the Drone', slug: 'drone/flying' },
            { label: 'Full Development Bringup', slug: 'drone/development-bringup' },
            { label: 'macOS Ubuntu VM', slug: 'drone/macos-vm' },
            { label: 'Multi-Machine ROS2 Networking', slug: 'drone/networking' },
            { label: 'NIX Video Capture Card', slug: 'drone/nix-capture-card' },
            { label: 'Resources', slug: 'drone/resources' },
            { label: 'Software Install', slug: 'drone/software-install' },
            { label: 'Software Starter Project 2025-26', slug: 'drone/starter-project' },
            { label: 'System Architecture', slug: 'drone/system-architecture' }
          ]
        },
        {
          label: 'Archive',
          collapsed: true,
          items: [
            { label: '2024 Projects', slug: 'archive/projects/2024-projects' },
            { label: '2025-2026 Projects', slug: 'archive/projects/2025-2026-projects' }
          ]
        },
        // SIDEBAR_ITEMS_END
      ],
    }),
  ],
});
