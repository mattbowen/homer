import Head from "next/head";
import { type NextPage } from "next";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Login: NextPage = () => {
  const supabase = useSupabaseClient();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="container" style={{ padding: "50px 0 100px 0" }}>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              view="magic_link"
              magicLink={true}
              redirectTo='/'
              showLinks={false}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
