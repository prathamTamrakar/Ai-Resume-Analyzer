const AuthCard = ({ icon, title, children }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 animate-fade-in-up">
        <div className="flex flex-col items-center mb-7">
          <div className="mb-4 p-3.5 bg-indigo-50 rounded-2xl text-indigo-600">
            {icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="mt-2 w-8 h-0.5 bg-linear-to-r from-indigo-400 to-violet-400 rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
