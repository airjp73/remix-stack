import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect } from "vitest";
import { RadioGroup } from "./RadioGroup";

describe("RadioGroup", () => {
  it("should correctly serialize selected value", () => {
    render(
      <form data-testid="test-form">
        <RadioGroup name="testRadioGroup" srOnlyLabel="test" value="hello">
          <RadioGroup.Option value="hello" label="Hello" />
          <RadioGroup.Option value="goodbye" label="Goodbye" />
        </RadioGroup>
      </form>
    );

    const data = new FormData(screen.getByTestId("test-form"));
    expect(data.get("testRadioGroup")).toBe("hello");
    expect(screen.getByLabelText("Hello")).toBeChecked();
    expect(screen.getByLabelText("Goodbye")).not.toBeChecked();
  });

  it("should manage its own internal value", async () => {
    render(
      <form data-testid="test-form">
        <RadioGroup
          name="testRadioGroup"
          srOnlyLabel="test"
          defaultValue="hello"
        >
          <RadioGroup.Option value="hello" label="Hello" />
          <RadioGroup.Option value="goodbye" label="Goodbye" />
        </RadioGroup>
      </form>
    );

    const getData = () => new FormData(screen.getByTestId("test-form"));

    expect(getData().get("testRadioGroup")).toBe("hello");
    expect(screen.getByLabelText("Hello")).toBeChecked();
    expect(screen.getByLabelText("Goodbye")).not.toBeChecked();

    await userEvent.click(screen.getByLabelText("Goodbye"));
    expect(getData().get("testRadioGroup")).toBe("goodbye");
    expect(screen.getByLabelText("Hello")).not.toBeChecked();
    expect(screen.getByLabelText("Goodbye")).toBeChecked();

    await userEvent.click(screen.getByLabelText("Hello"));
    expect(getData().get("testRadioGroup")).toBe("hello");
    expect(screen.getByLabelText("Hello")).toBeChecked();
    expect(screen.getByLabelText("Goodbye")).not.toBeChecked();
  });

  it("should be controlable", async () => {
    const UseState = ({ children }: any) => {
      const [state, setState] = useState("hello");
      return children([state, setState]);
    };

    render(
      <form data-testid="test-form">
        <UseState>
          {([value, setValue]) => (
            <RadioGroup
              name="testRadioGroup"
              srOnlyLabel="test"
              value={value}
              onChange={setValue}
            >
              <p>Value is: {value}</p>
              <RadioGroup.Option value="hello" label="Hello" />
              <RadioGroup.Option value="goodbye" label="Goodbye" />
            </RadioGroup>
          )}
        </UseState>
      </form>
    );

    const getData = () => new FormData(screen.getByTestId("test-form"));

    expect(getData().get("testRadioGroup")).toBe("hello");
    expect(screen.getByText("Value is: hello")).toBeInTheDocument();
    expect(screen.getByLabelText("Hello")).toBeChecked();
    expect(screen.getByLabelText("Goodbye")).not.toBeChecked();

    await userEvent.click(screen.getByLabelText("Goodbye"));
    expect(screen.getByText("Value is: goodbye")).toBeInTheDocument();
    expect(getData().get("testRadioGroup")).toBe("goodbye");
    expect(screen.getByLabelText("Hello")).not.toBeChecked();
    expect(screen.getByLabelText("Goodbye")).toBeChecked();

    await userEvent.click(screen.getByLabelText("Hello"));
    expect(screen.getByText("Value is: hello")).toBeInTheDocument();
    expect(getData().get("testRadioGroup")).toBe("hello");
    expect(screen.getByLabelText("Hello")).toBeChecked();
    expect(screen.getByLabelText("Goodbye")).not.toBeChecked();
  });
});
