import React, { useState } from "react";
import { Shield, Lock, User, AlertTriangle } from "lucide-react";

export default function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
  });

  const handlePasswordPolicyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setPasswordPolicy({
      ...passwordPolicy,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value)
          : value,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Security Settings</h1>

      <div className="space-y-8">
        {/* Two-Factor Authentication */}
        <div className=" border border-border rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-primary mr-3" />
              <h2 className="text-lg font-semibold">
                Two-Factor Authentication
              </h2>
            </div>
            <p className="text-muted-foreground mt-2">
              Add an extra layer of security to your admin account by enabling
              two-factor authentication.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  Enable Two-Factor Authentication
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Require a verification code in addition to password when
                  admins log in.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {twoFactorEnabled && (
              <div className="mt-6 p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">
                  Two-Factor Authentication Methods
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="2fa-app"
                      type="radio"
                      name="2fa-method"
                      className="w-4 h-4 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <label
                      htmlFor="2fa-app"
                      className="ml-2 text-sm font-medium"
                    >
                      Authenticator App (Google Authenticator, Authy)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="2fa-sms"
                      type="radio"
                      name="2fa-method"
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="2fa-sms"
                      className="ml-2 text-sm font-medium"
                    >
                      SMS Verification
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="2fa-email"
                      type="radio"
                      name="2fa-method"
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="2fa-email"
                      className="ml-2 text-sm font-medium"
                    >
                      Email Verification
                    </label>
                  </div>
                </div>

                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">
                  Configure Two-Factor Authentication
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Session Management */}
        <div className=" border border-border rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center">
              <User className="w-5 h-5 text-primary mr-3" />
              <h2 className="text-lg font-semibold">Session Management</h2>
            </div>
            <p className="text-muted-foreground mt-2">
              Configure session timeout and other session-related security
              settings.
            </p>
          </div>

          <div className="p-6">
            <div className="max-w-md">
              <div className="mb-4">
                <label
                  htmlFor="session-timeout"
                  className="block font-medium mb-2"
                >
                  Session Timeout (minutes)
                </label>
                <select
                  id="session-timeout"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically log out inactive users after the specified time.
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Force Single Session</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prevent users from being logged in from multiple devices
                    simultaneously.
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

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Log IP Address Changes</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Alert users when their account is accessed from a new IP
                    address.
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
            </div>
          </div>
        </div>

        {/* Password Policy */}
        <div className=" border border-border rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-primary mr-3" />
              <h2 className="text-lg font-semibold">Password Policy</h2>
            </div>
            <p className="text-muted-foreground mt-2">
              Set password requirements and expiration policies for all users.
            </p>
          </div>

          <div className="p-6">
            <div className="max-w-md">
              <div className="mb-4">
                <label htmlFor="min-length" className="block font-medium mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  id="min-length"
                  name="minLength"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  min="6"
                  max="32"
                  value={passwordPolicy.minLength}
                  onChange={handlePasswordPolicyChange}
                />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <input
                    id="require-uppercase"
                    type="checkbox"
                    name="requireUppercase"
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                    checked={passwordPolicy.requireUppercase}
                    onChange={handlePasswordPolicyChange}
                  />
                  <label
                    htmlFor="require-uppercase"
                    className="ml-2 text-sm font-medium"
                  >
                    Require at least one uppercase letter
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="require-lowercase"
                    type="checkbox"
                    name="requireLowercase"
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                    checked={passwordPolicy.requireLowercase}
                    onChange={handlePasswordPolicyChange}
                  />
                  <label
                    htmlFor="require-lowercase"
                    className="ml-2 text-sm font-medium"
                  >
                    Require at least one lowercase letter
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="require-numbers"
                    type="checkbox"
                    name="requireNumbers"
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                    checked={passwordPolicy.requireNumbers}
                    onChange={handlePasswordPolicyChange}
                  />
                  <label
                    htmlFor="require-numbers"
                    className="ml-2 text-sm font-medium"
                  >
                    Require at least one number
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="require-special"
                    type="checkbox"
                    name="requireSpecialChars"
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                    checked={passwordPolicy.requireSpecialChars}
                    onChange={handlePasswordPolicyChange}
                  />
                  <label
                    htmlFor="require-special"
                    className="ml-2 text-sm font-medium"
                  >
                    Require at least one special character
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password-expiry"
                  className="block font-medium mb-2"
                >
                  Password Expiration (days)
                </label>
                <input
                  type="number"
                  id="password-expiry"
                  name="expiryDays"
                  className="w-full border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary "
                  min="0"
                  max="365"
                  value={passwordPolicy.expiryDays}
                  onChange={handlePasswordPolicyChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Set to 0 for no expiration.
                </p>
              </div>

              <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Changing password policies will apply to new passwords only.
                  Existing users will be required to comply with the new policy
                  when they next change their password.
                </p>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90">
                  Save Password Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
