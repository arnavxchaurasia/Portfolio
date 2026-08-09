import { useEffect, useState } from "react";
import { getSection, subscribe } from "./store";

// Drop-in replacement for `import { X } from "../data/portfolio"` that stays
// live if the section is edited from the Studio.
export const useSection = (section) => {
  const [value, setValue] = useState(() => getSection(section));
  useEffect(() => subscribe(() => setValue(getSection(section))), [section]);
  return value;
};
