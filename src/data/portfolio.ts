export interface ProjectItem {
  id: string;
  title: string;
  category: 'Web Development';
  description: string;
  liveUrl: string;
  repoUrl: string | null;
  techStack: string[] | null;
}

export interface PortfolioProfile {
  name: string;
  role: string;
  yearsExperience: number;
  mathNote: string;
  email: string | null;
  github: string | null;
  location: string | null;
  focus: string | null;
  availability: string | null;
  projects: ProjectItem[];
}

export const portfolioProfile: PortfolioProfile = {
  name: 'Rachid Asbai',
  role: 'Tech Hobbyist',
  yearsExperience: 4,
  mathNote:
    'I am fascinated by mathematics — drawn to the beauty of equations, patterns, and abstract logic, and how mathematical thinking brings clarity to software and technology.',
  email: 'asbaairashid@gmail.com',
  github: 'https://github.com/hit6827-svg',
  location: null,
  focus: null,
  availability: null,
  projects: [
    {
      id: 'mathquest',
      title: 'MathQuest',
      category: 'Web Development',
      description: 'An advanced challenging math app.',
      liveUrl: 'https://mq-yt3m.vercel.app/',
      repoUrl: null,
      techStack: null,
    },
  ],
};
