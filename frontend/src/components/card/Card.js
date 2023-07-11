import './Card.css';

function Card(props) {
  const classes = 'card p-2 ' + props.className;

  return <div className={classes}>{props.children}</div>;
}

export default Card;