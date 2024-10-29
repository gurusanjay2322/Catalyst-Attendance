import { useCallback, useEffect, useState } from "react";

function UserProfile({ userDetails, isAuthenticated }) {
  const logout = useCallback(() => {
    const redirectURL = "/__catalyst/auth/login";
    window.catalyst.auth.signOut(redirectURL);
    // Clear the local storage on logout
    localStorage.removeItem("checkIn");
    localStorage.removeItem("checkInTime");
    localStorage.removeItem("workedTime");
    localStorage.removeItem("hasCheckedIn"); // Track whether the user has checked in
  }, []);

  const [checkIn, setCheckIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workedTime, setWorkedTime] = useState(null);

  useEffect(() => {
    // Check for persisted data in local storage on component mount
    const persistedCheckIn = localStorage.getItem("checkIn") === "true";
    const persistedCheckInTime = localStorage.getItem("checkInTime");
    const persistedWorkedTime = localStorage.getItem("workedTime");
    const hasCheckedIn = localStorage.getItem("hasCheckedIn") === "true";

    if (isAuthenticated) {
      setCheckIn(persistedCheckIn);
      setCheckInTime(persistedCheckInTime ? new Date(persistedCheckInTime) : null);
      setWorkedTime(persistedWorkedTime);
      
      // Only check in automatically if the user hasn't checked in before
      if (!persistedCheckIn && !hasCheckedIn) {
        const currentTime = new Date();
        setCheckInTime(currentTime);
        setCheckIn(true);
        localStorage.setItem("checkIn", "true");
        localStorage.setItem("checkInTime", currentTime);
        localStorage.setItem("hasCheckedIn", "true"); // Set this flag to true
        console.log("Checked in automatically at: ", currentTime);
      }
    }
  }, [isAuthenticated]);

  const calculateWork = () => {
    if (!checkIn) {
      const currentTime = new Date();
      setCheckInTime(currentTime);
      setCheckIn(true);
      localStorage.setItem("checkIn", "true");
      localStorage.setItem("checkInTime", currentTime);
      console.log("Checked in at: ", currentTime);
    } else {
      const currentCheckOutTime = new Date();
      const timeDifference = currentCheckOutTime - checkInTime;
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      let formattedTime;
      if (hours > 0) {
        formattedTime = `${hours} ${hours === 1 ? "hour" : "hours"}`;
      } else if (minutes > 0) {
        formattedTime = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
      } else {
        formattedTime = `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
      }

      setWorkedTime(formattedTime);
      setCheckOutTime(currentCheckOutTime);
      console.log(
        `Checked out at: ${currentCheckOutTime}. You worked for ${formattedTime}.`
      );

      // Reset check-in state
      setCheckIn(false);
      localStorage.setItem("checkIn", "false");
      localStorage.setItem("workedTime", formattedTime);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="h-auto w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] bg-white shadow-lg rounded-lg border border-gray-300 p-6">
        <div className="flex justify-center mb-6">
          <img
            alt="usericon"
            id="userimg"
            width="100px"
            height="100px"
            src="https://cdn2.iconfinder.com/data/icons/user-management/512/profile_settings-512.png"
            className="rounded-full border border-gray-300 p-2"
          />
        </div>
        <div className="flex justify-center text-4xl font-mono mb-6 text-gray-700">
          <p>User Profile</p>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-4">
              <p className="text-lg font-semibold text-gray-600">First Name:</p>
              <p className="text-lg text-gray-700">{userDetails.firstName}</p>
            </div>
            <div className="flex flex-row space-x-4">
              <p className="text-lg font-semibold text-gray-600">Last Name:</p>
              <p className="text-lg text-gray-700">{userDetails.lastName}</p>
            </div>
            <div className="flex flex-row space-x-4">
              <p className="text-lg font-semibold text-gray-600">Mail ID:</p>
              <p className="text-lg text-gray-700">{userDetails.mailid}</p>
            </div>
            <div className="flex flex-row space-x-4">
              <p className="text-lg font-semibold text-gray-600">Time Zone:</p>
              <p className="text-lg text-gray-700">{userDetails.timeZone}</p>
            </div>
            <div className="flex flex-row space-x-4">
              <p className="text-lg font-semibold text-gray-600">Created Time:</p>
              <p className="text-lg text-gray-700">{userDetails.createdTime}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={calculateWork}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            {!checkIn ? "Check In" : "Check Out"}
          </button>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={logout}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="h-auto w-[90%] sm:w-[60%] md:w-[50%] lg:w-[30%] bg-white shadow-lg rounded-lg border border-gray-300 p-6">
        {workedTime && (
          <div className="flex flex-col justify-center text-xx font-mono mt-4">
            <p>Checked in At: {checkInTime && checkInTime.toLocaleString()}</p>
            <p>Checked Out At: {checkOutTime && checkOutTime.toLocaleString()}</p>
            <p>You worked for {workedTime}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
