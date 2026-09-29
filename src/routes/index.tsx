import { createFileRoute, redirect } from "@tanstack/react-router";

// Temporary: the real home page lives in the user's main site; send visitors to the contact page.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/contact" });
  },
});
