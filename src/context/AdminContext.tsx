"use client";

import { createContext, useState } from "react";

interface AdminContextData {
  openUserDrawer: boolean;
  setOpenUserDrawer: (open: boolean) => void;
  openEditUser: boolean;
  setOpenEditUser: (open: boolean) => void;
  openBackupDrawer: boolean;
  setOpenBackupDrawer: (open: boolean) => void;
  openRestoreDrawer: boolean;
  setOpenRestoreDrawer: (open: boolean) => void;
}

export const AdminContext = createContext({} as AdminContextData);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [openUserDrawer, setOpenUserDrawer] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openBackupDrawer, setOpenBackupDrawer] = useState(false);
  const [openRestoreDrawer, setOpenRestoreDrawer] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        openUserDrawer,
        setOpenUserDrawer,
        openEditUser,
        setOpenEditUser,
        openBackupDrawer,
        setOpenBackupDrawer,
        openRestoreDrawer,
        setOpenRestoreDrawer,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
