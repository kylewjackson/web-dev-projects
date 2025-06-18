type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="alert alert-danger">
      Something went wrong: {message}
    </div>
  );
}
