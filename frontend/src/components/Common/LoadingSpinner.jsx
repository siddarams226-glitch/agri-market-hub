const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="spinner"></div>
      </div>
    );
  }

  return <div className="spinner"></div>;
};

export default LoadingSpinner;
