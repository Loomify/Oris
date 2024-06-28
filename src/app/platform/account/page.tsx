import AccountComponent from "@/components/platform/AccountComponent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Account() {
    let auth_cookie = cookies().get('horizon_token')
    if (auth_cookie != null) {
        return redirect('/platform')
    }
    return (
        <AccountComponent />
    )
}