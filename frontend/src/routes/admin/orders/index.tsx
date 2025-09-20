import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/orders/"!</div>
}
