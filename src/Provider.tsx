import "./styles/App.css";

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div data-theme="default">
            {children}
        </div>
    )
}


export default Provider;