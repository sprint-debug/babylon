


type FixedViewProps = {
    children : React.ReactNode | React.ReactNode[];
    className? :string;
}

const FixedView = ({children, className}:FixedViewProps) => {
 return <main className={className}>{children}</main>
}

export default FixedView;