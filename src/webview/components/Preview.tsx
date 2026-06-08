interface Props {
  text: string;
}

export default function Preview({ text }: Props) {
  return (
    <div className={`preview ${!text ? 'empty' : ''}`}>
      {text || '(select a template above)'}
    </div>
  );
}
