import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, TextField, Typography } from '@mui/material';
import MessageBox from './MessageBox';
import ConversationHeader from './ConversationHeader';

interface ComposeMessageProps {
  sendMessage: string;
  setSendMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const ComposeMessage: React.FC<ComposeMessageProps> = (props) => {
  const {
    sendMessage,
    setSendMessage,
    handleSendMessage,
  } = props;

  return (
    <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center', padding: 1, margin:0, borderTop: '1px solid #ccc', backgroundColor: '#f9f9f9', height: '60px'}}>
        <TextField
        value={sendMessage}
        onChange={(e) => setSendMessage(e.target.value)}
        placeholder="Type a message..."
        variant="outlined"
        fullWidth
        sx={{ marginRight: 1, width: 'fill'}}
        />
        <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        sx={{ height: '100%',  minWidth: '80px', width: 'auto' }}
        >
        Send
        </Button>
    </Box>
  );
};

export default ComposeMessage;
