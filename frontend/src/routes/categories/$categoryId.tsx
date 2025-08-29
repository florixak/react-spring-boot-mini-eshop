import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/$categoryId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      categoryId: params.categoryId,
    };
  },
  pendingComponent: () => <div>Loading category...</div>,
  errorComponent: () => <div>Error loading category.</div>,
});

function RouteComponent() {
  const { categoryId } = Route.useLoaderData();
  return <div>Hello "/categories/{categoryId}"!</div>;
}
