import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import userEvent from "@testing-library/user-event";

it("should be type=button by default", async () => {
  const click = vi.fn();
  const submit = vi.fn();
  render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Button onClick={click}>Test Button</Button>
    </form>
  );

  const button = screen.getByRole("button", { name: /test button/i });
  expect(button).toHaveAttribute("type", "button");

  await userEvent.click(button);
  expect(click).toBeCalledTimes(1);
  expect(submit).not.toBeCalled();
});

it("should allow overriding the button type", async () => {
  const click = vi.fn();
  const submit = vi.fn();
  render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Button onClick={click} type="submit">
        Test Button
      </Button>
    </form>
  );

  const button = screen.getByRole("button", { name: /test button/i });
  expect(button).toHaveAttribute("type", "submit");

  await userEvent.click(button);
  expect(click).toBeCalledTimes(1);
  expect(submit).toBeCalledTimes(1);
});
