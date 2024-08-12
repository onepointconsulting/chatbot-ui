export default function MenuItemTemplate({
  title,
  func,
  children,
}: {
  title: string;
  func: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="menu-item" onClick={func}>
      <div className="w-12">{children}</div>
      <div className="pt-1 pl-2">
        <button>{title}</button>
      </div>
    </div>
  );
}
