// src/AuthContext.tsx
import React, { createContext, useState, useEffect, FC } from "react";
import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, AuthProviderProps, AuthTokens } from "../../types";
import axios from "../axios/AxiosSetup";
import { AxiosError } from "axios";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens") as string)
      : null
  );
  const [user, setUser] = useState<JwtPayload | null>(
    localStorage.getItem("authTokens")
      ? jwtDecode(
          JSON.parse(localStorage.getItem("authTokens") as string).access
        )
      : null
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  const [tokenUpdated, setTokenUpdated] = useState<boolean>(false);
  const navigate = useNavigate();

  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formElem: HTMLFormElement = e.target as HTMLFormElement;

    if (!formElem || !formElem.email) {
      console.error("Invalid form event. Unable to retrieve email.");
      return;
    }

    const formData = {
      email: formElem.email.value,
      password: formElem.password.value,
    };

    try {
      let response = await axios.post(`token/`, formData);
      let data = response.data;
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
      } else {
        setMessage(data.detail);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) setMessage(error.response?.data.detail);
    }
  };

  const logoutUser = (): void => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

  const updateToken = async (): Promise<void> => {
    const formData = {
      refresh: authTokens?.refresh,
    };

    if (!formData.refresh) {
      console.log("logging user out 1");
      logoutUser();
      return;
    }

    try {
      let response = await axios.post(`token/refresh/`, formData);
      let data = response.data;

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        console.log("logging user out 2");
        logoutUser();
      }
    } catch (error) {
      console.log(error);
      console.log("logging user out 3");
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }

    setTokenUpdated((tokenUpdated) => !tokenUpdated);
  };

  useEffect(() => {
    let refreshTime = 1000 * 60 * 60 * 23; // 23 hours
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
        console.log("Token refreshed");
      } else {
        console.log("No authTokens so can't refresh");
      }
    }, refreshTime);
    return () => clearInterval(interval);
  }, [authTokens]);

  function isTokenExpired(token: string) {
    const decodedToken: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
    if (!decodedToken.exp) {
      return false;
    }
    return decodedToken.exp < currentTime;
  }

  useEffect(() => {
    if (authTokens) {
      const accessToken = authTokens.access;
      if (isTokenExpired(accessToken)) {
        console.log("calling update token cause access token expired");
        updateToken();
        // window.location.reload();
      }
    }
  }, [authTokens]);

  const [contextData, setContextData] = useState<AuthContextProps>({
    message,
    user,
    loginUser,
    logoutUser,
    updateToken,
  });

  useEffect(() => {
    setContextData({
      message,
      user,
      loginUser,
      logoutUser,
      updateToken,
    });
  }, [tokenUpdated, message, user]);
  // const contextData: AuthContextProps = {
  //   message,
  //   user,
  //   loginUser,
  //   logoutUser,
  //   updateToken,
  // };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
