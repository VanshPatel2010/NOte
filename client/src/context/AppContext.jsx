import { createContext, useState, useEffect } from "react";

export const AppContent = createContext();

export const AppContextProvider = (props)=>{
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const value = {
        backendURL,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData
    }
    useEffect(() => {
    fetch(backendURL + "api/user/data", {
      method: "GET",
      credentials: "include" // send cookie along
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserData(data.data); // {name, email}
            setIsLoggedIn(true);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [backendURL]);
    return(
            <AppContent.Provider value={value}>
                {props.children}
            </AppContent.Provider>
    )
}