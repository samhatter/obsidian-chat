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
                    padding: 2,
                    backgroundColor: "#eef",
                    borderRadius: "10px"
                }
            }}
        >
            <DialogTitle>Create a New Conversation</DialogTitle>
            <DialogContent sx={{ width: '100%', maxWidth: 500}}>
            <TextField
                name='chat-name'
                autoComplete='off'
                margin="dense"
                placeholder="Conversation Participants"
                fullWidth
                variant="outlined"
                value={conversationDialogueName}
                onChange={(e) => setConversationDialogueName(e.target.value)}
                sx={{
                    marginRight: 0, 
                    width: 'fill', 
                    '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&:hover fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4A4455',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4A4455',
                        },
                    '& .MuiInputBase-input': {
                            color: '#4A4455',
                    },
                }}
            />
            <TextField
                name='participants'
                autoComplete='off'
                margin="dense"
                placeholder="Conversation Participants"
                fullWidth
                variant="outlined"
                value={conversationDialogueParticipants}
                onChange={(e) => setConversationDialogueParticipants(e.target.value)}
                sx={{
                    marginRight: 0, 
                    width: 'fill', 
                    '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&:hover fieldset': {
                                borderColor: '#4A4455',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#4A4455',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4A4455',
                        },
                    '& .MuiInputBase-input': {
                            color: '#4A4455',
                    },
                }}
            />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center'}}>
            <Button onClick={handleConversationDialogueClose} sx={{color:"#4A4455"}}>
                Cancel
            </Button>
            <Button onClick={handleConversationDialogueSubmit} sx={{color:"#4A4455"}}>
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
            
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto', backgroundColor: '#B9B5C4', borderRadius:'10px', height:'fill'}}>
                <Button variant="contained" color="primary" onClick={handleConversationDialogueOpen} sx={{ mx:1, mt:1, mb:1, padding:2, backgroundColor: '#eef', color: '#0B0C10', borderRadius: '10px', '&:hover': {transform: 'scale(1.05)',},}}>
                Add Conversation
                </Button>
                <List sx={{margin:1, padding:0}}>
                {conversations.sort((a,b) => a.name < b.name ? -1 : a.name < b.name ? 1 : 0).map((conversation) => (
                    <ListItemButton key={conversation.conversationid} onClick={() => handleChangeConversation(conversation.conversationid)}>
                    <ListItemText primary={conversation.name} sx={{ padding: 1,  backgroundColor: '#4A4455', borderRadius:'10px', margin: -0.8, borderTop: '1px solid #eef', color: "#eef", '&:hover': {transform: 'scale(1.05)',},}}/>
                    </ListItemButton>
                ))}
                </List>
            </Box>
        </Drawer>
    </>
  );
};

export default ConversationDrawer;
