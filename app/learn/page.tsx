import { redirect, RedirectType } from "next/navigation";

export default function Learn() {
  redirect("/learn/dfs", RedirectType.replace);
}
