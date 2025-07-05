import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Page" },
    { name: "description", content: "Welcome to About React Router!" },
  ];
}

export default function About() {
  return (
    <>
      <h1>Welcome to About Page</h1>
      <Link to={"/"}>Home</Link>
    </>
  );
}
