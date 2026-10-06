export const StoryStage = ({ children, className = '', minHeight = 'min-h-80' }) => (
  <div className={ `relative overflow-visible p-8 ${minHeight} ${className}` }>
    {children}
  </div>
);
