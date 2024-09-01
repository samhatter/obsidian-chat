import React, { useState, useEffect } from 'react';
import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, TextField, Typography} from '@mui/material';
import MessagingAPI from '../Shared/api/MessagingApi';
import ConversationDrawer from '../Components/ConversationDrawer';
import MessagingView from '../Components/MessagingView';
import { Conversation, ConversationResult, Message } from '../Shared/utils/Interfaces';

const Home: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationResult[]>([]);
  const [toggledConversationID, setToggledConversationID] = useState<string>("");
  const [toggledConversation, setToggledConversation] = useState<Conversation>();
  const [conversationDialogueOpen, setConversationDialogueOpen] = useState<boolean>(false);
  const [conversationDialogueName, setConversationDialogueName] = useState<string>("");
  const [conversationDialogueParticipants, setConversationDialogueParticipants] = useState<string>("");
  const [sendMessage, setSendMessage] = useState<string>("")
  const [name, setName] = useState<string>("")
  const messagingAPI = new MessagingAPI("/api");

  const handleUpVote = async (message:Message, conversationid:string) => {
    if (!message.upvotes?.includes(name)) {
      const response = await messagingAPI.upVote(message.messageid, conversationid);
    }
    fetchConversation();
  }

  const handleDownVote = async (message:Message, conversationid:string) => {
    if (!message.downvotes?.includes(name)) {
      const response = await messagingAPI.downVote(message.messageid, conversationid);
    }
    fetchConversation();
  }

  const handleConversationDialogueOpen = () => {
    setConversationDialogueOpen(true);
  };

  const handleConversationDialogueClose = () => {
    setConversationDialogueOpen(false);
  };

  const handleConversationDialogueSubmit = async () => {
    const response = await messagingAPI.createConversation(conversationDialogueName, conversationDialogueParticipants.split(',').map(item => item.trim()));
    fetchConversations()
  }

  const handleChangeConversation = (conversationid: string) => {
    setToggledConversationID(conversationid)
  }

  const fetchConversations = async () => {
    const response = await messagingAPI.getConversations();
    if (response.conversations == null) {
      setConversations([]);
    }
    else {
      setConversations(response.conversations);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await messagingAPI.getUser();
      setName(response.name);
    };

    fetchUser();
  }, []);

  const fetchConversation = async () => {
    if (toggledConversationID && toggledConversationID != "") {
      const response = await messagingAPI.getConversation(toggledConversationID);
      if (response.conversation.conversationid == toggledConversationID) {
        setToggledConversation(response.conversation)
      }
    }
  }

  const handleSendMessage = async () => {
    if (sendMessage != '' && toggledConversationID != '') {
      const response = await messagingAPI.sendMessage(sendMessage, toggledConversationID);
      setSendMessage('');
      fetchConversation();
    }
  }

  useEffect( () => {
    const intervalId = setInterval(fetchConversations, 5000);
    fetchConversations();
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (toggledConversationID) {
      const fetchConversationData = async () => {
        await fetchConversation();
      };
      fetchConversationData();
      const intervalId = setInterval(fetchConversationData, 2000);
      return () => clearInterval(intervalId);
    }
  }, [toggledConversationID]);


  return (
    <Box sx={{ display: 'flex', height:'97vh'}}>
      <ConversationDrawer
        conversations={conversations}
        conversationDialogueOpen={conversationDialogueOpen}
        conversationDialogueName={conversationDialogueName}
        conversationDialogueParticipants={conversationDialogueParticipants}
        handleConversationDialogueClose={handleConversationDialogueClose}
        handleConversationDialogueOpen={handleConversationDialogueOpen}
        handleConversationDialogueSubmit={handleConversationDialogueSubmit}
        handleChangeConversation={handleChangeConversation}
        setConversationDialogueName={setConversationDialogueName}
        setConversationDialogueParticipants={setConversationDialogueParticipants}
      />
      <MessagingView 
        toggledConversation={toggledConversation}
        sendMessage={sendMessage}
        setSendMessage={setSendMessage}
        handleSendMessage={handleSendMessage}
        handleUpVote={handleUpVote}
        handleDownVote={handleDownVote}
        name={name}
      />
    </Box>
  );
};

export default Home;
