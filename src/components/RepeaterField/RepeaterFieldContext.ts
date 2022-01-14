import React, { createContext, useContext } from "react";

interface RepeaterFieldContextProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  addItem: (value: string) => void;
  removeItem: (value: string) => void;
}

const RepeaterFieldContext = createContext<
  RepeaterFieldContextProps | undefined
>(undefined);

export const RepeaterFieldProvider = RepeaterFieldContext.Provider;

export const useRepeaterFieldContext = (): RepeaterFieldContextProps => {
  const context = useContext(RepeaterFieldContext);
  if (!context) {
    throw new Error(
      "RepeaterField.Item & RepeaterField.SubmitButton must be used within an CheckListInput"
    );
  }
  return context;
};
