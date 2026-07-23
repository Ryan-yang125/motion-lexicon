import type { Category } from "./types";

export const categories: Category[] = [
  {
    id: "entrances",
    order: 1,
    plannedCount: 6,
    name: {
      zh: "入场与退场",
      en: "Entrances & exits"
    },
    eyebrow: {
      zh: "Fade, slide, reveal",
      en: "Fade, slide, reveal"
    },
    description: {
      zh: "元素出现、离开和被揭示时的基础动效语言。",
      en: "Foundational motion language for elements appearing, leaving, and being revealed."
    }
  },
  {
    id: "sequencing",
    order: 2,
    plannedCount: 8,
    name: {
      zh: "编排与时间",
      en: "Sequencing & timing"
    },
    eyebrow: {
      zh: "Stagger, delay, keyframes",
      en: "Stagger, delay, keyframes"
    },
    description: {
      zh: "组织多个元素、多个时刻和时间节奏的动效词汇。",
      en: "Vocabulary for organizing multiple elements, moments, and timing relationships."
    }
  },
  {
    id: "transforms",
    order: 3,
    plannedCount: 8,
    name: {
      zh: "位移与变换",
      en: "Movement & transforms"
    },
    eyebrow: {
      zh: "Translate, scale, rotate",
      en: "Translate, scale, rotate"
    },
    description: {
      zh: "改变位置、尺寸、角度、透视和变换原点的词汇。",
      en: "Terms for changing position, size, angle, perspective, and transform origin."
    }
  },
  {
    id: "state-transitions",
    order: 4,
    plannedCount: 7,
    name: {
      zh: "状态过渡",
      en: "State transitions"
    },
    eyebrow: {
      zh: "Morph, layout, continuity",
      en: "Morph, layout, continuity"
    },
    description: {
      zh: "连接状态、视图和元素身份的过渡词汇。",
      en: "Terms for connecting states, views, and element identity."
    }
  },
  {
    id: "scroll",
    order: 5,
    plannedCount: 5,
    name: {
      zh: "滚动动效",
      en: "Scroll motion"
    },
    eyebrow: {
      zh: "Reveal, parallax, view transition",
      en: "Reveal, parallax, view transition"
    },
    description: {
      zh: "与滚动位置、视口进入和页面导航相关的动效词汇。",
      en: "Terms tied to scroll position, viewport entry, and page navigation."
    }
  },
  {
    id: "feedback",
    order: 6,
    plannedCount: 9,
    name: {
      zh: "反馈与交互",
      en: "Feedback & interaction"
    },
    eyebrow: {
      zh: "Press, drag, swipe",
      en: "Press, drag, swipe"
    },
    description: {
      zh: "响应点击、触摸、拖拽和错误状态的动效词汇。",
      en: "Terms for responding to press, touch, drag, and error states."
    }
  },
  {
    id: "easing",
    order: 7,
    plannedCount: 7,
    name: {
      zh: "缓动",
      en: "Easing"
    },
    eyebrow: {
      zh: "Ease-out, bezier, linear",
      en: "Ease-out, bezier, linear"
    },
    description: {
      zh: "描述速度如何加速、减速和保持节奏的词汇。",
      en: "Terms that describe how speed accelerates, decelerates, and holds rhythm."
    }
  },
  {
    id: "springs",
    order: 8,
    plannedCount: 9,
    name: {
      zh: "弹簧动效",
      en: "Spring animations"
    },
    eyebrow: {
      zh: "Mass, damping, velocity",
      en: "Mass, damping, velocity"
    },
    description: {
      zh: "用质量、阻尼、速度和弹性描述物理式动效的词汇。",
      en: "Terms for physics-based motion with mass, damping, velocity, and bounce."
    }
  },
  {
    id: "loops",
    order: 9,
    plannedCount: 7,
    name: {
      zh: "循环与环境动效",
      en: "Looping & ambient motion"
    },
    eyebrow: {
      zh: "Loop, pulse, marquee",
      en: "Loop, pulse, marquee"
    },
    description: {
      zh: "自动运行、循环播放和营造轻微生命感的动效词汇。",
      en: "Terms for autonomous, looping, and ambient motion."
    }
  },
  {
    id: "polish-effects",
    order: 10,
    plannedCount: 10,
    name: {
      zh: "润色与效果",
      en: "Polish & effects"
    },
    eyebrow: {
      zh: "Mask, shimmer, ticker",
      en: "Mask, shimmer, ticker"
    },
    description: {
      zh: "让界面更精致、信息变化更清楚的小型效果词汇。",
      en: "Terms for small effects that make interfaces clearer and more polished."
    }
  },
  {
    id: "performance",
    order: 11,
    plannedCount: 6,
    name: {
      zh: "性能",
      en: "Performance"
    },
    eyebrow: {
      zh: "FPS, compositing, will-change",
      en: "FPS, compositing, will-change"
    },
    description: {
      zh: "判断动效是否流畅、是否会卡顿和如何优化渲染的词汇。",
      en: "Terms for judging smoothness, jank, and rendering performance."
    }
  },
  {
    id: "principles",
    order: 12,
    plannedCount: 9,
    name: {
      zh: "原则",
      en: "Principles"
    },
    eyebrow: {
      zh: "Purpose, frequency, reduced motion",
      en: "Purpose, frequency, reduced motion"
    },
    description: {
      zh: "决定什么时候该动、该怎么动和如何保护用户体验的原则。",
      en: "Principles for deciding when to animate, how to animate, and how to protect users."
    }
  }
];

export function getCategory(categoryId: string) {
  return categories.find((category) => category.id === categoryId);
}
