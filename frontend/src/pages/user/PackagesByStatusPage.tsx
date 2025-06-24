import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { fetchPackagesByStatus } from "../../features/packages/packageSlice";
import PackagesByStatus from "../../components/packages/PackagesByStatus";
import DispatchPackages from "../../components/packages/DispatchPackages";
import api from "@/lib/axios";
// No need to import Package type as it's not directly used in this component

export default function PackagesByStatusPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "waiting";

  const { packagesByStatus, isLoading } = useSelector(
    (state: RootState) => state.packages
  );
  const [completedDispatchPackages, setCompletedDispatchPackages] = useState<
    any[]
  >([]);

  useEffect(() => {
    dispatch(fetchPackagesByStatus(status));
    // If status is dispatch, also fetch completed transactions
    if (status === "dispatch") {
      api.get("/completed-transactions").then((res) => {
        // Extract package info from completed transactions
        const completedPackages = res.data
          .map((tx: any) => tx.packageId)
          .filter((pkg: any) => pkg && pkg.status === "dispatch");
        setCompletedDispatchPackages(completedPackages);
      });
    } else {
      setCompletedDispatchPackages([]);
    }
  }, [dispatch, status]);

  // Get packages for the current status
  let packages =
    packagesByStatus[status as keyof typeof packagesByStatus] || [];
  // Merge with completed dispatch packages if status is dispatch
  if (status === "dispatch" && completedDispatchPackages.length > 0) {
    // Avoid duplicates by _id
    const ids = new Set(packages.map((p: any) => p._id || p.id));
    packages = [
      ...packages,
      ...completedDispatchPackages.filter(
        (pkg: any) => !ids.has(pkg._id || pkg.id)
      ),
    ];
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Packages by Status
          </h1>
          <p className="text-muted-foreground">
            View and manage your packages based on their current status
          </p>
        </div>
      </div>

      {status === "dispatch" ? (
        <DispatchPackages />
      ) : (
        <PackagesByStatus
          packages={packages}
          status={status}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
