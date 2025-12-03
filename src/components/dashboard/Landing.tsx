import React from "react";
import LoginModal from "../LoginModal";

export const LandingPage = ({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) => {
  const [loginOpen, setLoginOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Asset Manager
        </h1>
        <p className="text-lg mb-6 text-center max-w-xl">
          Streamline your asset management with an intuitive platform for tracking,
          organizing, and managing organizational assets efficiently.
        </p>
        <div className="flex gap-4 mb-8">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => setLoginOpen(true)}
          >
            Login
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold text-lg mb-2">Track Assets</h2>
            <p>
              Maintain a comprehensive inventory of all organizational assets
              with detailed information.
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold text-lg mb-2">Organize by Category</h2>
            <p>
              Categorize and manage assets by type, department, and purchase date
              for better organization.
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold text-lg mb-2">Role-Based Access</h2>
            <p>
              Admin and user roles with tailored dashboards and permissions for
              secure asset management.
            </p>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={loginOpen}
        onOpenChange={setLoginOpen}
        incrementLoading={incrementLoading}
        decrementLoading={decrementLoading}
      />
    </>
  );
};
