import React, { FunctionComponent } from "react";
import { useRepeaterFieldContext } from "./RepeaterFieldContext";

export interface RepeaterItemInterface {
  value: string;
}

const RepeaterItem: FunctionComponent<RepeaterItemInterface> = ({
  value,
  children,
}) => {
  const { removeItem } = useRepeaterFieldContext();

  return (
    <div>
      {children}
      <span>
        {value}
        <button type="button" onClick={() => removeItem(value)}>
          X
        </button>
      </span>
    </div>
  );
};

export { RepeaterItem };
