import React, { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { Loader } from "lucide-react";

const ChatContainer = () => {
  const { getMessages, selectedUser, messages, isMessagesLoading } =
    useChatStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="">
      <ChatHeader />
    </div>
  );
};

export default ChatContainer;
