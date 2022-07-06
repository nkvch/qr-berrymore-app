import { useContext } from "react";
import Context from "../../context";

const useTheme = () => {
  const { mode } = useContext(Context);

  return mode;
};

export default useTheme;
