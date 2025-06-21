import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequest } from "../lib/api";
import PageLoader from "../components/PageLoader";
import { UserCheckIcon } from "lucide-react";
import NoNotificationFound from "../components/NoFriendsFound";
const Notifications = () => {
  const queryClient = useQueryClient();
  const { data: friendRequests, isLoadng } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequest,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const inCommingRequests = friendRequests?.incommingReq || [];

  const acceptedRequests = friendRequests?.acceptRequest || [];
  return (
    <div className="p-4 sm:p-6 lg:p-8 ">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>
        {isLoadng ? (
          <>
            <PageLoader />
          </>
        ) : (
          <>
            {inCommingRequests.length > 0 && (
              <section className="space-y-4 ">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {inCommingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3 ">
                  {inCommingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-200 shadow-sm hover:shodow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full">
                              <img src={req.sender.profilePic} alt="" />
                            </div>

                            <div>
                              <h3 className="font-semibold ">
                                {req.sender.fullName}
                              </h3>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(req._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              // accepted friend request\
            )}

            {/* accepted notifications  */}

            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.recipient.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {inCommingRequests.length === 0 &&
              acceptedRequests.length === 0 && <NoNotificationFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
