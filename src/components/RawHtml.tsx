interface Props {
  html: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function RawHtml({ html, as: Tag = "span", className, id, style }: Props) {
  return (
    <Tag className={className} id={id} style={style} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
