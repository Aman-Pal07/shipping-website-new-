import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchAllUsers } from "../../features/users/userSlice";
import {
  Search,
  UserPlus,
  Eye,
  Edit,
  Trash,
  Save,
  Loader2,
} from "lucide-react";
import { User, UserDocument } from "@/types/user";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// User status mapping
const getUserStatus = (user: User) => {
  if (!user.isVerified) return "pending";
  return "active"; // Add more status logic as needed
};

// Helper functions for badge colors
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "user":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "inactive":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "suspended":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users: reduxUsers,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.users);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Sync Redux users with local state
  useEffect(() => {
    if (reduxUsers.length > 0) {
      setUsers(reduxUsers);
    }
  }, [reduxUsers]);
  const [selectedDocument, setSelectedDocument] = useState<{
    type: string;
    url: string;
  } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await dispatch(fetchAllUsers()).unwrap();
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadUsers();
  }, [dispatch]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Handle document preview
  const handleDocumentPreview = (
    documentType: string,
    documentImage: string
  ) => {
    setSelectedDocument({
      type: documentType,
      url: documentImage.startsWith("http")
        ? documentImage
        : `${process.env.REACT_APP_API_URL}${documentImage}`,
    });
  };

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found in localStorage");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${
          selectedUser.id || selectedUser._id
        }`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Update the users state with the updated user data
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id || user._id === selectedUser._id
            ? { ...user, ...response.data }
            : user
        )
      );

      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default",
      });

      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUserConfirmation = async () => {
    console.log("Delete confirmation clicked");
    if (!selectedUser) {
      console.error("No user selected for deletion");
      return;
    }

    try {
      console.log("Getting token from localStorage");
      const token = localStorage.getItem("token");
      console.log("Token found in localStorage:", token ? "Yes" : "No");

      if (!token) {
        throw new Error("No authentication token found in localStorage");
      }

      const userId = selectedUser.id || selectedUser._id;
      const url = `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`;
      console.log("Making DELETE request to:", url);

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Update the users state by filtering out the deleted user
      setUsers((prevUsers) =>
        prevUsers.filter((user) => {
          // Check both id and _id to ensure we're matching the correct user
          const isNotDeletedUser =
            (user.id && user.id !== userId) ||
            (user._id && user._id !== userId);
          console.log(
            "User ID:",
            user.id || user._id,
            "Deleted ID:",
            userId,
            "Keep user:",
            isNotDeletedUser
          );
          return isNotDeletedUser;
        })
      );

      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default",
      });

      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      console.error("Error response:", error.response);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Users Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and monitor user accounts across your platform
            </p>
          </div>
          <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl w-full sm:w-auto">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-blue-600 rounded-full">
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-blue-600">
                    Total Users
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-green-600 rounded-full">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full"></div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-green-600">
                    Active Users
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {
                      users.filter((user) => getUserStatus(user) === "active")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-yellow-600 rounded-full">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full"></div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-yellow-600">
                    Pending
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {
                      users.filter((user) => getUserStatus(user) === "pending")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-purple-600 rounded-full">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full"></div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-purple-600">
                    Admins
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {users.filter((user) => user.role === "admin").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="text"
                  className="pl-10 sm:pl-11 pr-4 py-2 sm:py-3 w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-gray-200 rounded-lg bg-white text-sm sm:text-base">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 border-gray-200 rounded-lg bg-white text-sm sm:text-base">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 bg-gray-50/50">
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-900">
                        Name
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-900">
                        Email
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-900">
                        Role
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-900">
                        Status
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-900">
                        Document
                      </TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-900">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                            <p className="text-gray-600 font-medium">
                              Loading users...
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                              <span className="text-red-600 text-xl">!</span>
                            </div>
                            <p className="text-red-600 font-medium">
                              Error loading users: {error}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          {/* User Info */}
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                {user.firstName?.charAt(0).toUpperCase()}
                                {user.lastName?.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Contact Info */}
                          <TableCell className="py-4 px-6">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </TableCell>

                          {/* Role & Status */}
                          <TableCell className="py-4 px-6">
                            <Badge
                              className={`${getRoleBadgeColor(
                                user.role
                              )} px-2 py-1 text-xs font-medium`}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-4 px-6">
                            <Badge
                              className={`${getStatusBadgeColor(
                                getUserStatus(user)
                              )} px-2 py-1 text-xs font-medium`}
                            >
                              {getUserStatus(user)}
                              {user.isVerified && " • Verified"}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-4 px-6">
                            {user.documents && user.documents.length > 0 ? (
                              <div className="space-y-2">
                                {user.documents?.map(
                                  (doc: UserDocument, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2"
                                    >
                                      <span className="text-sm text-gray-600">
                                        {doc.documentType}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                          handleDocumentPreview(
                                            doc.documentType,
                                            doc.documentImage
                                          )
                                        }
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No documents
                              </span>
                            )}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="py-4 px-6 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-600 hover:bg-blue-50"
                                title="Edit User"
                                onClick={() => handleEditClick(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:bg-red-50"
                                title="Delete User"
                                onClick={() => handleDeleteClick(user)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Search className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">
                              No users found matching your filters.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card Layout */}
              <div className="block sm:hidden space-y-4 p-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium text-sm">
                      Loading users...
                    </p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-red-600 text-lg">!</span>
                    </div>
                    <p className="text-red-600 font-medium text-sm">
                      Error loading users: {error}
                    </p>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Card key={user.id} className="border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                            {user.firstName?.charAt(0).toUpperCase()}
                            {user.lastName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-600">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Role</p>
                            <Badge
                              className={`${getRoleBadgeColor(
                                user.role
                              )} px-2 py-1 text-xs font-medium`}
                            >
                              {user.role}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <Badge
                              className={`${getStatusBadgeColor(
                                getUserStatus(user)
                              )} px-2 py-1 text-xs font-medium`}
                            >
                              {getUserStatus(user)}
                              {user.isVerified && " • Verified"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Documents</p>
                          {user.documents && user.documents.length > 0 ? (
                            <div className="space-y-2">
                              {user.documents?.map(
                                (doc: UserDocument, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between"
                                  >
                                    <span className="text-sm text-gray-600">
                                      {doc.documentType}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        handleDocumentPreview(
                                          doc.documentType,
                                          doc.documentImage
                                        )
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No documents
                            </span>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:bg-blue-50"
                            title="Edit User"
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:bg-red-50"
                            title="Delete User"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClick(user);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium text-sm">
                      No users found matching your filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-sm text-gray-600 font-medium">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 rounded-lg w-full sm:w-auto"
                disabled
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Document Preview Dialog */}
      <Dialog
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      >
        <DialogContent className="max-w-[90vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {selectedDocument?.type} Document
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Preview of the uploaded document
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedDocument?.url ? (
              <div className="relative w-full h-[50vh] sm:h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedDocument.url}
                  alt={`${selectedDocument.type} document`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Handle image loading errors
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://via.placeholder.com/600x400?text=Document+Not+Found";
                  }}
                />
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                  <a
                    href={selectedDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-sm">Document not available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user details below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={editFormData.role}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                console.log("Delete button clicked");
                e.preventDefault();
                e.stopPropagation();
                handleDeleteUserConfirmation();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
