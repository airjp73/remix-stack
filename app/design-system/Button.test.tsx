import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import { Button, ButtonLink, LoadableButton } from "./Button";

describe("Button", () => {
  it("should call onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      <Button
        label="test"
        icon={<h1>Test Icon</h1>}
        rightIcon={<h1>Test Right Icon</h1>}
        onClick={onClick}
      />
    );
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("Test Icon")).toBeInTheDocument();
    expect(screen.getByText("Test Right Icon")).toBeInTheDocument();
    await userEvent.click(screen.getByText("test"));
    expect(onClick).toBeCalledTimes(1);
  });

  it("should not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<Button label="test" onClick={onClick} disabled />);
    await userEvent.click(screen.getByText("test"));
    expect(onClick).not.toBeCalled();
  });
});

describe("ButtonLink", () => {
  it("should render as a link", async () => {
    render(
      <MemoryRouter>
        <ButtonLink
          label="test"
          to="/test"
          icon={<h1>Test Icon</h1>}
          rightIcon={<h1>Test Right Icon</h1>}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("Test Icon")).toBeInTheDocument();
    expect(screen.getByText("Test Right Icon")).toBeInTheDocument();
  });
});

describe("LoadableButton", () => {
  it("should accept clicks and not show a spinner when not loading", async () => {
    const onClick = vi.fn();
    render(
      <LoadableButton label="test" loadingLabel="Loading" onClick={onClick} />
    );

    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("test"));
    expect(onClick).toBeCalledTimes(1);
  });

  it("should show a spinner and not accept clicks when loading", async () => {
    const onClick = vi.fn();
    render(
      <LoadableButton
        label="test"
        loadingLabel="Loading"
        onClick={onClick}
        isLoading
      />
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Loading"));
    expect(onClick).not.toBeCalled();
  });
});
