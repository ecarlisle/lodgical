import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchStays } from "../api/stays";
import { SearchPage } from "./SearchPage";

vi.mock("../api/stays", () => ({
  fetchStays: vi.fn(),
}));

function BackButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Back</button>;
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.mocked(fetchStays).mockResolvedValue([]);
  });

  it("synchronizes the form and results query with browser navigation", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={["/?location=Lisbon", "/?location=Berlin"]}
          initialIndex={1}
        >
          <BackButton />
          <SearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("Where")).toHaveValue("Berlin");

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByLabelText("Where")).toHaveValue("Lisbon");
    await waitFor(() =>
      expect(fetchStays).toHaveBeenLastCalledWith({ location: "Lisbon" }),
    );
  });

  it("shows a loading state while stays are being fetched", () => {
    vi.mocked(fetchStays).mockReturnValue(new Promise(() => undefined));

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Loading stays…")).toBeInTheDocument();
  });

  it("shows an empty state when no stays match", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("No stays match your search."),
    ).toBeInTheDocument();
  });

  it("shows an error state when stays cannot be loaded", async () => {
    vi.mocked(fetchStays).mockRejectedValue(new Error("API unavailable"));

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText(
        "Something went wrong loading stays. Please try again.",
      ),
    ).toBeInTheDocument();
  });
});
