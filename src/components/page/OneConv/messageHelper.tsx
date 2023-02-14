import MoreVertIcon from '@suid/icons-material/MoreVert';
import { Box, IconButton, Popover } from "@suid/material";
import EmojiPicker from 'emoji-picker-react';

/**
 * Displayed when hovered
 * @returns 
 */
export function MessageHelper() {

    return (
        <Box
            sx={{
                border: '2px dashed #959595'
            }}
        >
            <IconButton>
                <Popover>
                    
                </Popover>
            </IconButton>
            <IconButton>
                <MoreVertIcon />
            </IconButton>
        </Box>
    );
}