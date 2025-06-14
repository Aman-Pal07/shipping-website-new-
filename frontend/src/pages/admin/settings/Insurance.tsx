import React, { useState } from "react";
import { Shield, Percent, DollarSign, PlusCircle, Trash2 } from "lucide-react";

// Sample insurance plans
const initialInsurancePlans = [
  {
    id: 1,
    name: "Basic Coverage",
    description: "Basic protection for packages up to ₹10,000 in value",
    coverageAmount: 10000,
    premium: 2.5, // percentage
    isDefault: true,
    isActive: true,
  },
  {
    id: 2,
    name: "Standard Coverage",
    description: "Standard protection for packages up to ₹25,000 in value",
    coverageAmount: 25000,
    premium: 3.0, // percentage
    isDefault: false,
    isActive: true,
  },
  {
    id: 3,
    name: "Premium Coverage",
    description: "Enhanced protection for packages up to ₹50,000 in value",
    coverageAmount: 50000,
    premium: 3.5, // percentage
    isDefault: false,
    isActive: true,
  },
  {
    id: 4,
    name: "Elite Coverage",
    description: "Maximum protection for packages up to ₹100,000 in value",
    coverageAmount: 100000,
    premium: 4.0, // percentage
    isDefault: false,
    isActive: true,
  },
];

export default function Insurance() {
  const [insurancePlans, setInsurancePlans] = useState(initialInsurancePlans);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    coverageAmount: 0,
    premium: 0,
    isDefault: false,
    isActive: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setNewPlan({
      ...newPlan,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewPlan({
      ...newPlan,
      [name]: checked,
    });
  };

  const handleAddPlan = () => {
    if (!newPlan.name || newPlan.coverageAmount <= 0 || newPlan.premium <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    const newId = Math.max(...insurancePlans.map((plan) => plan.id)) + 1;

    // If the new plan is set as default, update other plans
    let updatedPlans = insurancePlans;
    if (newPlan.isDefault) {
      updatedPlans = insurancePlans.map((plan) => ({
        ...plan,
        isDefault: false,
      }));
    }

    setInsurancePlans([
      ...updatedPlans,
      {
        ...newPlan,
        id: newId,
      },
    ]);

    // Reset form
    setNewPlan({
      name: "",
      description: "",
      coverageAmount: 0,
      premium: 0,
      isDefault: false,
      isActive: true,
    });
    setIsAddingPlan(false);
  };

  const handleSetDefault = (id: number) => {
    setInsurancePlans(
      insurancePlans.map((plan) => ({
        ...plan,
        isDefault: plan.id === id,
      }))
    );
  };

  const handleToggleActive = (id: number) => {
    setInsurancePlans(
      insurancePlans.map((plan) => {
        if (plan.id === id) {
          // Don't allow deactivating the default plan
          if (plan.isDefault && plan.isActive) {
            alert(
              "Cannot deactivate the default plan. Please set another plan as default first."
            );
            return plan;
          }
          return { ...plan, isActive: !plan.isActive };
        }
        return plan;
      })
    );
  };

  const handleDeletePlan = (id: number) => {
    const planToDelete = insurancePlans.find((plan) => plan.id === id);

    if (planToDelete?.isDefault) {
      alert(
        "Cannot delete the default plan. Please set another plan as default first."
      );
      return;
    }

    if (
      window.confirm("Are you sure you want to delete this insurance plan?")
    ) {
      setInsurancePlans(insurancePlans.filter((plan) => plan.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Insurance Settings</h1>

      <div className="space-y-8">
        {/* Insurance Plans */}
        <div className=" border border-border rounded-lg shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-primary mr-3" />
              <h2 className="text-lg font-semibold">Insurance Plans</h2>
            </div>
            <button
              className="flex items-center text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90"
              onClick={() => setIsAddingPlan(true)}
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add New Plan
            </button>
          </div>

          <div className="p-6">
            {isAddingPlan ? (
              <div className="bg-muted p-4 rounded-md mb-6">
                <h3 className="font-medium mb-4">Add New Insurance Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Plan Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                      value={newPlan.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="coverageAmount"
                      className="block text-sm font-medium mb-1"
                    >
                      Coverage Amount (₹)*
                    </label>
                    <input
                      type="number"
                      id="coverageAmount"
                      name="coverageAmount"
                      className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                      value={newPlan.coverageAmount || ""}
                      onChange={handleInputChange}
                      min="1000"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                    value={newPlan.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="premium"
                    className="block text-sm font-medium mb-1"
                  >
                    Premium Rate (%)*
                  </label>
                  <input
                    type="number"
                    id="premium"
                    name="premium"
                    className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                    value={newPlan.premium || ""}
                    onChange={handleInputChange}
                    min="0.1"
                    step="0.1"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of the package value charged as premium
                  </p>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                    checked={newPlan.isDefault}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm">
                    Set as default plan
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border border-input rounded-md text-sm hover:bg-muted"
                    onClick={() => setIsAddingPlan(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
                    onClick={handleAddPlan}
                  >
                    Add Plan
                  </button>
                </div>
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">
                      Plan Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Coverage
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Premium Rate
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {insurancePlans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {plan.name}
                        {plan.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {plan.description}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-primary mr-1" />
                          <span>
                            Up to {formatCurrency(plan.coverageAmount)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Percent className="w-4 h-4 text-primary mr-1" />
                          <span>{plan.premium.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            plan.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {!plan.isDefault && (
                            <button
                              className="text-xs px-2 py-1 border border-input rounded-md hover:bg-muted"
                              onClick={() => handleSetDefault(plan.id)}
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            className={`text-xs px-2 py-1 border border-input rounded-md hover:bg-muted ${
                              plan.isDefault && plan.isActive
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleToggleActive(plan.id)}
                          >
                            {plan.isActive ? "Deactivate" : "Activate"}
                          </button>
                          {!plan.isDefault && (
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeletePlan(plan.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Insurance Settings */}
        <div className=" border border-border rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-primary mr-3" />
              <h2 className="text-lg font-semibold">
                General Insurance Settings
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">
                    Require Insurance for High-Value Packages
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically require insurance for packages valued over
                    ₹25,000
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Allow Insurance Claims Online</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable customers to file insurance claims through their
                    account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="claim-period"
                  className="block font-medium mb-2"
                >
                  Claim Filing Period (days)
                </label>
                <input
                  type="number"
                  id="claim-period"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  defaultValue={30}
                  min={1}
                  max={90}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Number of days after delivery that a customer can file a claim
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="claim-process"
                  className="block font-medium mb-2"
                >
                  Claim Processing Time (days)
                </label>
                <input
                  type="number"
                  id="claim-process"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  defaultValue={7}
                  min={1}
                  max={30}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Target number of days to process and resolve insurance claims
                </p>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
