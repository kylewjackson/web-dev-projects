type Props = {
  context: string;
};

export default function LoadingMessage({ context }: Props) {
  return (
    <div className="text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading {context}...</span>
      </div>
    </div>
  );
}
