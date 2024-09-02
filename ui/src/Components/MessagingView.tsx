import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, TextField, Typography } from '@mui/material';
import MessageBox from './MessageBox';
import ConversationHeader from './ConversationHeader';
import ComposeMessage from './ComposeMessage';
import { Conversation, Message } from '../Shared/utils/Interfaces';
import { FireTruck } from '@mui/icons-material';

interface MessagingViewProps {
  toggledConversationID: string
  toggledConversation: Conversation | undefined;
  sendMessage: string;
  setSendMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleUpVote: (message: Message, conversationid: string) => void;
  handleDownVote: (message: Message, conversationid: string) => void;
  name: string
}

const MessagingView: React.FC<MessagingViewProps> = (props) => {
  const {
    toggledConversationID,
    toggledConversation,
    sendMessage,
    setSendMessage,
    handleSendMessage,
    handleUpVote,
    handleDownVote,
    name,
  } = props;

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [firstView, setFirstView] = useState(true)
  
  useEffect(() => {
    const handleScroll = () => {
      if (messageContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
        const atBottom = scrollHeight - scrollTop <= clientHeight;

        setIsAtBottom(atBottom);
      }
    };

    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
      if (isAtBottom) {
        messageContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
        setIsAtBottom(true)
      }
      if (firstView) {
        messageContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'auto' });
        setIsAtBottom(true)
        setFirstView(false)
      }
    }
  }, [toggledConversation?.messages]);

  useEffect(() => {
    setFirstView(true)
  }, [toggledConversationID]);
  
  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'auto', padding:0, margin: 0, backgroundColor: '#0B0C10'}}>
        <ConversationHeader toggledConversation={toggledConversation}/>
          <Box  ref={messageContainerRef} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto', padding: 2, margin: 1, backgroundColor: '#eef', borderRadius:'10px'}}>
            {toggledConversation?.messages.map((message) => (<MessageBox key={message.messageid} message={message} name={name} conversationid={toggledConversation.conversationid} handleUpVote={handleUpVote} handleDownVote={handleDownVote}/>))}
          </Box>
        <ComposeMessage sendMessage={sendMessage} setSendMessage={setSendMessage} handleSendMessage={handleSendMessage}/>
      </Box>
  );
};

export default MessagingView;
