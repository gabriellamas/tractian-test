import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { createContext, ReactNode } from "react";

interface ContextType {
  messageApi: MessageInstance;
  contextHolder: React.ReactElement;
}

export const loadingContext = createContext({} as ContextType);

interface Props {
  children: ReactNode;
}

export const LoadingContextProvider = ({ children }: Props) => {
  //const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <loadingContext.Provider
      value={{ messageApi: messageApi, contextHolder: contextHolder }}
    >
      {contextHolder}
      {children}
    </loadingContext.Provider>
  );
};
