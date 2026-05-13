import Header from './Header';
import Content from './Content';

const Course = ({ course: { name, parts } }) => (
  <>
    <Header name={name} />
    <Content parts={parts} />
  </>
);

export default Course;
