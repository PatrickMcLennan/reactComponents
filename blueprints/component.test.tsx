import React from "react";
import { render } from "jest";
import { ThemeProvider } from "styled-components";

import REPLACE_ME from "../REPLACE_ME";
import { JSDocCallbackTag } from "typescript";

const renderREPLACE_ME: Function = () => {
  render(
    <ThemeProvider>
      <REPLACE_ME />
    </ThemeProvider>
  );
};

test("REPLACE_ME", () => {
  expect(2 + 2).toBe(4);
});
