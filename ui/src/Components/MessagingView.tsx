import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, TextField, Typography } from '@mui/material';
import MessageBox from './MessageBox';
import ConversationHeader from './ConversationHeader';
import ComposeMessage from './ComposeMessage';
import { Conversation, Message } from '../Shared/utils/Interfaces';

interface MessagingViewProps {
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
    toggledConversation,
    sendMessage,
    setSendMessage,
    handleSendMessage,
    handleUpVote,
    handleDownVote,
    name
  } = props;

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'auto', padding:0, margin:0}}>
        <ConversationHeader toggledConversation={toggledConversation}/>
        <Box sx={{ display: 'flex', flexDirection: 'column-reverse', flexGrow: 1, overflowY: 'auto', padding: 2, backgroundColor: '#eef' }}>
          {toggledConversation?.messages.map((message, index) => (<MessageBox index={index} message={message} name={name} conversationid={toggledConversation.conversationid} handleUpVote={handleUpVote} handleDownVote={handleDownVote}/>))}
        </Box>
        <ComposeMessage sendMessage={sendMessage} setSendMessage={setSendMessage} handleSendMessage={handleSendMessage}/>
      </Box>
  );
};

export default MessagingView;
