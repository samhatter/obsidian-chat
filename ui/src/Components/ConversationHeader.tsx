import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import MessageBox from './MessageBox';
import { Conversation } from '../Shared/utils/Interfaces';

interface ConversationHeaderProps {
  toggledConversation: Conversation | undefined;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = (props) => {
  const {
    toggledConversation,
  } = props;

  return (

        <Box sx={{ position: 'relative', padding: 1, backgroundColor: '#4A4455', borderRadius:'10px', margin: 1, borderTop: '1px solid #eef'}}>
            <Typography variant="h6" sx={{ padding: 0, color:'#eef'}}>
            {toggledConversation?.name || ''}
            </Typography>
            <List sx={{ display: 'flex',  justifyContent: 'flex-start', flexDirection: 'row', padding: 0, margin: 0, height: '40px', width:"80%" }}>
            {(toggledConversation ? toggledConversation.participants : []).sort().map((name, index)  => (
                <ListItem key={index} sx={{ minWidth: '60px', padding: 1, margin: 0.5, width: "auto", borderRadius: '10px', backgroundColor: '#eef', borderTop: '1px solid #000', textAlign: 'center',}}>
                    <ListItemText primary={name} sx={{color:'#4A4455'}} />
                </ListItem>
            ))}
            </List>
            <Box sx={{ position: 'absolute', top: 8, right: -20, width: '100px' }}>
                <img src='obsidianorder.svg' style={{width: '80%'}} />
            </Box>
    </Box>
  );
};

export default ConversationHeader;
