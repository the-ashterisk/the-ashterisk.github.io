import type { ComponentType } from 'react'
import { Mail } from 'lucide-react'
import { SiYoutube, SiInstagram, SiGithub } from 'react-icons/si'

export type SocialId = 'youtube' | 'instagram' | 'github' | 'email'

// lucide-react v1 dropped brand marks (Youtube/Instagram/Github), so the three
// social brand icons come from react-icons; generic UI icons stay on lucide.
// Both render as SVG components that accept `size` and `className`.
export type IconComponent = ComponentType<{ size?: number | string; className?: string }>

export interface SocialLink {
  id: SocialId
  label: string
  href: string
  icon: IconComponent
}

export const EMAIL = 'ashterisk.official@gmail.com'

export const socialLinks: SocialLink[] = [
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@the.ashterisk', icon: SiYoutube },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/the.ashterisk', icon: SiInstagram },
  { id: 'github', label: 'GitHub', href: 'https://github.com/the-ashterisk', icon: SiGithub },
  { id: 'email', label: 'Email', href: `mailto:${EMAIL}`, icon: Mail },
]
