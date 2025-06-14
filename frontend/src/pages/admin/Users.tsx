import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchAllUsers } from "../../features/users/userSlice";
import { Search, Edit, Trash, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User } from "../../types/user";

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
  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.users
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user: User) => {
    // Get user status based on verification status
    const userStatus = getUserStatus(user);

    const matchesSearch =
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.documentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())) ??
      false;

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || userStatus === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user deletion
  const handleDeleteUser = (userId: number) => {
    // In a real app, you would call an API to delete the user
    // For now, we'll just log it
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Users Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor user accounts across your platform
            </p>
          </div>
          <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
            <UserPlus className="w-5 h-5 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-full">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-600 rounded-full">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
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
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-600 rounded-full">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
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
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600 rounded-full">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  className="pl-11 pr-4 py-3 w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40 border-gray-200 rounded-lg bg-white">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 border-gray-200 rounded-lg bg-white">
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
                      Verified
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
                          <div className="text-xs text-gray-500">
                            {user.phone || "No phone number"}
                          </div>
                        </TableCell>

                        {/* Document Info */}
                        <TableCell className="py-4 px-6">
                          {user.documentType ? (
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {user.documentType}
                              </Badge>
                              {user.documentImage ? (
                                <div className="mt-1">
                                  <a
                                    href={user.documentImage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center"
                                  >
                                    <span>View Document</span>
                                    <svg
                                      className="w-3 h-3 ml-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  No document
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No document
                            </span>
                          )}
                        </TableCell>

                        {/* Role & Status */}
                        <TableCell className="py-4 px-6">
                          <div className="space-y-2">
                            <div>
                              <Badge
                                className={`${getRoleBadgeColor(
                                  user.role
                                )} px-2 py-1 text-xs font-medium`}
                              >
                                {user.role}
                              </Badge>
                            </div>
                            <div>
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
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-4 px-6 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 hover:bg-blue-50"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:bg-red-50"
                              title="Delete User"
                              onClick={() => handleDeleteUser(Number(user.id))}
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
          </CardContent>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 rounded-lg"
                disabled
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
