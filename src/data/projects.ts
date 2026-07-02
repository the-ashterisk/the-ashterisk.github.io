export interface Project {
  title: string
  description: string
  tags: string[]
  repoUrl: string
  videoUrl?: string
}

// Add a new project by appending one object here — no component changes needed.
export const projects: Project[] = [
  {
    title: 'AI Playground',
    description: 'A sandbox for experimenting with LLM agents, prompts, and tooling as I learn AI systems engineering.',
    tags: ['Python', 'LLM', 'Agents'],
    repoUrl: 'https://github.com/the-ashterisk/ai-playground',
  },
  {
    title: 'Expense Tracker',
    description: 'A personal finance tracker built to explore full-stack patterns and clean data modeling.',
    tags: ['Next.js', 'TypeScript'],
    repoUrl: 'https://github.com/the-ashterisk/expense-tracker',
  },
]
