import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import defaultAvatar from "../assets/user.png";
import { Loader } from "lucide-react";
const Sidebar = () => {
  const { users, selectedUser, setSelectedUser, getUsers, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <aside className="w-80 border-r border-base-200 flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-200">
        <h2 className="text-lg font-bold">Chats</h2>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-4 text-center text-base-content/50">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer hover:bg-base-200 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-primary/10 border-l-4 border-primary"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="size-10 rounded-full">
                    <img
                      src={user.profilePic || defaultAvatar}
                      alt={user.fullName}
                    />
                  </div>
                  {onlineUsers.includes(user._id) ? (
                    <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-base-100"></div>
                  ) : (
                    <div className="absolute bottom-0 right-0 size-3 bg-gray-500 rounded-full border-2 border-base-100"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{user.fullName}</h3>
                  <p className="text-sm text-base-content/50">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
