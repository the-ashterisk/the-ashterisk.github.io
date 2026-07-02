import { PlayCircle, Camera, Code, Mail, type LucideIcon } from 'lucide-react'

export type SocialId = 'youtube' | 'instagram' | 'github' | 'email'

export interface SocialLink {
  id: SocialId
  label: string
  href: string
  icon: LucideIcon
}

export const EMAIL = 'ashterisk.official@gmail.com'

export const socialLinks: SocialLink[] = [
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@the.ashterisk', icon: PlayCircle },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/the.ashterisk', icon: Camera },
  { id: 'github', label: 'GitHub', href: 'https://github.com/the-ashterisk', icon: Code },
  { id: 'email', label: 'Email', href: `mailto:${EMAIL}`, icon: Mail },
]
