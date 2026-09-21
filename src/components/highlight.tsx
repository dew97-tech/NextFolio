export function Highlight({
  text,
  phrase,
}: {
  text: string;
  phrase?: string;
}) {
  if (!phrase) return <>{text}</>;

  const index = text.toLowerCase().indexOf(phrase.toLowerCase());

  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <span className="highlight-marker">
        {text.slice(index, index + phrase.length)}
      </span>
      {text.slice(index + phrase.length)}
    </>
  );
}
