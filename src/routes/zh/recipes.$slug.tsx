import { createFileRoute } from '@tanstack/react-router'
import { RecipePage } from '@/components/recipe/RecipePage'
import { loadTerm, recipeHead } from '@/lib/seo'

export const Route = createFileRoute('/zh/recipes/$slug')({
  loader: loadTerm,
  head: ({ loaderData: t }) => (t ? recipeHead('zh', t) : {}),
  component: RecipeRoute,
})

function RecipeRoute() {
  const term = Route.useLoaderData()
  return <RecipePage key={term.slug} term={term} />
}
