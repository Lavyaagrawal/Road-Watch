function Button({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="
      bg-blue-600
      hover:bg-blue-700
      transition
      px-7
      py-4
      rounded-2xl
      font-semibold
      shadow-lg
      shadow-blue-600/20
      "
        >
            {children}
        </button>
    );
}

export default Button;