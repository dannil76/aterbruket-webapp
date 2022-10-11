import { createContext, useContext } from "react";

interface ChecklistContextProps {
  checkItem: (value: string) => void;
}

const ChecklistContext = createContext<ChecklistContextProps | undefined>(
  undefined
);

export const ChecklistProvider = ChecklistContext.Provider;

export const useChecklistContext = (): ChecklistContextProps => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error("Checklist.Item must be used within a Checklist");
  }
  return context;
};
