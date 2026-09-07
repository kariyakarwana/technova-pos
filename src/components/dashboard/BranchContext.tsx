"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type BranchOption = { id: string; code: string; name: string; isActive: boolean };
type BranchContextValue = { branches: BranchOption[]; branchId: string; branch: BranchOption | null; setBranchId: (id: string) => void };
const BranchContext = createContext<BranchContextValue | null>(null);

export function BranchProvider({ branches, children }: { branches: BranchOption[]; children: React.ReactNode }) {
  const available = useMemo(() => branches.filter((branch) => branch.isActive), [branches]);
  const [branchId, setBranchIdState] = useState(available[0]?.id ?? "");
  useEffect(() => {
    const stored = window.localStorage.getItem("technova_branch_id");
    if (stored && available.some((branch) => branch.id === stored)) {
      setBranchIdState(stored);
    } else if (available[0]?.id) {
      setBranchIdState(available[0].id);
      window.localStorage.setItem("technova_branch_id", available[0].id);
    } else {
      setBranchIdState("");
      window.localStorage.removeItem("technova_branch_id");
    }
  }, [available]);
  function setBranchId(id: string) { setBranchIdState(id); window.localStorage.setItem("technova_branch_id", id); }
  const value = useMemo(() => ({ branches: available, branchId, branch: available.find((item) => item.id === branchId) ?? null, setBranchId }), [available, branchId]);
  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const value = useContext(BranchContext);
  if (!value) throw new Error("useBranch must be used inside BranchProvider.");
  return value;
}
