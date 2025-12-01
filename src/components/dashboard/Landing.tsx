import React from "react";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";

export const LandingPage = ({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) => {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Neonatal Management System
        </h1>
        <p className="text-lg mb-6 text-center max-w-xl">
          Empowering better newborn care through data-driven insights,
          streamlined tracking, and comprehensive staff training.
          Mobile-friendly and easy to use for all neonatal care teams.
        </p>
        <div className="flex gap-4 mb-8">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => setLoginOpen(true)}
          >
            Login
          </button>
          <button className="bg-gray-200 text-blue-700 px-6 py-2 rounded">
            Register
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold text-lg mb-2">Track Neonatal Data</h2>
            <p>
              Capture and monitor vital information for every newborn in your
              care.
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold text-lg mb-2">Analyze Outcomes</h2>
            <p>
              Visualize trends and outcomes to improve care quality and
              decision-making.
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold text-lg mb-2">Staff Training</h2>
            <p>
              Access and track completion of essential neonatal care training
              modules.
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
      <RegisterModal
        isOpen={registerOpen}
        onOpenChange={setRegisterOpen}
        incrementLoading={incrementLoading}
        decrementLoading={decrementLoading}
      />
    </>
  );
};
