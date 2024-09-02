import { IconButton, Paper, Typography } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { Message } from "../Shared/utils/Interfaces";

interface MessageProps {
    message: Message;
    name: string;
    conversationid: string;
    handleUpVote: (message: Message, conversationid: string) => void;
    handleDownVote: (message: Message, conversationid: string) => void;
  }

const MessageBox: React.FC<MessageProps> = (props) => {
    const {
        message,
        name,
        conversationid,
        handleUpVote,
        handleDownVote,
    } = props;

    const isSender = message.sender === name;
    const bubbleColor = isSender ? '#4A4455' : '#B9B5C4'
    const textColor = isSender ? "#eef" : "#000";
    const isUpVoted = message.upvotes.includes(name);
    const isDownVoted = message.downvotes.includes(name);
    const upVoteColor = isUpVoted ? "#eef" : '#0B0C10';
    const downVoteColor = isDownVoted ? "#eef" : '#0B0C10';

    return (
        <Paper
            sx={{
            padding: 2,
            marginBottom: 1,
            marginLeft: isSender ? 'auto' : 0,
            marginRight: isSender ? 0 : 'auto',
            backgroundColor: bubbleColor,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            borderRadius: '10px',
            }}
        >
            <Typography variant="caption" sx={{color:textColor,}}>
            {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: textColor, }}>
            {message.sender}
            </Typography>
            <Typography variant="body1" sx={{color: textColor,}}>
            {message.message}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px'}}>
                <IconButton size="small" onClick={() => handleUpVote(message, conversationid)}>
                    <ThumbUp fontSize="small" sx={{color:upVoteColor}}/>
                </IconButton>
                <Typography variant="body2" sx={{ marginX: '8px', color: textColor, }}>
                    {message.upvotes?.length || 0}
                </Typography>
                <IconButton size="small" onClick={() => handleDownVote(message, conversationid)}>
                    <ThumbDown fontSize="small" sx={{color:downVoteColor}}/>
                </IconButton>
                <Typography variant="body2" sx={{ marginX: '8px', color: textColor, }}>
                    {message.downvotes?.length || 0}
                </Typography>
            </div>
        </Paper>
    )
};

export default MessageBox