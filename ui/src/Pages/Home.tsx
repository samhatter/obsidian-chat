import React, { useState, useEffect } from 'react';
import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemButton, ListItemText, TextField, Typography} from '@mui/material';
import MessagingAPI from '../Shared/api/MessagingApi';

interface ConversationResult {
  conversationid: string;
  name: string;
}

interface Message {
	time: Date;
	sender: string;
	message: string; 
	messageid: string; 
	likes: string[]; 
}

interface Conversation {
	name: string;
	participants: string[]; 
	conversationid: string;
	messages: Message[];
}


const Home: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationResult[]>([]);
  const [toggledConversationID, setToggledConversationID] = useState<string>("");
  const [toggledConversation, setToggledConversation] = useState<Conversation>();
  const [conversationDialogueOpen, setConversationDialogueOpen] = useState<boolean>(false);
  const [conversationDialogueName, setConversationDialogueName] = useState<string>("");
  const [conversationDialogueParticipants, setConversationDialogueParticipants] = useState<string>("");

  const drawerWidth = 240;
  const messagingAPI = new MessagingAPI("/api");

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

  const fetchConversation = async () => {
    if (toggledConversationID && toggledConversationID != "") {
      const response = await messagingAPI.getConversation(toggledConversationID);
      setToggledConversation(response.conversation)
    }
  }

  useEffect( () => {
    const intervalId = setInterval(fetchConversations, 5000);
    fetchConversations();
    return () => clearInterval(intervalId);
  }, []);

  useEffect( () => {
    const intervalId = setInterval(fetchConversation, 2000);
    fetchConversation();
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (toggledConversationID) {
      fetchConversation();
    }
  }, [toggledConversationID]);

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Dialog
        open={conversationDialogueOpen}
        onClose={handleConversationDialogueClose}
        PaperProps={{
          sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            padding: 2,
          },
        }}
      >
        <DialogTitle>Create a New Conversation</DialogTitle>
        <DialogContent sx={{ width: '100%', maxWidth: 500 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Conversation Name"
            type="text"
            fullWidth
            value={conversationDialogueName}
            onChange={(e) => setConversationDialogueName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Conversation Participants"
            type="text"
            fullWidth
            value={conversationDialogueParticipants}
            onChange={(e) => setConversationDialogueParticipants(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleConversationDialogueClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConversationDialogueSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography variant="h6" sx={{ padding: 2 }}>
        Conversations
      </Typography>
      <Button variant="contained" color="primary" onClick={handleConversationDialogueOpen}>
        Add Conversation
      </Button>
      <List>
        {conversations.sort((a,b) => a.name < b.name ? -1 : a.name < b.name ? 1 : 0).map((conversation) => (
          <ListItemButton key={conversation.conversationid} onClick={() => handleChangeConversation(conversation.conversationid)}>
            <ListItemText primary={conversation.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      <List sx={{ display: 'flex',  justifyContent: 'flex-start', flexDirection: 'row', padding: 0, height: '60px' }}>
        {(toggledConversation ? toggledConversation.participants : []).sort().map((name, index)  => (
          <ListItem key={index} sx={{ minWidth: '60px', padding: '5', margin: '0', width: "auto"}}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Box>
  </Box>
);
};

export default Home;
