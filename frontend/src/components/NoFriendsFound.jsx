const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200 p-6 text-center ">
      <h3 className="font-semibold text-lg mb-2 capitalize ">
        {" "}
        No friends yet
      </h3>
      <p className="text-base-content capitalize">
        {" "}
        send requests to connect with friends
      </p>
    </div>
  );
};

export default NoFriendsFound;
