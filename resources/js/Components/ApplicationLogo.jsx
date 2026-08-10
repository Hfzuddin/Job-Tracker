export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <span {...props} className={`font-bold text-xl tracking-tight ${className}`}>
            JobTracker
        </span>
    );
}
