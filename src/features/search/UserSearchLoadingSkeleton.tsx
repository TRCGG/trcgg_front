const UserSearchLoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="h-10 bg-gray-700 rounded" />
      ))}
    </div>
  );
};

export default UserSearchLoadingSkeleton;
