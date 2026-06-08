import { useParams } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useBlog, useBlogMutations } from '../hooks/useBlogs';
import { useUser } from '../stores/userStore';
import { useField } from '../hooks/useField';
import { useNotificationActions } from '../stores/notificationStore';

export const Comments = () => {
  const { id } = useParams();
  const { blog, isPending, isError } = useBlog(id);
  const user = useUser();
  const comment = useField('text');
  const { addComment } = useBlogMutations();
  const { notifyError } = useNotificationActions();

  if (isPending) return <CircularProgress size={20} />;
  if (isError)
    return <Typography color="error">Could not load comments</Typography>;

  const handleComment = async () => {
    try {
      const payload = {
        id: blog.id,
        comment: comment.inputProps.value,
      };
      await addComment(payload);
      comment.reset();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mt: 1 }}>
        Comments
      </Typography>
      {user ? (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
          <TextField
            label="add a comment"
            size="small"
            {...comment.inputProps}
          />
          <Button
            variant="contained"
            onClick={handleComment}
            disabled={!comment.inputProps.value.trim()}
          >
            add
          </Button>
        </Box>
      ) : (
        <Typography color="warning">Please log in to comment</Typography>
      )}
      <List>
        {blog.comments?.map((comment, i) => (
          <ListItem key={i} disablePadding>
            <ListItemText primary={comment}></ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
};
