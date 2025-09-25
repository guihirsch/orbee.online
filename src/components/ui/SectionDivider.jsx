import React from "react";
import { Separator } from "./separator";

// Linha simples (1px) entre seções, sem margem vertical por padrão
const SectionDivider = ({ className = "my-0" }) => {
   return <Separator className={className} />;
};

export default SectionDivider;
