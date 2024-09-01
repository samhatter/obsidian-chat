import { IconButton, Paper, Typography } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { Message } from "../Shared/utils/Interfaces";

interface MessageProps {
    index: number;
    message: Message;
    name: string;
    conversationid: string;
    handleUpVote: (message: Message, conversationid: string) => void;
    handleDownVote: (message: Message, conversationid: string) => void;
  }

const MessageBox: React.FC<MessageProps> = (props) => {
    const {
        index,
        message,
        name,
        conversationid,
        handleUpVote,
        handleDownVote,
    } = props;

    const isSender = message.sender === name;
    
    return (
        <Paper
            key={index}
            sx={{
            padding: 2,
            marginBottom: 1,
            marginLeft: isSender ? 'auto' : 0,
            marginRight: isSender ? 0 : 'auto',
            backgroundColor: message.sender === name ? '#e3f2fd' : '#c8e6c9',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            }}
        >
            <Typography variant="caption" color="textSecondary">
            {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {message.sender}
            </Typography>
            <Typography variant="body1">
            {message.message}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px'}}>
                <IconButton size="small" onClick={() => handleUpVote(message, conversationid)}>
                    <ThumbUp fontSize="small" />
                </IconButton>
                <Typography variant="body2" sx={{ marginX: '8px' }}>
                    {message.upvotes?.length || 0}
                </Typography>
                <IconButton size="small" onClick={() => handleDownVote(message, conversationid)}>
                    <ThumbDown fontSize="small" />
                </IconButton>
                <Typography variant="body2" sx={{ marginX: '8px' }}>
                    {message.downvotes?.length || 0}
                </Typography>
            </div>
        </Paper>
    )
};

export default MessageBox