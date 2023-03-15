import { createContext, ReactNode, SetStateAction, useState } from "react";

interface ContextType {
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export const loadingContext = createContext({} as ContextType);

interface Props {
  children: ReactNode;
}

export const LoadingContextProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <loadingContext.Provider
      value={{ loading: loading, setLoading: setLoading }}
    >
      {children}
    </loadingContext.Provider>
  );
};
