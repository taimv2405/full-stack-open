import { useState, useImperativeHandle } from 'react';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(props.ref, () => ({ toggleVisibility }));

  return (
    <>
      {!visible && (
        <div>
          <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        </div>
      )}

      {visible && (
        <>
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </>
      )}
    </>
  );
};

export default Togglable;
