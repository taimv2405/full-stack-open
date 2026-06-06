import { useNavigate } from 'react-router-dom';
import { useField } from '../hooks';

const CreateNew = ({ addAnecdote }) => {
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnecdote({
      content: content.inputProps.value,
      author: author.inputProps.value,
      info: info.inputProps.value,
      votes: 0,
    });
    navigate('/');
  };

  const handleReset = () => {
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name="content" {...content.inputProps} />
        </div>
        <div>
          author
          <input name="author" {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input name="info" {...info.inputProps} />
        </div>
        <button>create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
