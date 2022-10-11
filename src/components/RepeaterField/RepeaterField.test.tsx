import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "../../styles/theme";

import { RepeaterField } from "./RepeaterField";

describe("RepeaterInput", () => {
  const setup = () => {
    const placeholder = "Enter a value";
    const utils = render(
      <ThemeProvider theme={theme}>
        <RepeaterField data={[]} setData={() => {}}>
          <RepeaterField.Input placeholder={placeholder} />
        </RepeaterField>
      </ThemeProvider>
    );
    const input = utils.getByRole("textbox") as HTMLInputElement;
    const button = utils.getByRole("button");
    return {
      input,
      button,
      ...utils,
    };
  };

  test("shows inserted text", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "foobar" } });
    expect(input.value).toBe("foobar");
  });

  test("resets input field value on button click", () => {
    const { button, input } = setup();
    fireEvent.change(input, { target: { value: "foobar" } });
    fireEvent.click(button);
    expect(input.value).toBe("");
  });
});

describe("RepeaterItem", () => {
  let data = ["foo", "bar"];

  test("deletes item on button click", () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <RepeaterField
          data={data}
          setData={(items) => {
            data = items;
          }}
        >
          {data.map((item) => (
            <RepeaterField.Item key={item} value={item} />
          ))}
        </RepeaterField>
      </ThemeProvider>
    );

    const parent = screen.getByText("foo").closest("div");
    if (!parent) {
      throw new Error("Parent is null");
    }

    const button = within(parent).getByRole("button");

    fireEvent.click(button);

    rerender(
      <ThemeProvider theme={theme}>
        <RepeaterField
          data={data}
          setData={(items) => {
            data = items;
          }}
        >
          {data.map((item) => (
            <RepeaterField.Item key={item} value={item} />
          ))}
        </RepeaterField>
      </ThemeProvider>
    );

    expect(parent).not.toBeInTheDocument();
  });
});
