export default function EditFormWrapper({
  editMsg,
  newMsg,
  isNew,
  children,
}: {
  editMsg: string | React.ReactNode;
  newMsg: string | React.ReactNode;
  isNew: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow px-2 overflow-hidden">
      <div className="hidden md:flex justify-center items-center h-full w-1/2">
        {isNew ? <div>{newMsg}</div> : <div>{editMsg}</div>}
      </div>
      {children}
    </div>
  );
}
