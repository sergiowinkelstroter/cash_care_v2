"use client";

import { createContext, useState } from "react";

interface AdminContextData {
  openUserDrawer: boolean;
  setOpenUserDrawer: (open: boolean) => void;
  openEditUser: boolean;
  setOpenEditUser: (open: boolean) => void;
}

export const AdminContext = createContext({} as AdminContextData);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [openUserDrawer, setOpenUserDrawer] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  return (
    <AdminContext.Provider
      value={{
        openUserDrawer,
        setOpenUserDrawer,
        openEditUser,
        setOpenEditUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
