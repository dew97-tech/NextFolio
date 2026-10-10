"use server";

import { auth } from "@/auth";
import {
  activateGoogleAccount,
  type ActivateAccountResult,
} from "@/app/lib/google/accounts";
import { revalidatePath } from "next/cache";

export async function switchGoogleAccount(
  label: string,
): Promise<ActivateAccountResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const result = await activateGoogleAccount(label);
  if (result.ok) {
    revalidatePath("/admin/settings");
    revalidatePath("/admin/keywords");
  }
  return result;
}
