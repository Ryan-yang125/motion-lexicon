// The text a visitor pastes into their own agent. Agent-facing text is always English.
// The agent installs the skill by following the repo README, which owns the install steps.
import type { Term } from './terms'
import { GITHUB_URL } from '@/site'

export function copyText(t: Term) {
  return `Install the Motionboard skill from ${GITHUB_URL}, then use it to make the "${t.en}" shot for my product.`
}
