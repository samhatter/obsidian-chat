import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import { ConversationResult } from '../Shared/utils/Interfaces';


interface ConversationDrawerProps {
  conversations: ConversationResult[];
  conversationDialogueOpen: boolean;
  conversationDialogueName: string;
  conversationDialogueParticipants: string;
  handleConversationDialogueClose: () => void;
  handleConversationDialogueOpen: () => void;
  handleConversationDialogueSubmit: () => void;
  handleChangeConversation: (conversationid: string) => void;
  setConversationDialogueName: (name: string) => void;
  setConversationDialogueParticipants: (participants: string) => void;
}

const ConversationDrawer: React.FC<ConversationDrawerProps> = (props) => {
  const {
    conversations,
    conversationDialogueOpen,
    conversationDialogueName,
    conversationDialogueParticipants,
    handleConversationDialogueClose,
    handleConversationDialogueOpen,
    handleConversationDialogueSubmit,
    handleChangeConversation,
    setConversationDialogueName,
    setConversationDialogueParticipants
  } = props;

  return (
    <>
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
            <DialogActions sx={{ justifyContent: 'center'}}>
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
            width: '18%',
            minWidth:'170px',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: '18%',
                minWidth:'170px',
                boxSizing: 'border-box',
            },
            }}
            variant="permanent"
            anchor="left"
        >
            <Typography variant="h6" sx={{ padding: 2 }}>
            Conversations
            </Typography>
            <Button variant="contained" color="primary" onClick={handleConversationDialogueOpen} sx={{margin:1}}>
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
    </>
  );
};

export default ConversationDrawer;
