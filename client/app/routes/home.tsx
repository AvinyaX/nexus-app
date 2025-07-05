import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/users"
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Users Management
            </h5>
            <p className="font-normal text-gray-700">
              Manage users, roles, and direct permissions assignment.
            </p>
          </Link>

          <Link
            to="/about"
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              About
            </h5>
            <p className="font-normal text-gray-700">
              Learn more about this application.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
