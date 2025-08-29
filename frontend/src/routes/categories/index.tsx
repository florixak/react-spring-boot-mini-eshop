import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/")({
  component: Categories,
  loader: async () => {
    return {
      categories: [],
    };
  },
});

function Categories() {
  const { categories } = Route.useLoaderData();
  return (
    <div>
      {categories.map((category) => (
        <li key={category}>
          <Link to="/categories/$categoryId" params={{ categoryId: category }}>
            {category}
          </Link>
        </li>
      ))}
    </div>
  );
}
