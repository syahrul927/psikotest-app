"use client";
import type { RouterOutputs } from "@/trpc/react";
import { useEffect, useState } from "react";
import _ from "underscore";

type TemplateType = RouterOutputs["kraepelinTest"]["getTemplate"];
export const useDisplay = () => {
  const [template, setTemplate] = useState<_.Dictionary<TemplateType>>({});
  const [indexColumn, setIndexColumn] = useState(1);
  const [currentColumn, setCurrentColumn] = useState<TemplateType>([]);

  const setArray = (value: TemplateType) => {
    const temp = _.groupBy(value, "x");
    setTemplate(temp);
  };
  useEffect(() => {
    if (template) {
      const temp = template[indexColumn];
      if (temp) {
        setCurrentColumn(temp);
      }
    }
  }, [template, indexColumn]);

  const nextColumn = () => {
    setIndexColumn(indexColumn + 1);
  };

  const forwardColumn = (index: number) => {
    setIndexColumn(index);
  };
  return {
    setArray,
    currentColumn,
    nextColumn,
    indexColumn,
    forwardColumn,
    totalColumn: Object.keys(template).length,
  };
};
