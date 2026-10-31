import { createFileRoute } from '@tanstack/react-router'
import { RecipePage } from '@/components/recipe/RecipePage'
import { loadRecipe, recipeHead } from '@/lib/seo'

export const Route = createFileRoute('/recipes/$slug')({
  loader: loadRecipe('en'),
  head: ({ loaderData }) => (loaderData ? recipeHead('en', loaderData.term) : {}),
  component: RecipeRoute,
})

function RecipeRoute() {
  const { term, text } = Route.useLoaderData()
  return <RecipePage key={term.slug} term={term} text={text} />
}
