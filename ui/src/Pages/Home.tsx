import React, { useState, useEffect } from 'react';
import { Box, Button, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Typography} from '@mui/material';
import MessagingAPI from '../Shared/api/MessagingApi';

interface Conversation {
  conversationID: string;
  name: string;
}

const Home: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const drawerWidth = 240;
  const messagingAPI = new MessagingAPI("/api");

  useEffect( () => {
    const fetchConversations = async () => {
      const response = await messagingAPI.getConversations();
      if (!response.ok) {
        throw new Error("Could not fetch conversations");
      }
      setConversations(response.conversations)
    };

    const intervalId = setInterval(fetchConversations, 5000);
    fetchConversations();
    return () => clearInterval(intervalId);
  }, []);


  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
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
      <List>
        {conversations.map((conversation, index) => (
          <ListItemButton key={index}>
            <ListItemText primary={conversation.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Main Content
      </Typography>
    </Box>
  </Box>
);
};

export default Home;
