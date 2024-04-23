"use client";

import { Size, Style, styleMap } from "../types/Types";

export type DescriptionCardProps = {
  value?: string;
  prettyLoad?: boolean;
  style?: Style;
  size?: Size;
  showDescriptor?: boolean;
};

export const DescriptionCard = ({
  value,
  prettyLoad = false,
  style = "rounded",
  size = "base",

  showDescriptor,
}: DescriptionCardProps) => {
  const sizeMap = {
    base: "max-w-3xl",
  };

  const component = <p className={`text-2xl text-center`}>{value}</p>;

  let output;

  if (prettyLoad) {
    output = value ? component : <p>Loading...</p>;
  } else {
    output = component;
  }

  return (
    <div className={`m-2 bg-base-200 ${styleMap[style]} p-2 ${sizeMap[size]}`}>
      {showDescriptor ? <p className="text-center">Description</p> : <></>}
      {output}
    </div>
  );
};