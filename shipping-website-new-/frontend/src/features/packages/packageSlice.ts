import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { packageAPI } from "./packageAPI";
import {
  Package,
  PackageWithCustomer,
  CreatePackageData,
  UpdatePackageData,
  PackageStats,
} from "../../types/package";

interface PackagesState {
  packages: Package[];
  allPackages: PackageWithCustomer[];
  packagesByStatus: {
    waiting: Package[];
    in_transit: Package[];
    india: Package[];
    dispatch: Package[];
    delivered: Package[];
  };
  currentPackage: Package | null;
  isLoading: boolean;
  error: string | null;
  stats: PackageStats | null;
}

const initialState: PackagesState = {
  packages: [],
  allPackages: [],
  packagesByStatus: {
    waiting: [],
    in_transit: [],
    india: [],
    dispatch: [],
    delivered: [],
  },
  currentPackage: null,
  isLoading: false,
  error: null,
  stats: null,
};

// Async thunks
export const fetchAllPackages = createAsyncThunk<PackageWithCustomer[]>(
  "packages/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await packageAPI.getAllPackages();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch packages"
      );
    }
  }
);

export const fetchMyPackages = createAsyncThunk<Package[]>(
  "packages/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      return await packageAPI.getMyPackages();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your packages"
      );
    }
  }
);

export const fetchPackagesByStatus = createAsyncThunk<
  { packages: Package[]; status: string },
  string
>("packages/fetchByStatus", async (status, { rejectWithValue }) => {
  try {
    const packages = await packageAPI.getMyPackagesByStatus(status);
    return { packages, status };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || `Failed to fetch ${status} packages`
    );
  }
});

export const fetchPackageById = createAsyncThunk<Package, string>(
  "packages/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await packageAPI.getPackageById(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch package"
      );
    }
  }
);

export const createPackage = createAsyncThunk<Package, CreatePackageData>(
  "packages/create",
  async (packageData, { rejectWithValue }) => {
    try {
      return await packageAPI.createPackage(packageData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create package"
      );
    }
  }
);

export const updatePackage = createAsyncThunk<
  Package,
  { id: string; updates: UpdatePackageData }
>("packages/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await packageAPI.updatePackage(id, updates);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update package"
    );
  }
});

export const updatePackageStatus = createAsyncThunk<
  Package,
  { id: string; status: string; location?: string }
>(
  "packages/updateStatus",
  async ({ id, status, location }, { rejectWithValue }) => {
    try {
      return await packageAPI.updatePackageStatus(id, status, location);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update package status"
      );
    }
  }
);

export const deletePackage = createAsyncThunk<string, string>(
  "packages/delete",
  async (id, { rejectWithValue }) => {
    try {
      await packageAPI.deletePackage(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete package"
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk<PackageStats>(
  "packages/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await packageAPI.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const searchPackages = createAsyncThunk<PackageWithCustomer[], string>(
  "packages/search",
  async (query, { rejectWithValue }) => {
    try {
      return await packageAPI.searchPackages(query);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search packages"
      );
    }
  }
);

export const updatePackageDimensions = createAsyncThunk<
  Package,
  {
    packageId: string;
    dimensions: {
      width?: number;
      height?: number;
      length?: number;
      unit?: string;
    };
  }
>(
  "packages/updateDimensions",
  async ({ packageId, dimensions }, { rejectWithValue }) => {
    try {
      return await packageAPI.updatePackageDimensions(packageId, dimensions);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update dimensions"
      );
    }
  }
);

const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPackage: (state, action: PayloadAction<Package | null>) => {
      state.currentPackage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update dimensions
      .addCase(updatePackageDimensions.fulfilled, (state, action) => {
        const updatedPackage = action.payload;

        // Create a deep copy of the package to avoid reference issues
        const updatedPackageCopy = JSON.parse(JSON.stringify(updatedPackage));

        // Helper function to update package in an array
        const updatePackageInArray = <T extends { id?: string; _id?: string }>(
          packages: T[],
          updatedPkg: T
        ): T[] => {
          return packages.map((pkg) => {
            const pkgId = pkg.id || pkg._id;
            const updatedPkgId = updatedPkg.id || updatedPkg._id;

            if (pkgId === updatedPkgId) {
              // Create a new object with the updated package
              return { ...pkg, ...updatedPkg };
            }
            // Return a new object for each package to ensure immutability
            return { ...pkg };
          });
        };

        // Update packages in all relevant state arrays with new references
        state.packages = updatePackageInArray(
          state.packages,
          updatedPackageCopy
        );
        state.allPackages = updatePackageInArray(
          state.allPackages,
          updatedPackageCopy
        );

        // Update packagesByStatus with new references
        Object.entries(state.packagesByStatus).forEach(([status, packages]) => {
          const key = status as keyof typeof state.packagesByStatus;
          state.packagesByStatus[key] = updatePackageInArray(
            packages,
            updatedPackageCopy
          );
        });

        // Update currentPackage if it's the one being updated
        if (state.currentPackage) {
          const currentPkgId =
            state.currentPackage.id || state.currentPackage._id;
          const updatedPkgId = updatedPackage.id || updatedPackage._id;

          if (currentPkgId === updatedPkgId) {
            state.currentPackage = {
              ...state.currentPackage,
              ...updatedPackageCopy,
            };
          }
        }
      })
      // Fetch all packages
      .addCase(fetchAllPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allPackages = action.payload;
      })
      .addCase(fetchAllPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch my packages
      .addCase(fetchMyPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = action.payload;
      })
      .addCase(fetchMyPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch packages by status
      .addCase(fetchPackagesByStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackagesByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { packages, status } = action.payload;

        // Update the appropriate status array
        if (
          status === "waiting" ||
          status === "in_transit" ||
          status === "india" ||
          status === "dispatch" ||
          status === "delivered"
        ) {
          state.packagesByStatus[status] = packages;
        }
      })
      .addCase(fetchPackagesByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch package by ID
      .addCase(fetchPackageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPackage = action.payload;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create package
      .addCase(createPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages.push(action.payload);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update package
      .addCase(updatePackage.fulfilled, (state, action) => {
        const index = state.packages.findIndex(
          (pkg) => pkg.id === action.payload.id
        );
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
        if (state.currentPackage?.id === action.payload.id) {
          state.currentPackage = action.payload;
        }
      })
      // Update package status
      .addCase(updatePackageStatus.fulfilled, (state, action) => {
        // Find by either _id or id for MongoDB compatibility
        const index = state.packages.findIndex(
          (pkg) =>
            (pkg._id && pkg._id === action.payload._id) ||
            pkg.id === action.payload.id
        );
        if (index !== -1) {
          state.packages[index] = action.payload;
        }

        // Find the package in allPackages by _id or id
        const allIndex = state.allPackages.findIndex(
          (pkg) =>
            (pkg._id && pkg._id === action.payload._id) ||
            pkg.id === action.payload.id
        );
        if (allIndex !== -1) {
          // Only update the specific package that was changed
          state.allPackages[allIndex] = {
            ...state.allPackages[allIndex],
            status: action.payload.status,
            currentLocation: action.payload.currentLocation,
            updatedAt: action.payload.updatedAt,
          };
        }

        // If this is the current package, update it too
        if (
          state.currentPackage &&
          ((state.currentPackage._id &&
            state.currentPackage._id === action.payload._id) ||
            state.currentPackage.id === action.payload.id)
        ) {
          state.currentPackage = {
            ...state.currentPackage,
            status: action.payload.status,
            currentLocation: action.payload.currentLocation,
            updatedAt: action.payload.updatedAt,
          };
        }
      })
      // Delete package
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter(
          (pkg) => pkg.id !== action.payload
        );
        state.allPackages = state.allPackages.filter(
          (pkg) => pkg.id !== action.payload
        );
      })
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Search packages
      .addCase(searchPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allPackages = action.payload;
      })
      .addCase(searchPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Handle updateVolumetricWeight
  },
});


export const { clearError, setCurrentPackage } = packagesSlice.actions;
export default packagesSlice.reducer;
