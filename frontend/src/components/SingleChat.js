import React, { useEffect, useState } from "react";
import { useChatState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { useHistory } from "react-router-dom";
import TaskManagerAdmin from "./Tasks/TaskManagerAdmin";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isRinging, setIsRinging] = useState(false); // For showing ringing notification
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = useChatState();
  const toast = useToast();
  const history = useHistory();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // Ring event when call is initiated
    socket.on("ring", () => {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 30000); // Ring timeout 30s
    });

    socket.on("join call", () => setIsInCall(true));
    socket.on("call end", () => setIsInCall(false));
  }, []);
  const handleCallToggle = () => {
    if (!isInCall) {
      const videoCallUrl = `/video-call/${selectedChat._id}`;
      window.open(videoCallUrl, "_blank"); // Open video call in a new tab
    }
    setIsInCall(!isInCall);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // console.log(notifications,"--------------");

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //Typing indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
    }
    socket.emit("typing", selectedChat._id);
    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };
  const handlePhaseSubmit = async (phase) => {
    // Backend call to save new phase
  }
  const handleTaskSubmit = async (task, phaseName) => {
    // Backend call to save new task within a phase
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            <Button
              onClick={handleCallToggle}
              ml={4}
              colorScheme={isInCall ? "red" : "blue"}
            >
              {isInCall ? <CloseIcon boxSize={6} /> : <PhoneIcon boxSize={6} />}
            </Button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Tabs width={"100%"} h={"80%"} colorScheme="blue">
            <TabList>
              <Tab>Chats</Tab>
              <Tab>Files</Tab>
              <Tab>Tasks</Tab>
            </TabList>
            <TabPanels h={"100%"}>
              <TabPanel height={"100%"}>
                <Box
                  display={"flex"}
                  flexDir={"column"}
                  justifyContent={"flex-end"}
                  p={3}
                  bg={"#E8E8E8"}
                  w={"100%"}
                  h={"90%"}
                  borderRadius={"lg"}
                  overflowY={"auto"}
                >
                  {loading ? (
                    <Spinner
                      size={"xl"}
                      w={20}
                      h={20}
                      alignSelf={"center"}
                      margin={"auto"}
                    />
                  ) : (
                    <div>
                      <ScrollableChat messages={messages} />
                    </div>
                  )}
                </Box>
                <Box>
                  <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    {isTyping ? (
                      <div>
                        <Lottie
                          options={defaultOptions}
                          width={70}
                          style={{ marginBottom: 15, marginLeft: 0 }}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    <Input
                      variant={"filled"}
                      bg={"#E0E0E0"}
                      placeholder="Enter a message.."
                      onChange={typingHandler}
                      value={newMessage}
                    />
                  </FormControl>
                </Box>
              </TabPanel>
              <TabPanel>Files</TabPanel>
              <TabPanel>
                {(selectedChat.users.length === 2 ||
                user._id === selectedChat.groupAdmin._id )? (
                  <TaskManagerAdmin
                    selectedChat={selectedChat}
                    handlePhaseSubmit={handlePhaseSubmit}
                    handleTaskSubmit={handleTaskSubmit}
                  />
                ) : (
                  // Add components or logic to display all tasks for the admin user
                  <Text>Displaying tasks assigned to you</Text>
                  // Add components or logic to display only tasks assigned to the user
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
