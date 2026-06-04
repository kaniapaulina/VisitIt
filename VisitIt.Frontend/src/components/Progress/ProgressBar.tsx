interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="progress-container">
      <div 
        className="progress-fill" 
        style={{ width: `${clampedPercentage}%` }}
      >
        <span className="progress-text">{Math.round(clampedPercentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;