import React, { useState } from "react";
import { Home, PlusCircle, Edit, Trash2, Check } from "lucide-react";

// Sample address data
const initialAddresses = [
  {
    id: 1,
    name: "Home",
    addressLine1: "123 Main Street",
    addressLine2: "Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    phone: "+91 9876543210",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    addressLine1: "456 Business Park",
    addressLine2: "Building C, Floor 5",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400051",
    country: "India",
    phone: "+91 9876543211",
    isDefault: false,
  },
  {
    id: 3,
    name: "Parents",
    addressLine1: "789 Family Road",
    addressLine2: "",
    city: "Delhi",
    state: "Delhi",
    postalCode: "110001",
    country: "India",
    phone: "+91 9876543212",
    isDefault: false,
  },
];

interface Address {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function Address() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: checked,
    });
  };

  const resetForm = () => {
    setNewAddress({
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
      isDefault: false,
    });
  };

  const handleAddAddress = () => {
    // Basic validation
    if (
      !newAddress.name ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.phone
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newId = Math.max(...addresses.map((addr) => addr.id)) + 1;

    // If the new address is set as default, update other addresses
    let updatedAddresses = addresses;
    if (newAddress.isDefault) {
      updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    setAddresses([
      ...updatedAddresses,
      {
        ...newAddress,
        id: newId,
      },
    ]);

    // Reset form and close it
    resetForm();
    setIsAddingAddress(false);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setNewAddress({
      name: address.name,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setIsAddingAddress(true);
  };

  const handleUpdateAddress = () => {
    // Basic validation
    if (
      !newAddress.name ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.phone
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // If the edited address is set as default, update other addresses
    let updatedAddresses = addresses;
    if (newAddress.isDefault) {
      updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    setAddresses(
      updatedAddresses.map((addr) =>
        addr.id === editingAddressId
          ? { ...newAddress, id: editingAddressId }
          : addr
      )
    );

    // Reset form and close it
    resetForm();
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id: number) => {
    const addressToDelete = addresses.find((addr) => addr.id === id);

    if (addressToDelete?.isDefault) {
      alert(
        "Cannot delete the default address. Please set another address as default first."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">My Addresses</h1>
        <button
          className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          onClick={() => {
            resetForm();
            setEditingAddressId(null);
            setIsAddingAddress(true);
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Address
        </button>
      </div>

      {isAddingAddress && (
        <div className=" border border-border rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Address Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  placeholder="Home, Office, etc."
                  value={newAddress.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number*
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  placeholder="+91 9876543210"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="addressLine1"
                  className="block text-sm font-medium mb-1"
                >
                  Address Line 1*
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  placeholder="Street address, P.O. box, company name"
                  value={newAddress.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="addressLine2"
                  className="block text-sm font-medium mb-1"
                >
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={newAddress.addressLine2}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-1"
                >
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={newAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium mb-1"
                >
                  State/Province*
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={newAddress.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium mb-1"
                >
                  Postal Code*
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={newAddress.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-1"
                >
                  Country*
                </label>
                <select
                  id="country"
                  name="country"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={newAddress.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                    checked={newAddress.isDefault}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm">
                    Set as default address
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border border-input rounded-md text-sm hover:bg-muted"
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddressId(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
                onClick={
                  editingAddressId ? handleUpdateAddress : handleAddAddress
                }
              >
                {editingAddressId ? "Update Address" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={` border ${
              address.isDefault ? "border-primary" : "border-border"
            } rounded-lg shadow-sm p-6 relative`}
          >
            {address.isDefault && (
              <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                <Check className="w-3 h-3 mr-1" />
                Default
              </div>
            )}

            <div className="flex items-center mb-4">
              <Home className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold">{address.name}</h3>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <p className="mt-2">{address.phone}</p>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 border border-input rounded-md text-xs hover:bg-muted flex items-center"
                onClick={() => handleEditAddress(address)}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </button>

              {!address.isDefault && (
                <button
                  className="px-3 py-1.5 border border-input rounded-md text-xs hover:bg-muted flex items-center"
                  onClick={() => handleSetDefault(address.id)}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Set Default
                </button>
              )}

              {!address.isDefault && (
                <button
                  className="px-3 py-1.5 border border-red-200 text-red-500 rounded-md text-xs hover:bg-red-50 flex items-center"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
