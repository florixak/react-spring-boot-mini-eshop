import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/products/new/"!</div>
}
