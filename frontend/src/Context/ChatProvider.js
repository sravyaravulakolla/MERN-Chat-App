import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

   useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser(parsedUserInfo);
      } catch (error) {
        console.error("Failed to parse user info from localStorage", error);
        setUser(null);
        history.push("/");
      }
    } else {
      setUser(null);
      history.push("/");
    }
  }, [history]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
