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
    <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center', padding: 1, margin:1, borderTop: '1px solid #eef', backgroundColor: '#4A4455', height: '60px', borderRadius: '10px'}}>
        <TextField
        name='message'
        autoComplete='off'
        value={sendMessage}
        onChange={(e) => setSendMessage(e.target.value)}
        placeholder="Type a message..."
        variant="outlined"
        fullWidth
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        sx={{
            marginRight: 1, 
            width: 'fill', 
            '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#eef',
                    },
                    '&:hover fieldset': {
                        borderColor: '#eef',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#eef',
                    },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#eef',
                },
            '& .MuiInputBase-input': {
                    color: '#eef',
            },
          
        }}
        />
        <Button
        variant="contained"
        onClick={handleSendMessage}
        sx={{ marginRight: 0, height: '120%',  minWidth: '80px', width: 'auto', backgroundColor: '#eef', color: '#0B0C10'}}
        >
        Send
        </Button>
    </Box>
  );
};

export default ComposeMessage;
