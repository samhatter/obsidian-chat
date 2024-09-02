import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
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
                backgroundColor: '#000',
                color: "#000",
            },
            }}
            variant="permanent"
            anchor="left"
        >
            <Button variant="contained" color="primary" onClick={handleConversationDialogueOpen} sx={{ mx:0, mt:1, mb:1, padding:2, backgroundColor: '#eef', color: '#0B0C10', borderRadius: '10px'}}>
            Add Conversation
            </Button>
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto', backgroundColor: '#B9B5C4', borderRadius:'10px', height:'fill'}}>
                <List sx={{margin:1, padding:0}}>
                {conversations.sort((a,b) => a.name < b.name ? -1 : a.name < b.name ? 1 : 0).map((conversation) => (
                    <ListItemButton key={conversation.conversationid} onClick={() => handleChangeConversation(conversation.conversationid)}>
                    <ListItemText primary={conversation.name} sx={{ padding: 1, backgroundColor: '#4A4455', borderRadius:'10px', margin: -1, borderTop: '1px solid #eef', color: "#eef"}}/>
                    </ListItemButton>
                ))}
                </List>
            </Box>
        </Drawer>
    </>
  );
};

export default ConversationDrawer;
