
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useRequireAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/sign-in"); 
    }
  }, [navigate]);

  return isAuthenticated;
}

export default useRequireAuth;
