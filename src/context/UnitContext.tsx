"use client";
import { createContext, useState } from "react";

interface UnitContextProps {
  children: React.ReactNode;
}

interface UnitContextData {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  openEditUnit: boolean;
  setOpenEditUnit: (open: boolean) => void;
}

export const UnitContext = createContext({} as UnitContextData);

export const UnitProvider = ({ children }: UnitContextProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEditUnit, setOpenEditUnit] = useState(false);
  return (
    <UnitContext.Provider
      value={{
        openDrawer,
        setOpenDrawer,
        openEditUnit,
        setOpenEditUnit,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
};
