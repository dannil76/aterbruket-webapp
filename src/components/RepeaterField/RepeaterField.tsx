import React, { FunctionComponent, useState } from "react";
import { RepeaterFieldProvider } from "./RepeaterFieldContext";
import { RepeaterItem, RepeaterItemInterface } from "./RepeaterItem";
import { RepeaterInput, RepeaterInputInterface } from "./RepeaterInput";

interface RepeaterFieldComposition {
  Input: FunctionComponent<RepeaterInputInterface>;
  Item: FunctionComponent<RepeaterItemInterface>;
}

interface RepeaterFieldProps {
  addItem: (value: string) => void;
  removeItem: (value: string) => void;
}

const RepeaterField: React.FC<RepeaterFieldProps> & RepeaterFieldComposition =
  ({ addItem, removeItem, children }) => {
    const [inputValue, setInputValue] = useState<string>("");

    return (
      <RepeaterFieldProvider
        value={{ inputValue, setInputValue, addItem, removeItem }}
      >
        {children}
      </RepeaterFieldProvider>
    );
  };

RepeaterField.Input = RepeaterInput;
RepeaterField.Item = RepeaterItem;

export { RepeaterField };
