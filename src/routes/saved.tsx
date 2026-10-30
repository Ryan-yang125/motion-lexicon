import { createFileRoute } from '@tanstack/react-router'
import { SavedPage } from '@/components/SavedPage'
import { savedHead } from '@/lib/seo'

export const Route = createFileRoute('/saved')({
  head: () => savedHead('en'),
  component: SavedPage,
})
