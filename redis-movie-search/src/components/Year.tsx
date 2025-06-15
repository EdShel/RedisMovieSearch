import React from "react";
import getYearsRange from "@/lib/redis/queries/getYearsRange";
import YearsFilter from "./YearsFilter";

const Years: React.FC<object> = async () => {
  const yearsRange = await getYearsRange();

  return <YearsFilter yearsRange={yearsRange} />;
};

export default Years;
