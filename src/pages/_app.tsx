import Loading from "@/components/Loading";
import "@/styles/globals.css";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store/store";
import { ThemeSwitcher } from "./../components/ThemeSwitcher";
import Navbar_Guest from "@/components/Navbar-Guest";
import Navbar_Staff from "@/components/Navbar-Staff";
import { rehydrate } from "@/store/slices/authSlice";
import Head from "next/head";
import { useRouter } from "next/router";

function AppContent({
  Component,
  pageProps,
  darkMode,
  incrementLoading,
  decrementLoading,
  saveDarkMode,
  loading,
  resetLoading,
}: any) {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(user);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync isAuthenticated with Redux store's user
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed.user) {
          dispatch(rehydrate(parsed));
          const roles = parsed.user.roles;
          const isAdminUser = roles && roles.includes("ADMIN");
          setIsAdmin(isAdminUser);
          localStorage.setItem("isAdmin", isAdminUser);

          document.cookie = `isAdmin=${isAdminUser}; path=/`;
          document.cookie = `userId=${parsed.user.id}; path=/`;
        }
      } catch {}
    }
  }, [dispatch]);

  useEffect(() => {
    const adminRoutes = ["/user", "/department", "/category"];
    const isAdminRoute = adminRoutes.some((route) =>
      router.pathname.startsWith(route)
    );
    const isAdminUser = localStorage.getItem("isAdmin") === "true";

    if (isAdminRoute && !isAdminUser) {
      router.push("/");
    }
  }, [router.pathname, router]);

  let navbar = (
    <Navbar_Guest
      incrementLoading={incrementLoading}
      decrementLoading={decrementLoading}
    />
  );
  if (user) {
    navbar = (
      <Navbar_Staff
        incrementLoading={incrementLoading}
        decrementLoading={decrementLoading}
      />
    );
  }

  return (
    <main
      className={`text-foreground bg-background h-full w-full relative flex flex-col`}
    >
      <Head>
        <title>Practical Interview</title>
      </Head>
      <ThemeSwitcher saveDarkMode={saveDarkMode} darkMode={darkMode} />
      {navbar}
      <Loading isOpen={loading} />
      <Component
        {...pageProps}
        incrementLoading={incrementLoading}
        decrementLoading={decrementLoading}
        resetLoading={resetLoading}
        isAuthenticated={isAuthenticated}
      />
    </main>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [loading, setLoading] = React.useState(0);

  const incrementLoading = () => {
    setLoading((prev) => prev + 1);
  };

  const decrementLoading = () => {
    setLoading((prev) => prev - 1);
  };

  const saveDarkMode = (darkMode: boolean) => {
    setDarkMode(darkMode);
    window.localStorage.setItem("darkMode", darkMode.toString());
  };

  const resetLoading = () => {
    setLoading(0);
  };

  React.useEffect(() => {
    const darkMode = window.localStorage.getItem("darkMode");
    if (darkMode) {
      setDarkMode(darkMode === "true");
    } else {
      saveDarkMode(false);
    }
  }, []);

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <HeroUIProvider className={`h-dvh w-dvw overflow-hidden `}>
      <ToastProvider />
      <Provider store={store}>
        <AppContent
          Component={Component}
          pageProps={pageProps}
          darkMode={darkMode}
          incrementLoading={incrementLoading}
          decrementLoading={decrementLoading}
          saveDarkMode={saveDarkMode}
          loading={loading !== 0}
          resetLoading={resetLoading}
        />
      </Provider>
    </HeroUIProvider>
  );
}
