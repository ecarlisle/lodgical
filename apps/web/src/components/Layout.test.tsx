import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Layout } from "./Layout";

describe("Layout", () => {
  it("renders shared footer navigation and the demo notice", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<h1>Search stays</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const footerNavigation = screen.getByRole("navigation", {
      name: "Footer navigation",
    });

    expect(footerNavigation).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse stays" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Back to top" })).toHaveAttribute(
      "href",
      "#top",
    );
    expect(
      screen.getByText("Demo experience · No real payments are processed."),
    ).toBeInTheDocument();
  });
});
