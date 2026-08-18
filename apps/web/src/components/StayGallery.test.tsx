import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StayGallery } from "./StayGallery";

const images = [
  "https://example.com/one.jpg",
  "https://example.com/two.jpg",
  "https://example.com/three.jpg",
];

describe("StayGallery", () => {
  it("supports keyboard navigation, Escape close, and focus return", async () => {
    const user = userEvent.setup();
    render(<StayGallery images={images} stayTitle="Seaside Cottage" />);

    const secondPhoto = screen.getByRole("button", {
      name: "Open photo 2 of 3",
    });
    await user.click(secondPhoto);

    expect(
      screen.getByRole("dialog", { name: "Seaside Cottage photo gallery" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close photo gallery" }),
    ).toHaveFocus();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByRole("img", { name: "Seaside Cottage, photo 3 of 3" }),
    ).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(
      screen.getByRole("img", { name: "Seaside Cottage, photo 2 of 3" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(secondPhoto).toHaveFocus();
  });

  it("opens the complete gallery from the view-all control", async () => {
    const user = userEvent.setup();
    render(<StayGallery images={images} stayTitle="Seaside Cottage" />);

    await user.click(screen.getByRole("button", { name: /View all photos/ }));

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Seaside Cottage, photo 1 of 3" }),
    ).toBeInTheDocument();
  });
});
