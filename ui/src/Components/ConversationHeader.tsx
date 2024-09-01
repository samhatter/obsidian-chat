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
    <Box sx={{ padding: 1}}>
        <Typography variant="h6" sx={{ padding: 0}}>
        {toggledConversation?.name || ''}
        </Typography>
        <List sx={{ display: 'flex',  justifyContent: 'flex-start', flexDirection: 'row', padding: 0, margin: 0, height: '60px' }}>
        {(toggledConversation ? toggledConversation.participants : []).sort().map((name, index)  => (
            <ListItem key={index} sx={{ minWidth: '60px', padding: 1, margin: 1, width: "auto", borderRadius: '10px', backgroundColor: '#e0e0e0', border: '1px solid #ccc', textAlign: 'center',}}>
            <ListItemText primary={name} />
            </ListItem>
        ))}
        </List>
    </Box>
  );
};

export default ConversationHeader;
